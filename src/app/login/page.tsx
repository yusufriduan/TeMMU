"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import InputBox from "../components/InputBox";
import { supabase } from "../../lib/supabase";
import bcrypt from "bcryptjs";
import Cookies from "js-cookie";

export default function login() {
  const [email, setEmail] = useState("");
  const [errorField, setErrorField] = useState<HTMLElement | null>(null);
  const [password, setPassword] = useState("");
  const [checked, setChecked] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("User");
    if (user && user != "undefined") {
      router.push("/");
    }
    const userCookie = Cookies.get("User");
    console.log(userCookie);
    if (userCookie && userCookie != "undefined") {
      router.push("/");
    }
    const e = document.getElementById("error-msg-login") as HTMLElement;
    if (e) {
      setErrorField(e);
    }
  }, []);

  async function verifyData() {
    if (errorField) {
      if (email != "" && password != "") {
        const { data, error } = await supabase
          .from("Clients")
          .select("*")
          .eq("client_email", email)
          .single();
        if (data) {
          const isMatch = await bcrypt.compare(password, data.client_password);

          if (!isMatch) {
            errorField.innerHTML = "Incorrect Password";
          } else {
            localStorage.setItem("User", data.client_id);
            if (checked) {
              Cookies.set("User", data.client_id, {
                expires: 7,
                path: "/",
                secure: true,
                sameSite: "strict",
              });
            }
            router.push("/");
          }
        } else {
          errorField.innerHTML = "Email not found";
          console.log(error);
        }
      } else {
        errorField.innerHTML = "Empty field found";
      }
    } else {
      console.log("Cannot find error field");
    }
  }

  return (
    <div className="h-screen w-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="h-fit w-fit bg-white shadow-2xl rounded-lg flex flex-col items-center justify-center p-15">
        <h1 className="text-3xl font-bold mt-16 mb-2">Welcome Back</h1>
        <p className="mb-7">Log into your account</p>
        <p id="error-msg-login" className="text-red-600 mb-7"></p>
        <InputBox
          icon="/envelope.png"
          value={email}
          type="text"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          placeholderText="Enter your Email"
          width={96}
          height={14}
        ></InputBox>
        <br></br>
        <InputBox
          icon="/lock.png"
          value={password}
          type="password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          placeholderText="Create a Password"
          width={96}
          height={14}
        ></InputBox>
        <br></br>
        <div id="extra-login-sect" className="w-full relative pl-6 pr-6 mb-4">
          <span className="flex flex-row float-left">
            <input
              type="checkbox"
              id="save-session"
              name="save-session"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
            ></input>
            <p className="ml-2">Remember Me?</p>
          </span>
          <button
            className="float-right text-blue-500 cursor-pointer"
            onClick={(e) => router.push("/forgot")}
          >
            Forgot Password?
          </button>
        </div>
        <button
          onClick={verifyData}
          className="inline-block w-96 h-14 mb-2 bg-gradient-to-br from-blue-600/90 to-purple-600/90 rounded-lg text-white text-xl cursor-pointer transition delay-150 duration-300 ease-in-out active:scale-75"
        >
          Log in
        </button>
        <p>
          Don't have an account?
          <span>
            <button
              className="text-blue-500 underline cursor-pointer ml-2"
              onClick={(e) => router.push("/signup")}
            >
              Sign up now
            </button>
          </span>
        </p>
      </div>
    </div>
  );
}
