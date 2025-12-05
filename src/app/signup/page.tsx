"use client";
import { useEffect, useState } from "react";
import InputBox from "../components/InputBox";

export default function SignUp() {
  // useStates for POST to Database later
  const [fullName, setFullName] = useState("");
  const [clientType, setClientType] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleOptionSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value == "Mentor") {
      setClientType("M");
    } else if (e.target.value == "Student") {
      setClientType("S");
    } else {
      console.log("Error");
    }
  };

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
          <h1 className="text-4xl m-16">
            Sign up to <span className="font-bold">TeMMU</span>
          </h1>
          <InputBox
            icon="/user.png"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
            }}
            placeholderText="Enter your Full Name"
            width={96}
            height={14}
          ></InputBox>
          <InputBox
            icon="/envelope.png"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            placeholderText="Enter your Email"
            width={96}
            height={14}
          ></InputBox>
          <InputBox
            icon="/lock.png"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholderText="Create a Password"
            width={96}
            height={14}
          ></InputBox>
          <select
            name="client-type"
            id="client-type"
            onChange={handleOptionSelect}
            className="flex w-96 h-14 mb-4 border-black text-gray-500 border-2 rounded-lg cursor-pointer transition delay-150 duration-300 ease-in-out hover:border-blue-400 focus:border-blue-400"
          >
            <option value="" disabled selected>
              Select a client type
            </option>
            <option value={clientType}>Mentor</option>
            <option value={clientType}>Student</option>
          </select>
        </div>
      </div>
    </div>
  );
}
