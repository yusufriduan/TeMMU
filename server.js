import { createServer } from "http";
import { Server } from "socket.io";
import "dotenv/config";
import {supabase} from "./src/lib/supabase.js"

const server = createServer();
const io = new Server(server, { cors: { origin: "*" } });
const users = {};

async function saveIntoDB(w_id, textData){
  const {data, error} = await supabase.from("WorkspaceChats").insert({workspace_id: w_id, sender_id: textData.id, date_sent: textData.timestamp, content: textData.text})
  if(error){
    console.log(error);
  }

  if(data){
    console.log("Chats sent");
  }
}

io.on("connection", (socket) => {
  console.log("Connected, socket id:", socket.id);
  socket.on("register", (workspace_id, userId) => {
    if (!users[workspace_id]) {
      users[workspace_id] = {};
    }
    users[workspace_id][userId] = socket.id;
    console.log("Registered: ", socket.id)
  })

  socket.on("sendChat", (msg, user_id, workspace_id, username) => {
    for(const userId in users[workspace_id]){
      console.log(Number(userId) !== Number(user_id))
      if(Number(userId) !== Number(user_id)){
        console.log(`Sent to ${userId}`)
        io.to(users[workspace_id][userId]).emit("message", `${userId} : ${username} : ${msg}`);
      }
    }
  })

  socket.on("joinWorkspace", ({ workspace_id, userId }) => {
    socket.workspace_id = workspace_id;
    socket.userId = userId;

    if (!users[workspace_id]) {
      users[workspace_id] = {};
      users[workspace_id][userId] = socket.id;
    }
    console.log("join")
  });

  socket.on("saveData", ({workspace_id, arr_of_chats}) => {
    if(!users[workspace_id]){
      users[workspace_id] = {};
      users[workspace_id][arr_of_chats[0].id] = socket.id;
    }
    if(users[workspace_id][arr_of_chats[0].id] == socket.id){
      console.log(arr_of_chats);
      arr_of_chats.map((m) => {
        saveIntoDB(workspace_id, m);
      })
    }
  })


  socket.on("disconnect", () => {
    const { workspace_id, userId } = socket;

    if (workspace_id && users[workspace_id] && users[workspace_id][userId] === socket.id) {
      delete users[workspace_id][userId];
    }

    console.log("Client disconnected");
  });

});

server.listen(3001, () => console.log("Socket.IO server running on 3001"));
