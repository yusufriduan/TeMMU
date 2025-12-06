"use client";

import { useEffect, useState } from "react";
import { Button } from "@headlessui/react";
import ImageWithFallback from "../components/image_with_fallback";
import { University } from "lucide-react";
import { supabase } from "../../lib/supabase";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: "Profile Name Placeholder",
    institution: "University Placeholder",
    email: "Email Placeholder",
    studentType: "Student Placeholder",
  });
  const [formData, setFormData] = useState(profileData);
  const [imgSource, setImgSource] = useState("");
  const [userID, setUserID] = useState<number>();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id === "full-name"
        ? "fullName"
        : id === "institution-name"
        ? "institution"
        : id === "email"
        ? "email"
        : id === "student-type"
        ? "studentType"
        : id]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const url = URL.createObjectURL(file);
    setImgSource(url);
  };

  const handleSaveChanges = () => {
    setProfileData(formData);
    setIsEditing(false);
    updateDB();
  };

  async function blobToUint8Array(blob: Blob): Promise<Uint8Array> {
    const arrayBuffer = await blob.arrayBuffer();
    return new Uint8Array(arrayBuffer);
  }

  function uint8ArrayToHex(bytes: Uint8Array): string {
    return (
      "\\x" +
      Array.from(bytes)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")
    );
  }

  async function updateDB() {
    if (userID != -1) {
      const blobFromUrl = await fetch(imgSource).then((res) => res.blob());
      const bytes = await blobToUint8Array(blobFromUrl);
      const hexString = uint8ArrayToHex(bytes);

      const { data, error } = await supabase
        .from("Clients")
        .update({
          client_name: profileData.fullName,
          client_email: profileData.email,
          client_type: profileData.studentType,
          profile_picture: hexString,
          university: profileData.institution,
        })
        .eq("client_id", userID);

      if (data) {
        console.log("DB Update success");
      } else {
        console.log(error);
      }
    } else {
      router.push("/login");
    }
  }

  function hexToUint8Array(hex: string): Uint8Array {
    // Remove leading \x if present
    if (hex.startsWith("\\x")) {
      hex = hex.slice(2);
    }
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
    }
    return bytes;
  }

  function guessImageType(buffer: Buffer): string {
    if (
      buffer
        .slice(0, 8)
        .equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
    ) {
      return "png";
    }
    if (buffer.slice(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]))) {
      return "jpg";
    }
    return "bin";
  }

  const router = useRouter();

  useEffect(() => {
    let user: number = -1;
    if (localStorage.getItem("User")) {
      user = Number(localStorage.getItem("User"));
    } else if (Cookies.get("User")) {
      user = Number(Cookies.get("User"));
    } else {
      router.push("/login");
    }

    setUserID(user);

    async function getData() {
      const { data, error } = await supabase
        .from("Clients")
        .select("*")
        .eq("client_id", user)
        .single();

      if (data) {
        const newProfile = {
          fullName: data.client_name,
          institution: data.university,
          email: data.client_email,
          studentType: data.client_type,
        };
        setProfileData(newProfile);

        setFormData(newProfile);

        if (data.profile_picture != null) {
          console.log(typeof data.profile_picture);
          const bytes: Uint8Array = hexToUint8Array(data.profile_picture);
          console.log(bytes);
          const imgType = guessImageType(Buffer.from(bytes));
          const blob = new Blob([bytes.buffer as ArrayBuffer], {
            type: `image/${imgType}`,
          });
          console.log(blob);
          const url = URL.createObjectURL(blob);
          setImgSource(url);
        }
      }
    }

    getData();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center w-full h-screen p-4">
      <a
        className="absolute top-8 left-8 bg-blue-400 text-black px-4 py-2 rounded-4xl hover:cursor-pointer hover:scale-115 hover:bg-(--highlighted) hover:text-white shadow-lg transition-[background-color,color,scale] duration-300 ease-in-out"
        href="/"
      >
        Back to Dashboard
      </a>
      <div className="w-[80vw] bg-(--foreground) border-4 border-gray-500 shadow-2xl rounded-4xl transition-all duration-500 ease-in-out overflow-hidden">
        <div
          className={`flex flex-row h-[40vh] ${isEditing ? "hidden" : "flex"}`}
        >
          <div className="relative w-1/2 rounded-4xl border-r-4 border-gray-500 overflow-hidden">
            <ImageWithFallback
              src={
                imgSource == null || imgSource == ""
                  ? "/ebeehand.png"
                  : imgSource
              }
              alt="Profile Image"
              className="w-full h-full object-cover rounded-t-lg"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h2 className="mb-1 font-bold text-lg">{profileData.fullName}</h2>
              <div className="flex items-center gap-1 text-white/90 mb-2 badge-green">
                <University className="w-4 h-4" />
                <span className="bg-brand-softer border border-brand-subtle text-fg-brand-strong text-xs font-medium px-1.5 py-0.5 rounded">
                  {profileData.institution}
                </span>
              </div>
            </div>
          </div>
          <div className="w-1/2 p-8 flex flex-col">
            <p className="text-(--text) mb-4">
              Number of STEM Projects placeholder
            </p>
            <div className="border-t border-gray-600 w-[30vw] shadow-4xl"></div>
            <div className="mt-4">
              <p className="font-bold">Contact Details</p>
              <p className="text-(--text)">Full Name: {profileData.fullName}</p>
              <p className="text-(--text)">Email: {profileData.email}</p>
            </div>
            <div className="flex justify-end items-end h-full mt-4">
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-blue-400 text-black px-4 py-2 rounded-4xl hover:cursor-pointer hover:scale-115 hover:bg-(--highlighted) hover:text-white shadow-lg transition-[background-color,scale,color] duration-300 ease-in-out"
              >
                Edit Profile
              </Button>
            </div>
          </div>
        </div>
        <div className={`${isEditing ? "flex" : "hidden"} flex-col`}>
          {" "}
          {/* Edit Profile */}
          <div className="flex flex-row">
            <div className="w-full p-8 flex flex-col">
              <h2 className="mb-4 font-bold text-2xl">Edit Profile</h2>
              <div className="mb-4">
                <label className="block mb-2 font-medium" htmlFor="full-name">
                  Full Name
                </label>
                <input
                  type="text"
                  id="full-name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-600 rounded-lg"
                  placeholder="Enter your full name"
                />
              </div>
              <div className="mb-4">
                <label
                  className="block mb-2 font-medium"
                  htmlFor="institution-name"
                >
                  Institution Name
                </label>
                <input
                  type="text"
                  id="institution-name"
                  value={formData.institution}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-600 rounded-lg"
                  placeholder="Enter your institution name"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 font-medium" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-600 rounded-lg"
                  placeholder="Enter your email"
                />
              </div>
              <div className="mb-4">
                <label
                  className="block mb-2 font-medium"
                  htmlFor="student-type"
                >
                  Student Type
                </label>
                <input
                  type="tel"
                  id="student-type"
                  value={formData.studentType}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-600 rounded-lg"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>
            <div className="w-full p-8 flex flex-col mt-11">
              <div className="mb-4">
                <label
                  className="block mb-2 font-medium"
                  htmlFor="profile-picture"
                >
                  Profile Picture
                </label>
                <input
                  type="file"
                  id="profile-picture"
                  onChange={(e) => handleImageChange(e)}
                  className="w-full p-2 border border-gray-600 rounded-lg hover:cursor-pointer hover:scale-105 hover:bg-(--highlighted) hover:text-white transition-[border,scale,color] duration-300 ease-in-out"
                  accept="image/*"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center mb-8">
            <Button
              onClick={handleSaveChanges}
              className="m-8 bg-blue-400 text-black px-6 py-3 rounded-4xl hover:cursor-pointer hover:scale-115 hover:bg-(--highlighted) hover:text-white shadow-lg transition-[background-color,scale,color] duration-300 ease-in-out"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
