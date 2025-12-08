"use client";

import { supabase } from "../../../lib/supabase";
import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import {
  Lock,
  Globe,
  Plus,
  Trash2,
  MessageSquare,
  StickyNote,
} from "lucide-react";

interface StickyNoteType {
  id: string;
  content: string;
  color: string;
  position: { x: number; y: number };
}

interface ChatMessage {
  id: string;
  user: string;
  message: string;
  timestamp: Date;
}

function WorkspacePage() {
  const [isPrivate, setIsPrivate] = useState(false);
  const [stickyNotes, setStickyNotes] = useState<StickyNoteType[]>([]);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [draggedNote, setDraggedNote] = useState<string | null>(null);
  const noteUpdateTimers = useRef<{ [id: string]: NodeJS.Timeout }>({});
  const [workspaceName, setWorkspaceName] = useState("");

  const stickyColors = [
    "bg-yellow-200",
    "bg-pink-200",
    "bg-blue-200",
    "bg-green-200",
    "bg-purple-200",
  ];

  const params = useParams();

  const addStickyNote = (content = "", color: string, db_id: string) => {
    const newNote: StickyNoteType = {
      id: db_id,
      content: content,
      color: color,
      position: { x: Math.random() * 500, y: Math.random() * 300 },
    };
    setStickyNotes((prev: StickyNoteType[]) => [...prev, newNote]);
  };

  async function addNoteToDB(color: string) {
    const { data, error } = await supabase
      .from("Notes")
      .insert({ workspace_id: params.id, content: "", color: color })
      .select();

    if (error) {
      console.log(error);
    }

    if (data) {
      addStickyNote("", color, data[0].note_id);
    }
  }

  useEffect(() => {
    async function getNotes() {
      const { data, error } = await supabase
        .from("Notes")
        .select("note_id, content, color")
        .eq("workspace_id", params.id);

      const { data: workspaceData, error: workspaceErr } = await supabase
        .from("Workspace")
        .select("workspace_name")
        .eq("workspace_id", params.id)
        .single();

      if (error) {
        console.log(error);
      }

      if (workspaceData && data && data.length > 0) {
        setWorkspaceName(workspaceData.workspace_name);
        data.map((m) => {
          addStickyNote(m.content, m.color, m.note_id);
        });
      }
    }
    getNotes();
  }, []);

  async function updateNoteFromDB(content: string, noteId: string) {
    console.log(noteId);
    const { data, error } = await supabase
      .from("Notes")
      .update({ content: content })
      .eq("note_id", noteId);

    if (error) {
      console.log(error);
    }
  }

  const updateNoteContent = (id: string, content: string) => {
    setStickyNotes(
      stickyNotes.map((note) => (note.id === id ? { ...note, content } : note))
    );

    if (noteUpdateTimers.current[id]) {
      clearTimeout(noteUpdateTimers.current[id]);
    }

    noteUpdateTimers.current[id] = setTimeout(() => {
      updateNoteFromDB(content, id);
      delete noteUpdateTimers.current[id];
    }, 1000);
  };

  async function deleteNoteFromDB(id: string) {
    const { data, error } = await supabase
      .from("Notes")
      .delete()
      .eq("note_id", id);

    if (error) {
      console.log(error);
    }
  }

  const deleteNote = (id: string) => {
    stickyNotes.map((n) => {
      if (n.id === id) {
        deleteNoteFromDB(id);
      }
    });
    setStickyNotes(stickyNotes.filter((note) => note.id !== id));
  };

  const handleDragStart = (e: React.DragEvent, noteId: string) => {
    setDraggedNote(noteId);
  };

  const handleDragEnd = (e: React.DragEvent, noteId: string) => {
    const canvas = document.getElementById("workspace-canvas");
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setStickyNotes(
        stickyNotes.map((note) =>
          note.id === noteId ? { ...note, position: { x, y } } : note
        )
      );
    }
    setDraggedNote(null);
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message: ChatMessage = {
        id: Date.now().toString(),
        user: "You",
        message: newMessage,
        timestamp: new Date(),
      };
      setChatMessages([...chatMessages, message]);
      setNewMessage("");
    }
  };

  return (
    <div className="flex flex-col w-screen h-screen bg-(--background)">
      {/* Header */}
      <div className="flex flex-row justify-between items-center w-full px-8 py-4 bg-(--foreground) shadow-lg">
        <div className="flex items-center gap-4">
          <a
            className="bg-blue-400 text-black px-4 py-2 rounded-4xl hover:cursor-pointer hover:scale-115 hover:bg-(--highlighted) hover:text-white shadow-lg transition-[background-color,color,scale] duration-300 ease-in-out"
            href="/"
          >
            Back to Dashboard
          </a>
          <h1 className="text-2xl font-bold">Workspace: {workspaceName}</h1>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-4">
          {/* Add Sticky Note Menu */}
          <Menu>
            <MenuButton className="flex items-center gap-2 bg-yellow-400 text-black px-4 py-2 rounded-4xl hover:cursor-pointer hover:scale-115 hover:bg-yellow-500 shadow-lg transition-all duration-300 ease-in-out">
              <StickyNote size={20} />
              <span>Add Note</span>
            </MenuButton>
            <MenuItems
              anchor="bottom end"
              transition
              className="bg-(--foreground) rounded-3xl p-2 flex flex-col gap-2 border-2 border-gray-500 [--anchor-gap:8px] origin-top transition duration-200 ease-out data-closed:scale-95 data-closed:opacity-0"
            >
              {stickyColors.map((color, index) => (
                <MenuItem key={index}>
                  <button
                    onClick={() => addNoteToDB(color)}
                    className={`block w-full text-left pl-2 py-2 rounded-2xl ${color} hover:opacity-80 transition duration-300 ease-in-out`}
                  >
                    {color.replace("bg-", "").replace("-200", "")} Note
                  </button>
                </MenuItem>
              ))}
            </MenuItems>
          </Menu>

          {/* Chat Toggle */}
          <Button
            onClick={() => setShowChat(!showChat)}
            className={`flex items-center gap-2 px-4 py-2 rounded-4xl hover:cursor-pointer hover:scale-115 shadow-lg transition-all duration-300 ease-in-out ${
              showChat
                ? "bg-(--highlighted) text-white"
                : "bg-blue-400 text-black hover:bg-blue-500"
            }`}
          >
            <MessageSquare size={20} />
            <span>Chat</span>
          </Button>

          {/* Access Control */}
          <Button
            onClick={() => setIsPrivate(!isPrivate)}
            className={`flex items-center gap-2 px-4 py-2 rounded-4xl hover:cursor-pointer hover:scale-115 shadow-lg transition-all duration-300 ease-in-out ${
              isPrivate
                ? "bg-red-400 text-black hover:bg-red-500"
                : "bg-green-400 text-black hover:bg-green-500"
            }`}
          >
            {isPrivate ? <Lock size={20} /> : <Globe size={20} />}
            <span>{isPrivate ? "Private" : "Public"}</span>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-row flex-1 overflow-hidden">
        {/* Workspace Canvas */}
        <div
          id="workspace-canvas"
          className="flex-1 relative bg-(--bg-section) m-4 rounded-4xl border-4 border-gray-500 shadow-2xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

          {/* Sticky Notes */}
          {stickyNotes.map((note) => (
            <div
              key={note.id}
              draggable
              onDragStart={(e) => handleDragStart(e, note.id)}
              onDragEnd={(e) => handleDragEnd(e, note.id)}
              style={{
                position: "absolute",
                left: `${note.position.x}px`,
                top: `${note.position.y}px`,
              }}
              className={`${note.color} w-64 h-64 p-4 rounded-lg shadow-xl cursor-move hover:shadow-2xl transition-shadow duration-200`}
            >
              <div className="flex justify-end mb-2">
                <button
                  onClick={() => deleteNote(note.id)}
                  className="text-red-600 hover:text-red-800 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <textarea
                value={note.content}
                onChange={(e) => updateNoteContent(note.id, e.target.value)}
                placeholder="Type your note here..."
                className={`w-full h-[calc(100%-2rem)] ${note.color} resize-none border-none outline-none text-black placeholder-gray-600 font-handwriting`}
              />
            </div>
          ))}

          {stickyNotes.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 text-xl">
                Click "Add Note" to start brainstorming!
              </p>
            </div>
          )}
        </div>

        {/* Chat Sidebar */}
        {showChat && (
          <div className="w-[30vw] bg-(--foreground) m-4 mr-4 rounded-4xl border-4 border-gray-500 shadow-2xl flex flex-col">
            <div className="p-4 border-b-2 border-gray-500">
              <h2 className="text-xl font-bold">Workspace Chat</h2>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.length === 0 ? (
                <p className="text-gray-500 text-center mt-10">
                  No messages yet. Start the conversation!
                </p>
              ) : (
                chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className="bg-(--bg-section) rounded-lg p-3"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-sm">{msg.user}</span>
                      <span className="text-xs text-gray-500">
                        {msg.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm">{msg.message}</p>
                  </div>
                ))
              )}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t-2 border-gray-500">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 bg-(--bg-section) rounded-lg px-4 py-2 outline-none border-2 border-gray-500 focus:border-blue-400 transition-colors"
                />
                <Button
                  onClick={sendMessage}
                  className="bg-blue-400 text-black px-6 py-2 rounded-lg hover:bg-blue-500 hover:scale-105 transition-all duration-300"
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default WorkspacePage;
