"use client";

import { useState, useEffect } from "react";
import { callAgent, getUserProfile, getLoginUrl, logoutUser } from "../lib/api";

interface ChatBotProps {
  onVideosUpdate: (videos: any[]) => void;
}

export default function ChatBox({ onVideosUpdate }: ChatBotProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! Ask me to search videos or to like/comment/subscribe." },
  ]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const profile = await getUserProfile();
      setUser(profile);
    }
    fetchUser();
  }, []);

  function addMessage(from: string, text: string) {
    setMessages((m) => [...m, { from, text }]);
  }

  const handleLogin = async () => {
    const { auth_url } = await getLoginUrl();
    window.location.href = auth_url;
  };

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    alert("Logged out successfully");
  };

  async function handleSend() {
    if (!input.trim()) return;
    const text = input.trim();
    addMessage("user", text);

    if (!user) {
      alert("Please login to perform actions");
      setInput("");
      return;
    }

    // Send message to AI agent
    try {
      const data = await callAgent(text);

      if (data.error) {
        alert(data.error);
        addMessage("bot", "Action failed");
        setInput("");
        return;
      }

      // Show results if any
      if (data.results && Array.isArray(data.results)) {
        onVideosUpdate(data.results);
        addMessage("bot", `Found ${data.results.length} videos`);
      } else if (data.status) {
        alert(data.status);
        addMessage("bot", data.status);
      } else {
        addMessage("bot", "No valid response from agent.");
      }
    } catch (err) {
      console.error(err);
      addMessage("bot", "Error communicating with AI agent");
    }

    setInput("");
  }

  return (
    <div className="border p-4 rounded-lg max-w-[500px]">
      <div className="flex justify-between mb-2">
        {user ? (
          <div className="flex items-center gap-2">
            <span className="font-semibold">{user.name}</span>
            <button onClick={handleLogout} className="bg-red-500 text-white px-2 py-1 rounded">
              Logout
            </button>
          </div>
        ) : (
          <button onClick={handleLogin} className="bg-green-500 text-white px-2 py-1 rounded">
            Login
          </button>
        )}
      </div>

      <div className="h-[250px] overflow-y-auto bg-gray-100 p-3 rounded mb-2">
        {messages.map((m, i) => (
          <div key={i} className={m.from === "bot" ? "text-blue-600" : "text-black"}>
            <b>{m.from}:</b> {m.text}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border p-2 rounded"
          placeholder="Type a command..."
        />
        <button onClick={handleSend} className="bg-blue-600 text-white px-3 rounded">
          Send
        </button>
      </div>
    </div>
  );
}
