"use client";

import {
  Button,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Input,
  Field,
  Fieldset,
} from "@headlessui/react";
import { User, Camera, Send, Plus } from "lucide-react";
import CheckForCookies from "./components/checkforcookies";
import { Fragment, useEffect, useState } from "react";
import ImageWithFallback from "./components/image_with_fallback";
import { supabase } from "../lib/supabase";

interface workspaceContentFormat {
  label: string;
  href: string;
  lastModified: string;
  AccessType: string;
  Collaborators: number;
}

interface userDataFormat {
  client_id: number;
  client_name: string;
  client_email: string;
  client_password: string;
  client_type: string;
  profile_picture: string;
  university: string;
}

interface menteeDataFormat {
  mentee: number;
  enrolled: boolean;
  mentee_name: string;
}

const chatSeed = [
  {
    id: "mentor1",
    name: "Mentor One",
    avatar: "/avatars/mentor1.png",
    lastMessage: "Don't forget to submit your report!",
    status: "2 hours ago",
    unread: 0,
    messages: [
      {
        from: "them",
        content: "Hello! How can I assist you today?",
        timestamp: "10:00 AM",
      },
      {
        from: "you",
        content: "I need help with my project.",
        timestamp: "10:05 AM",
      },
      {
        from: "them",
        content: "Sure! What part are you struggling with?",
        timestamp: "10:10 AM",
      },
    ],
  },
  {
    id: "mentor2",
    name: "Mentor Two",
    avatar: "/avatars/mentor2.png",
    lastMessage: "Great job on the presentation!",
    status: "Typing...",
    unread: 5,
    messages: [
      {
        from: "them",
        content: "Hi! Ready for our session?",
        timestamp: "Yesterday 2:00 PM",
      },
      {
        from: "you",
        content: "Yes, looking forward to it!",
        timestamp: "Yesterday 2:05 PM",
      },
    ],
  },
];

// Sample Forum content data
const ForumContent = [
  {
    title: "We've updated! Check out the new features",
    author: "Admin",
    topic: "General Discussion",
    preview:
      "Explore the latest updates to our platform, including new collaboration tools and enhanced security features.",
    replies: 5,
    views: 20,
    time: "1 hour ago",
  },
  {
    title: "How to start a STEM research project?",
    author: "John Doe",
    topic: "STEM Research",
    preview:
      "I'm looking for advice on starting my first research project. What are the key steps?",
    replies: 12,
    views: 45,
    time: "2 hours ago",
  },
  {
    title: "Looking for collaborators on AI project",
    author: "Jane Smith",
    topic: "Project Ideas",
    preview:
      "Working on a machine learning project and need team members with Python experience.",
    replies: 8,
    views: 32,
    time: "5 hours ago",
  },
  {
    title: "Best practices for mentoring students",
    author: "Dr. Williams",
    topic: "Mentorship Tips",
    preview:
      "Share your experiences and tips on effective mentorship strategies.",
    replies: 24,
    views: 156,
    time: "1 day ago",
  },
  {
    title: "Weekly check-in: What are you working on?",
    author: "Community Bot",
    topic: "General Discussion",
    preview: "Share your current projects and get feedback from the community!",
    replies: 36,
    views: 203,
    time: "2 days ago",
  },
];

// Topic color mapping
const topicColors: { [key: string]: string } = {
  "STEM Research": "bg-blue-400",
  "Project Ideas": "bg-green-400",
  "Mentorship Tips": "bg-purple-400",
  "General Discussion": "bg-yellow-400",
};

