"use client";

import { useState, useEffect } from "react";
import {
  likeVideo,
  commentVideo,
  subscribeChannel,
  getLoginUrl,
  logoutUser,
  getUserInfo,
  callAgent,
} from "../lib/api";

interface ChatBotProps {
  onSearch?: (q: string) => void;
}

export default function ChatBox({ onSearch }: ChatBotProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! Ask me to search videos or to like/comment/subscribe." },
  ]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // fetch user info on load
    const fetchUser = async () => {
      const u = await getUserInfo();
      if (u) setUser(u);
    };
    fetchUser();
  }, []);

  function addMessage(from: string, text: string) {
    setMessages((m) => [...m, { from, text }]);
  }

  const handleLogin = async () => {
    const { url } = await getLoginUrl();
    window.location.href = url;
  };

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    alert("Logged out successfully.");
  };

  async function handleSend() {
    if (!input.trim()) return;

    const text = input.trim();
    addMessage("user", text);

    if (!user) {
      alert("Please login to perform actions.");
      setInput("");
      return;
    }

    // If command starts with known actions, handle directly
    if (text.startsWith("search ")) {
      const query = text.replace("search ", "");
      if (onSearch) onSearch(query);
      addMessage("bot", `Searching for "${query}"...`);
      setInput("");
      return;
    }

    if (text.startsWith("like ")) {
      const id = text.replace("like ", "");
      const r = await likeVideo(id);
      alert("Video liked successfully!");
      addMessage("bot", "Liked the video!");
      setInput("");
      return;
    }

    if (text.startsWith("comment ")) {
      const [, id, ...rest] = text.split(" ");
      const comment = rest.join(" ");
      const r = await commentVideo(id, comment);
      alert("Comment posted successfully!");
      addMessage("bot", "Comment posted!");
      setInput("");
      return;
    }

    if (text.startsWith("subscribe ")) {
      const id = text.replace("subscribe ", "");
      const r = await subscribeChannel(id);
      alert("Subscribed to channel successfully!");
      addMessage("bot", "Subscribed to channel!");
      setInput("");
      return;
    }

    // If not direct command, call AI agent
    try {
      const data = await callAgent(text);
      if (data.error) {
        addMessage("bot", data.error);
      } else if (data.results) {
        addMessage("bot", "Here are some videos for you.");
        if (onSearch) onSearch(data.results); // pass results to video display
      } else if (data.status) {
        addMessage("bot", data.status);
      } else {
        addMessage("bot", "No valid response from agent.");
      }
    } catch (err) {
      console.error(err);
      addMessage("bot", "Error communicating with AI agent.");
    }

    setInput("");
  }

  return (
    <div className="border p-4 rounded-lg max-w-[500px]">
      {/* User Login / Profile */}
      <div className="mb-2 flex justify-end gap-2">
        {user ? (
          <div className="flex items-center gap-2">
            <span className="font-semibold">{user?.name || user?.email || "User"}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogin}
            className="bg-green-500 text-white px-3 py-1 rounded"
          >
            Login
          </button>
        )}
      </div>

      {/* Chat Messages */}
      <div className="h-[250px] overflow-y-auto bg-gray-100 p-3 rounded mb-3">
        {messages.map((m, i) => (
          <div key={i} className={m.from === "bot" ? "text-blue-600" : "text-black"}>
            <b>{m.from}:</b> {typeof m.text === "string" ? m.text : JSON.stringify(m.text)}
          </div>
        ))}
      </div>

      {/* Input Box */}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border p-2 rounded"
          placeholder="Type a command..."
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-3 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
