"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Cookies from "js-cookie";

export default function logout() {
  const router = useRouter();
  useEffect(() => {
    if (Cookies.get("User")) {
      Cookies.remove("User");
    }
    if (localStorage.getItem("User")) {
      localStorage.removeItem("User");
    }
    router.push("/login");
  }, [router]);

  return null;
}
