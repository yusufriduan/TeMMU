"use client";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import Cookies from "js-cookie";

export default function CheckForCookies() {
  useEffect(() => {
    const user = localStorage.getItem("User");
    if (!user || user == "undefined") {
      const userCookie = Cookies.get("User");
      console.log(userCookie);
      if (!userCookie || userCookie == "undefined") {
        redirect("/login");
      } else {
        return;
      }
    }
  }, []);

  return <></>;
}
