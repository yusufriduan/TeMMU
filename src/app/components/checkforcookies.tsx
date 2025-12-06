"use client";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import Cookies from "js-cookie";

export default function CheckForCookies() {
  useEffect(() => {
    const userCookie = Cookies.get("User");
    console.log(userCookie);
    if (userCookie == "undefined" || !userCookie) {
      redirect("/login");
    }
  }, []);

  return <></>;
}
