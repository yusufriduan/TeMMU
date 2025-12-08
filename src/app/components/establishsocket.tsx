"use client";
import { useEffect } from "react";
import { io, Socket } from "socket.io-client";

export default function EstablishSocket() {
  useEffect(() => {
    const socket: Socket = io("http://localhost:3001");

    socket.on("connect", () => {
      console.log("Connected");
      socket.emit("message", "Hello World");
    });

    socket.on("message", (msg) => console.log("Message from server:", msg));

    // Cleanup function
    return () => {
      socket.disconnect();
    };
  }, []);

  return <h1>Socket.IO Client</h1>;
}