const AccessTypesColors: { [key: string]: string } = {
  Public: "bg-green-400",
  Private: "bg-red-400",
};
function Dashboard() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [chatSessions, setChatSessions] = useState(chatSeed);
  const [activeChatId, setActiveChatId] = useState(chatSeed[0]?.id ?? "");
  const [messageInput, setMessageInput] = useState("");
  const [workspaces, setWorkspaces] = useState<workspaceContentFormat[]>([]);
  // later for chats
  const [userData, setUserData] = useState<userDataFormat>();
  const [showCreate, setShowCreate] = useState(false);
  const [menteeList, setMenteeList] = useState<menteeDataFormat[]>([]);

  const activeChat = chatSessions.find((chat) => chat.id === activeChatId);
  const nowTime = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const handleSelectChat = (id: string) => {
    setActiveChatId(id);
    setChatSessions((prev) =>
      prev.map((chat) =>
        chat.id === id ? { ...chat, unread: 0, lastActive: "Just now" } : chat
      )
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("File selected:", file.name);
      setSelectedFile(file);
      // Here you would typically handle the file upload to the server
    }
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !activeChat) return;
    const text = messageInput.trim();
    const ts = nowTime;
    setChatSessions((prev) =>
      prev.map((chat) =>
        chat.id === activeChat.id
          ? {
              ...chat,
              unread: 0,
              lastMessage: text,
              messages: [
                ...chat.messages,
                { from: "you", content: text, timestamp: ts },
              ],
            }
          : chat
      )
    );
    setMessageInput("");
  };

  useEffect(() => {
    const user_data = localStorage.getItem("User");
    async function fetchUserWorkspaces() {
      if (!user_data || user_data === "undefined") return;

      const { data: memberData, error: memberError } = await supabase
        .from("WorkspaceMembers")
        .select(
          `
      Workspace!inner(
        workspace_name,
        workspace_id,
        creation_date,
        is_private,
        WorkspaceMembers!inner(member_id)
      )
    `
        )
        .eq("member_id", user_data);

      if (memberError) {
        console.error(memberError);
        setWorkspaces([]);
        return;
      }

      if (!memberData || memberData.length === 0) {
        setWorkspaces([]);
        return;
      }

      const workspaceArray: workspaceContentFormat[] = memberData.map(
        (member) => {
          const workspace = (
            member.Workspace as {
              workspace_name: string;
              workspace_id: string;
              creation_date: string;
              is_private: boolean;
              WorkspaceMembers: { member_id: string }[];
            }[]
          )[0];

          return {
            label: workspace.workspace_name,
            href: `/workspace/${workspace.workspace_id}`,
            lastModified: new Date(workspace.creation_date).toDateString(),
            AccessType: workspace.is_private ? "Private" : "Public",
            Collaborators: workspace.WorkspaceMembers?.length ?? 0,
          };
        }
      );

      setWorkspaces(workspaceArray);
    }

    async function fetchMentees(mentorID: string) {
      const { data, error } = await supabase
        .from("MenteeList")
        .select(`mentee, enrolled, Mentee:Clients!mentee(client_name)`)
        .eq("mentor", mentorID);

      if (data && data.length > 0) {
        const menteeArr: menteeDataFormat[] = [];
        data.map((m) => {
          const menteeData = {
            mentee: m.mentee,
            enrolled: m.enrolled,
            mentee_name: m.Mentee[0].client_name,
          };

          menteeArr.push(menteeData);
        });

        setMenteeList(menteeArr);
      } else {
        if (error) {
          console.log(error);
        } else {
          setMenteeList([]);
        }
      }
    }

    async function fetchUserData() {
      const { data, error } = await supabase
        .from("Clients")
        .select("*")
        .eq("client_id", user_data)
        .single();
      setUserData(data);
      return data;
    }

    async function fetchAll() {
      const userInfo = await fetchUserData();
      fetchUserWorkspaces();
      if (userInfo.client_type == "Mentor") {
        if (user_data) {
          fetchMentees(user_data);
        }
      }
    }

    fetchAll();
  }, []);

  return (
    <div className="w-screen h-full">
      <CheckForCookies />
      <TabGroup className={"flex flex-col items-center mt-10 gap-10"}>
        <div className="flex flex-row justify-between items-center w-[90vw]">
          {/* left spacer */}
          <div className="hidden justify-between items-center w-[10vw]"></div>

          {/* center tabs */}
          <div className="flex flex-row content-between items-center gap-6">
            <TabList
              className={"flex gap-10 bg-(--foreground) rounded-4xl w-auto p-4"}
            >
              <Tab
                className={
                  "rounded-4xl p-2 data-hover:bg-(--hover) hover:cursor-pointer data-selected:bg-(--highlighted) data-selected:text-white data-seleceted:font-bold transition-[background-color,color] duration-300 ease-in-out"
                }
              >
                Workspace
              </Tab>
              <div className={"flex"}>
                {" "}
                {/* Roles Exclusives */}
                <Tab
                  className={
                    " flex rounded-4xl p-2 data-hover:bg-(--hover) hover:cursor-pointer data-selected:bg-(--highlighted) data-selected:text-white data-seleceted:font-bold transition-[background-color,color] duration-300 ease-in-out"
                  }
                >
                  Find Mentors
                </Tab>
                <Tab
                  className={
                    "rounded-4xl p-2 data-hover:bg-(--hover) hover:cursor-pointer data-selected:bg-(--highlighted) data-selected:text-white data-seleceted:font-bold transition-[background-color,color] duration-300 ease-in-out"
                  }
                >
                  Manage Mentees
                </Tab>
              </div>
              <Tab
                className={
                  "rounded-4xl p-2 data-hover:bg-(--hover) hover:cursor-pointer data-selected:bg-(--highlighted) data-selected:text-white data-seleceted:font-bold transition-[background-color,color] duration-300 ease-in-out"
                }
              >
                Chats
              </Tab>
              <Tab
                className={
                  "rounded-4xl p-2 data-hover:bg-(--hover) hover:cursor-pointer data-selected:bg-(--highlighted) data-selected:text-white data-seleceted:font-bold transition-[background-color,color] duration-300 ease-in-out"
                }
              >
                Forums
              </Tab>
            </TabList>
          </div>

          {/* User option */}
          <div className="flex justify-end w-1/8">
            <Menu>
              <MenuButton className="flex flex-row items-center gap-2 bg-(--foreground) rounded-4xl w-auto p-4 data-hover:bg-(--hover) data-selected:bg-(--highlighted) hover:cursor-pointer hover:text-white transition-[background-color,color] duration-300 ease-in-out">
                <User size={30} />
                <span>My account</span>
              </MenuButton>
              <MenuItems
                anchor="bottom end"
                transition
                className="bg-(--foreground) rounded-3xl p-2 flex flex-col gap-2 border-black border w-(--button-width) [--anchor-gap: 8px] origin-top transition duration-200 ease-out data-closed:scale-95 data-closed:opacity-0"
              >
                <MenuItem>
                  <a
                    className="block pl-2 data-focus:bg-(--hover) rounded-2xl p-1 transition duration-300 ease-in-out"
                    href="/profile"
                  >
                    My Profile
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    className="block pl-2 data-focus:bg-(--hover) rounded-2xl p-1 transition duration-300 ease-in-out"
                    href="/logout"
                  >
                    Logout
                  </a>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </div>
        <TabPanels as={Fragment}>
          <TabPanel
            className={
              "w-[90vw] h-[80vh] bg-(--foreground) rounded-4xl overflow-y-auto bg-clip-content"
            }
          >
            <div className="flex flex-col h-full w-full p-6">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Your Workspaces</h1>
                <Button className="bg-blue-400 text-black px-4 py-2 rounded-4xl hover:cursor-pointer hover:scale-115 hover:bg-(--highlighted) hover:text-white shadow-lg transition-[background-color,color,scale] duration-300 ease-in-out">
                  Create New Workspace
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {workspaces.map((workspace) => (
                  <div
                    key={workspace.href}
                    className="bg-(--bg-section) rounded-3xl p-6 border-2 border-gray-500 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out"
                  >
                    <h3 className="text-xl font-bold mb-3">
                      {workspace.label}
                    </h3>
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>Last modified: {workspace.lastModified}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span
                          className={`${
                            AccessTypesColors[workspace.AccessType]
                          } text-black px-2 py-1 rounded-lg text-xs font-medium`}
                        >
                          {workspace.AccessType}
                        </span>
                        <span className="text-gray-600">
                          {workspace.Collaborators} collaborators
                        </span>
                      </div>
                      <div className="border-t border-gray-600 pt-3 mt-2">
                        <a
                          href={workspace.href}
                          className="block w-full bg-blue-400 text-black text-center px-4 py-2 rounded-2xl hover:bg-(--highlighted) hover:text-white hover:scale-105 transition-all duration-300 ease-in-out font-medium"
                        >
                          Open Workspace
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabPanel>

          <TabPanel
            className={
              "flex w-[90vw] h-[80vh] bg-(--foreground) rounded-4xl overflow-y-clip"
            }
          >
            {" "}
            {/* Find Mentors Container */}
            <div className="flex flex-col justify-center items-center w-full h-full">
              <h1 className="text-2xl mb-1 font-bold">Looking for Mentor?</h1>
              <span className="text-lg mb-4">Just Search!</span>
              <form className="flex flex-row gap-4">
                <Input
                  name="full_name"
                  type="text"
                  className={"bg-blue-400 rounded-lg p-2 text-black"}
                  placeholder="Type the name!"
                ></Input>
                <Button
                  className={
                    "bg-blue-400 rounded-lg p-2 text-black data-hover:bg-(--highlighted) data-hover:cursor-pointer data-hover:text-white transition duration-300 ease-in-out"
                  }
                >
                  Search
                </Button>
              </form>

              {/* Recommended Mentors Section */}
              <div className="flex flex-col mt-4">
                <h1>Here's some recommended tutors you may like!</h1>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {/* Mentor cards would go here */}
                </div>

                {/* Search Results */}
                <div className=" hidden grid-cols-3 gap-4 mt-4">
                  <h1>Search Results for NAME INPUT</h1>
                  {/* Mentor cards would go here */}
                </div>

                {/* No Results Message */}
                <div className="hidden mt-4">
                  <p>
                    No mentors found. Try searching with different keywords.
                  </p>
                </div>
              </div>
            </div>
          </TabPanel>

          <TabPanel
            className={"w-[90vw] h-[80vh] bg-(--foreground) rounded-4xl"}
          >
            {" "}
            {/* Manage Mentees Container */}
            <div className="flex flex-col justify-center items-center w-full h-full overflow-y-auto">
              <h1 className="text-2xl mb-1 font-bold">Manage Your Mentees</h1>
              <span className="text-lg mb-4">
                Here are your current mentees:
              </span>
              <div className="flex flex-col gap-4 w-[80%] h-[60%] overflow-y-auto">
                {menteeList
                  .filter((m) => m.enrolled)
                  .map((m) => (
                    <div
                      key={m.mentee}
                      className="flex flex-row justify-between items-center p-4 bg-blue-300 rounded-lg shadow-lg"
                    >
                      <span>{m.mentee_name}</span>
                      <Button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:cursor-pointer hover:font-bold">
                        Remove Mentee
                      </Button>
                    </div>
                  ))}
              </div>
              <div className="mt-2 w-[80%] border-t border-gray-600">
                <h1 className="px-4 py-2 rounded-lg font-bold">Requests</h1>
                <div className="flex flex-col gap-4 w-full h-[40%]">
                  {menteeList
                    .filter((m) => !m.enrolled)
                    .map((m) => (
                      <div
                        key={m.mentee}
                        className="flex flex-row justify-between items-center p-4 bg-blue-300 rounded-lg shadow-lg"
                      >
                        <span>{m.mentee_name}</span>
                        <div className="flex flex-row gap-2">
                          <Button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:cursor-pointer hover:font-bold">
                            Accept
                          </Button>
                          <Button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:cursor-pointer hover:font-bold">
                            Decline
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </TabPanel>

          <TabPanel
            className={"w-[90vw] h-[80vh] bg-(--foreground) rounded-4xl"}
          >
            <div className="flex flex-row justify-between items-center h-full">
              {" "}
              {/* Chats container */}
              <div className="flex flex-col justify-center align-center w-[45vw] h-full">
                {" "}
                <div className="flex flex-col flex-wrap gap-2 p-4 h-full">
                  {/* Chat Lists */}
                  <div className="flex flex-col align-top gap-4">
                    {chatSessions.map((chat) => (
                      <button
                        key={chat.id}
                        onClick={() => handleSelectChat(chat.id)}
                        className={`flex flex-row justify-between items-center p-2 ${
                          chat.id === activeChatId
                            ? "bg-(--highlighted)"
                            : "bg-(--bg-section)"
                        } rounded-lg shadow-lg hover:cursor-pointer hover:font-bold hover:bg-(--hover) transition duration-200 ease-in-out`}
                      >
                        <div className="flex flex-row justify-between items-center p-2 w-full">
                          <div className="flex flex-col text-left">
                            <span>{chat.name.slice(0, 20)}</span>
                            <span className="text-sm text-gray-600">
                              {chat.lastMessage ||
                                chat.messages.at(-1)?.content}{" "}
                            </span>
                          </div>
                          {chat.unread > 0 && (
                            <span className="self-start rounded-full bg-red-400 px-2 py-1 text-[11px] font-semibold text-black">
                              {chat.unread} unread chat
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* No chats message */}
                  <div className="hidden flex-col items-center justify-center gap-4 mt-10">
                    <p>No chats available. Start a new chat!</p>
                  </div>
                </div>
              </div>
              <div className="border-l border-gray-600 h-[70vh] shadow-4xl"></div>
              <div className="flex flex-col items-center justify-center flex-wrap gap-2 p-4 w-[45vw] h-full overflow-y-auto">
                {/* Chat window would go here */}
                {activeChat ? (
                  <>
                    <div className="flex flex-col w-full h-full gap-4 overflow-y-auto mb-4">
                      <>
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
                          <div className="flex items-center gap-3">
                            <ImageWithFallback
                              className="w-10 h-10 rounded-3xl"
                              src={activeChat.avatar}
                            ></ImageWithFallback>
                            <div className="flex flex-col">
                              <p className="font-semibold">{activeChat.name}</p>
                              <span className="text-xs text-gray-500">
                                {activeChat.status}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-3">
                          {activeChat.messages.map((msg, idx) => (
                            <div
                              key={idx}
                              className={`flex ${
                                msg.from === "you"
                                  ? "justify-end"
                                  : "justify-start"
                              }`}
                            >
                              <div
                                className={`max-w-[75%] rounded-3xl px-4 py-2 text-sm shadow transition ${
                                  msg.from === "you"
                                    ? "bg-yellow-400 text-black rounded-br-sm"
                                    : "bg-(--bg-section) text-gray-100 rounded-bl-sm"
                                }`}
                              >
                                <p>{msg.content}</p>
                                <span className="mt-1 block text-[11px] text-gray-700 text-right">
                                  {msg.timestamp}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center gap-3 px-6 py-4 border-t border-gray-700">
                          <Menu>
                            <MenuButton className="flex h-11 w-11 items-center justify-center p-2 bg-(--bg-section) rounded-full hover:cursor-pointer hover:bg-(--hover) hover:scale-105 transition duration-300 ease-in-out">
                              <Plus size={16} />
                            </MenuButton>
                            <MenuItems
                              anchor="top start"
                              transition
                              className="bg-(--foreground) rounded-3xl p-2 flex flex-col gap-2 border-black border w-fit [--anchor-gap: 8px] origin-top transition duration-200 ease-out data-closed:scale-95 data-closed:opacity-0"
                            >
                              <MenuItem>
                                <label className="block w-full pl-2 data-focus:bg-(--hover) rounded-2xl p-1 transition duration-300 ease-in-out hover:cursor-pointer">
                                  <input
                                    type="file"
                                    accept="application/pdf,image/jpeg,image/png"
                                    onChange={handleFileChange}
                                    className="hidden"
                                  />
                                  Upload File
                                </label>
                              </MenuItem>
                              <MenuItem>
                                <Button
                                  className={
                                    "px-3 py-2 rounded-2xl hover:bg-(--hover) hover:cursor-pointer transition duration-300 ease-in-out"
                                  }
                                >
                                  Invite to workspace
                                </Button>
                              </MenuItem>
                            </MenuItems>
                          </Menu>
                          <Input
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            onKeyDown={(e) =>
                              e.key === "Enter" &&
                              (e.preventDefault(), handleSendMessage())
                            }
                            placeholder="Send a chat..."
                            className="flex-1 bg-(--bg-section) rounded-full px-4 py-3 border-2 border-gray-600 focus:border-yellow-400 transition-colors"
                          />
                          <Button
                            onClick={handleSendMessage}
                            className="flex h-11 w-11 items-center justify-center rounded-full bg-yellow-400 text-black hover:scale-105 hover:bg-(--hover) hover:cursor-pointer hover:text-white transition"
                          >
                            <Send size={16} />
                          </Button>
                        </div>
                      </>
                    </div>
                  </>
                ) : (
                  <div className="hidden flex-col items-center justify-center gap-4 mb-10 h-full">
                    <p>Select a chat to start messaging.</p>
                  </div>
                )}
              </div>
            </div>
          </TabPanel>

          <TabPanel
            className={
              "w-[90vw] h-[80vh] bg-(--foreground) rounded-4xl overflow-y-auto bg-clip-content"
            }
          >
            <div
              className={`${
                showCreate ? "hidden" : "flex"
              } flex-col w-full h-full p-6`}
            >
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Forums</h1>
                <Button
                  onClick={() => setShowCreate(true)}
                  className="bg-blue-400 text-black px-4 py-2 rounded-4xl hover:cursor-pointer hover:scale-115 hover:bg-(--highlighted) hover:text-white shadow-lg transition-[background-color,color,scale] duration-300 ease-in-out"
                >
                  New Discussion
                </Button>
              </div>
              <div className="flex flex-row gap-4 mb-6">
                <Input
                  type="text"
                  placeholder="Search discussions..."
                  className="flex-1 bg-(--bg-section) rounded-lg px-4 py-2 border-2 border-gray-500 focus:border-blue-400 transition-colors"
                />
                <Button className="bg-blue-400 text-black px-4 py-2 rounded-4xl hover:cursor-pointer hover:scale-105 hover:bg-(--highlighted) hover:text-white shadow-lg transition-[background-color,color,scale] duration-300 ease-in-out">
                  Search
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                <button className="bg-blue-400 text-black px-3 py-1 rounded-full text-sm font-medium hover:bg-(--hover) hover:scale-105 hover:cursor-pointer transition-all">
                  All Topics
                </button>
                <button className="bg-(--bg-section) text-white px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-500 hover:scale-105 hover:cursor-pointer data-selected:bg-blue-400 transition-all">
                  STEM Research
                </button>
                <button className="bg-(--bg-section) text-white px-3 py-1 rounded-full text-sm font-medium hover:bg-green-500 hover:scale-105 hover:cursor-pointer data-selected:bg-green-400 transition-all">
                  Project Ideas
                </button>
                <button className="bg-(--bg-section) text-white px-3 py-1 rounded-full text-sm font-medium hover:bg-purple-500 hover:scale-105 hover:cursor-pointer data-selected:bg-purple-400 transition-all">
                  Mentorship Tips
                </button>
                <button className="bg-(--bg-section) text-white px-3 py-1 rounded-full text-sm font-medium hover:bg-yellow-500 hover:scale-105 hover:cursor-pointer hover:text-black data-selected:bg-yellow-400 transition-all">
                  General Discussion
                </button>
              </div>
              <div className="flex flex-col gap-4">
                {ForumContent.map((discussion, index) => (
                  <div
                    key={index}
                    className="bg-(--bg-section) rounded-2xl p-4 border-2 border-gray-500 hover:border-blue-400 hover:shadow-lg transition-all duration-300 hover:cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold">{discussion.title}</h3>
                      <span
                        className={`${
                          topicColors[discussion.topic] || "bg-gray-600"
                        } text-black px-2 py-1 rounded-lg text-xs font-medium whitespace-nowrap ml-2`}
                      >
                        {discussion.topic}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">
                      {discussion.preview}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-4">
                        <span>Posted by: {discussion.author}</span>
                        <span>•</span>
                        <span>{discussion.time}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span>{discussion.replies} replies</span>
                        <span>•</span>
                        <span>{discussion.views} views</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div
              className={`${
                showCreate ? "flex" : "hidden"
              } flex-col w-full h-full p-6`}
            >
              <Fieldset className="flex flex-col gap-4">
                <legend className="text-2xl font-bold mb-4">
                  Create New Discussion
                </legend>
                <Field className="mt-4">
                  <label
                    htmlFor="discussion_title"
                    className="block text-sm font-medium mb-2"
                  >
                    Discussion Title
                  </label>
                  <Input
                    id="discussion_title"
                    name="discussion_title"
                    type="text"
                    className={
                      "w-full bg-(--bg-section) border-2 border-gray-500 rounded-lg p-2 focus:border-blue-400 transition-colors"
                    }
                  />
                </Field>
                <Field className="mt-4">
                  <label
                    htmlFor="discussion_topic"
                    className="block text-sm font-medium mb-2"
                  >
                    Topic
                  </label>
                  <select
                    id="discussion_topic"
                    name="discussion_topic"
                    className="w-full bg-(--bg-section) rounded-lg p-2 border-2 border-gray-500 focus:border-blue-400 transition-colors"
                  >
                    <option value="STEM Research">STEM Research</option>
                    <option value="Project Ideas">Project Ideas</option>
                    <option value="Mentorship Tips">Mentorship Tips</option>
                    <option value="General Discussion">
                      General Discussion
                    </option>
                  </select>
                </Field>
                <Field className="mt-4">
                  <label
                    htmlFor="discussion_content"
                    className="block text-sm font-medium mb-2"
                  >
                    Content
                  </label>
                  <textarea
                    id="discussion_content"
                    name="discussion_content"
                    className="w-full bg-(--bg-section) rounded-lg p-2 border-2 border-gray-500 focus:border-blue-400 transition-colors"
                    rows={4}
                  ></textarea>
                </Field>
                <Field className="mt-4 flex flex-row justify-around w-[50%] self-center">
                  <Button
                    onClick={() => setShowCreate(false)}
                    className="mt-4 bg-red-400 text-black px-4 py-2 rounded-4xl hover:cursor-pointer hover:scale-105 hover:bg-(--highlighted) hover:text-white shadow-lg transition-[background-color,color,scale] duration-300 ease-in-out"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => setShowCreate(false)}
                    className="mt-4 bg-blue-400 text-black px-4 py-2 rounded-4xl hover:cursor-pointer hover:scale-105 hover:bg-(--highlighted) hover:text-white shadow-lg transition-[background-color,color,scale] duration-300 ease-in-out"
                  >
                    Post Discussion
                  </Button>
                </Field>
              </Fieldset>
            </div>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
}

export default Dashboard;
