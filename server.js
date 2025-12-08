import { createServer } from "http";
import { Server } from "socket.io";

const server = createServer();
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log("Client connected");
  socket.on("message", (msg) => {
    console.log("Received:", msg);
    socket.emit("message", "Echo: " + msg);
  });
  socket.on("disconnect", () => console.log("Client disconnected"));
});

server.listen(3001, () => console.log("Socket.IO server running on 3001"));
