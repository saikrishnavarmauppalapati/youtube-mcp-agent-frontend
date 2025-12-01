"use client";

import { useState, useEffect, useRef } from "react";
import { callAgent, getLoginUrl, logoutUser, getUserProfile } from "../lib/api";

// User type
interface User {
  name?: string;
  email?: string;
  picture?: string;
  access_token?: string;
}

interface Message {
  from: "bot" | "user";
  text?: string;
  results?: any[]; // for search results
}

export default function ChatBox() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { from: "bot", text: "Hi! Ask me to search videos or to like/comment/subscribe." },
  ]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchUser() {
      const profile = await getUserProfile();
      setUser(profile);
    }
    fetchUser();
  }, []);

  useEffect(() => {
    // Scroll to bottom on new message
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function addMessage(msg: Message) {
    setMessages((prev) => [...prev, msg]);
  }

  async function handleSend() {
    if (!input.trim()) return;
    const text = input.trim();
    addMessage({ from: "user", text });
    setInput("");
    setLoading(true);

    if (!user) {
      alert("Please login to perform actions!");
      setLoading(false);
      return;
    }

    const token = user.access_token ? `Bearer ${user.access_token}` : undefined;

    try {
      const res = await callAgent(text, token);

      if (res.error) {
        addMessage({ from: "bot", text: `Error: ${res.error}` });
      } else if (res.results && Array.isArray(res.results)) {
        addMessage({ from: "bot", results: res.results });
      } else if (res.status) {
        addMessage({ from: "bot", text: res.status });
      } else {
        addMessage({ from: "bot", text: "No valid response from agent." });
      }
    } catch (err) {
      console.error(err);
      addMessage({ from: "bot", text: "Error communicating with AI agent." });
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin() {
    const { url } = await getLoginUrl();
    window.location.href = url;
  }

  async function handleLogout() {
    await logoutUser();
    setUser(null);
    addMessage({ from: "bot", text: "Logged out." });
  }

  return (
    <div className="border p-4 rounded-lg max-w-[700px] mx-auto">
      {/* User Profile / Login */}
      <div className="flex justify-end mb-2">
        {user ? (
          <div className="flex items-center gap-2">
            {user.picture && <img src={user.picture} alt={user.name} className="w-8 h-8 rounded-full" />}
            <span className="font-semibold">{user.name || user.email}</span>
            <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded">
              Logout
            </button>
          </div>
        ) : (
          <button onClick={handleLogin} className="bg-green-500 text-white px-3 py-1 rounded">
            Login
          </button>
        )}
      </div>

      {/* Chat Messages */}
      <div className="h-[400px] overflow-y-auto bg-gray-100 p-3 rounded mb-3">
        {messages.map((m, i) => (
          <div key={i} className={m.from === "bot" ? "text-blue-600 mb-2" : "text-black mb-2"}>
            {m.from === "bot" && m.results ? (
              <div>
                <b>bot:</b>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                  {m.results.map((vid) => (
                    <a
                      key={vid.videoId}
                      href={`https://www.youtube.com/watch?v=${vid.videoId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border rounded p-2 flex gap-2 items-center hover:bg-gray-200"
                    >
                      {vid.thumbnail && <img src={vid.thumbnail} alt={vid.title} className="w-24 h-16 object-cover rounded" />}
                      <span>{vid.title}</span>
                    </a>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <b>{m.from}:</b> {m.text}
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a command..."
          className="flex-1 border p-2 rounded"
        />
        <button
          onClick={handleSend}
          className={`px-4 py-2 rounded text-white ${loading ? "bg-gray-400" : "bg-blue-600"}`}
          disabled={loading}
        >
          {loading ? "Processing..." : "Send"}
        </button>
      </div>
    </div>
  );
}
