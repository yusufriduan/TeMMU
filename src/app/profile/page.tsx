"use client";

import { useState } from "react";
import { Button } from "@headlessui/react";
import ImageWithFallback from "../components/image_with_fallback";
import { University } from "lucide-react";

function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: "Profile Name Placeholder",
    institution: "University Placeholder",
    email: "Email Placeholder",
    phone: "Phone Placeholder",
  });
  const [formData, setFormData] = useState(profileData);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id === "full-name" ? "fullName" :
        id === "institution-name" ? "institution" :
          id === "email" ? "email" :
            id === "phone" ? "phone" : id]: value
    }));
  };

  const handleSaveChanges = () => {
    setProfileData(formData);
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col justify-center items-center w-full h-screen p-4">
      <a className="absolute top-8 left-8 bg-blue-400 text-black px-4 py-2 rounded-4xl hover:cursor-pointer hover:scale-115 hover:bg-(--highlighted) hover:text-white shadow-lg transition-[background-color,color,scale] duration-300 ease-in-out" href="/">Back to Dashboard</a>
      <div className="w-[80vw] bg-(--foreground) border-4 border-gray-500 shadow-2xl rounded-4xl transition-all duration-500 ease-in-out overflow-hidden">
        <div className={`flex flex-row h-[40vh] ${isEditing ? "hidden" : "flex"}`}>
          <div className="relative w-1/2 rounded-4xl border-r-4 border-gray-500 overflow-hidden">
            <ImageWithFallback
              src="/Image.png"
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
            <div className='border-t border-gray-600 w-[30vw] shadow-4xl'></div>
            <div className="mt-4">
              <p className="font-bold">Contact Details</p>
              <p className="text-(--text)">Email: {profileData.email}</p>
              <p className="text-(--text)">Phone: {profileData.phone}</p>
            </div>
            <div className="flex justify-end items-end h-full mt-4">
              <Button onClick={() => setIsEditing(true)} className="bg-blue-400 text-black px-4 py-2 rounded-4xl hover:cursor-pointer hover:scale-115 hover:bg-(--highlighted) hover:text-white shadow-lg transition-[background-color,scale,color] duration-300 ease-in-out">Edit Profile</Button>
            </div>
          </div>
        </div>
        <div className={`${isEditing ? "flex" : "hidden"} flex-col`}> {/* Edit Profile */}
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
                <label className="block mb-2 font-medium" htmlFor="institution-name">
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
                <label className="block mb-2 font-medium" htmlFor="phone">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-600 rounded-lg"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>
            <div className="w-full p-8 flex flex-col mt-11">
              <div className="mb-4">
                <label className="block mb-2 font-medium" htmlFor="profile-picture">
                  Profile Picture
                </label>
                <input
                  type="file"
                  id="profile-picture"
                  className="w-full p-2 border border-gray-600 rounded-lg hover:cursor-pointer hover:scale-105 hover:bg-(--highlighted) hover:text-white transition-[border,scale,color] duration-300 ease-in-out"
                  accept="image/*"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center mb-8">
            <Button onClick={handleSaveChanges} className="m-8 bg-blue-400 text-black px-6 py-3 rounded-4xl hover:cursor-pointer hover:scale-115 hover:bg-(--highlighted) hover:text-white shadow-lg transition-[background-color,scale,color] duration-300 ease-in-out">Save Changes</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;