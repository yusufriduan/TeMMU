"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import InputBox from "../components/InputBox";
import bcrypt from "bcryptjs";
import Cookies from "js-cookie";

export default function SignUp() {
  const router = useRouter();

  // useStates for POST to Database later
  const [fullName, setFullName] = useState("");
  const [clientType, setClientType] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [university, setUniversity] = useState("");
  const [errField, setErrField] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const userCookie = Cookies.get("User");
    if (userCookie && userCookie != "undefined") {
      router.push("/");
    }

    const e = document.getElementById("err-field-signup") as HTMLElement;
    setErrField(e);
  }, []);

  async function hashPasswords(password: string) {
    const salt = await bcrypt.genSalt(10);
    if (salt) {
      const hash = await bcrypt.hash(password, salt);
      if (hash) {
        return hash;
      } else console.log("Error generating hash");
    } else console.log("Error salting");
  }

  async function sendData() {
    if (
      fullName == "" ||
      clientType == "" ||
      email == "" ||
      password == "" ||
      university == ""
    ) {
      console.log("Missing field");
      if (errField) {
        errField.innerHTML = "One or more fields missing";
      }
    } else {
      const { data: queryData, error: queryError } = await supabase
        .from("Clients")
        .select("*")
        .or(`client_name.eq.${fullName}, client_email.eq.${email}`)
        .single();

      if (queryData && errField) {
        errField.innerHTML = "Name or Email already registered";
      } else {
        const hashedPass = await hashPasswords(password);

        // i'll do edge cases later
        const { data, error } = await supabase.from("Clients").insert({
          client_name: fullName,
          client_email: email,
          client_password: hashedPass,
          client_type: clientType,
          profile_picture: null,
          university: university,
        });

        if (error) console.log(error);
        else router.push("/login");
      }
    }
  }

  return (
    <div className="w-screen h-screen flex flex-row text-white">
      <div
        id="left-half"
        className="relative w-1/2 h-full flex items-center justify-center"
      >
        <div
          id="image-signup"
          className="absolute inset-0 w-full h-full flex justify-center"
        >
          {/* image source -> https://stockcake.com/i/scientific-group-discussion_785666_982782 */}
          <img
            src="/scientific-group-discussion-stockcake.jpg"
            className="w-full"
          ></img>
        </div>
        <div
          id="bg-signup"
          className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-purple-600/90"
        ></div>
        <div
          id="signup-right-text"
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 flex justify-center items-start flex-col w-3/4"
        >
          <h1 className="text-3xl font-bold tracking-wide underline decoration-blue-400">
            Discuss, Research, Learn.
          </h1>
          <br></br>
          <p className="text-lg">
            Meet trustworthy individuals through our platform. Discover common
            interests and complete projects together.
          </p>
        </div>
      </div>
      <div
        id="right-half"
        className="w-1/2 bg-white flex justify-center items-center"
      >
        <div
          id="signup-input-container"
          className="w-4/5 h-4/5 shadow-md flex flex-col items-center text-black"
        >
          <h1 className="text-4xl m-8">
            Sign up to <span className="font-bold">TeMMU</span>
          </h1>
          <p id="err-field-signup" className="m-4 text-red-500"></p>
          <InputBox
            icon="/user.png"
            value={fullName}
            type="text"
            onChange={(e) => {
              setFullName(e.target.value);
            }}
            placeholderText="Enter your Full Name"
            width={96}
            height={12}
          ></InputBox>
          <InputBox
            icon="/envelope.png"
            value={email}
            type="text"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            placeholderText="Enter your Email"
            width={96}
            height={12}
          ></InputBox>
          <InputBox
            icon="/book.png"
            value={university}
            type="text"
            onChange={(e) => {
              setUniversity(e.target.value);
            }}
            placeholderText="Enter your University"
            width={96}
            height={12}
          ></InputBox>
          <InputBox
            icon="/lock.png"
            value={password}
            type="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholderText="Create a Password"
            width={96}
            height={12}
          ></InputBox>
          <select
            name="client-type"
            id="client-type"
            value={clientType}
            onChange={(e) => setClientType(e.target.value)}
            className="flex w-96 h-12 mb-4 border-black text-gray-500 border-2 rounded-lg cursor-pointer transition delay-150 duration-300 ease-in-out hover:border-blue-400 focus:border-blue-400"
          >
            <option value="" disabled>
              Select a client type
            </option>
            <option value="Mentor">Mentor</option>
            <option value="Student">Student</option>
          </select>
          <button
            onClick={sendData}
            className="inline-block w-96 h-14 mb-2 bg-gradient-to-br from-blue-600/90 to-purple-600/90 rounded-lg text-white text-xl cursor-pointer transition delay-150 duration-300 ease-in-out active:scale-95"
          >
            Create Account
          </button>
          <p>
            Already have an account?
            <span>
              <button
                className="text-blue-500 underline cursor-pointer ml-2"
                onClick={(e) => router.push("/login")}
              >
                Log in now
              </button>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
