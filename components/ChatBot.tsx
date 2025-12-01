"use client";

import { useState, useEffect } from "react";
import {
  callAgent,
  getLoginUrl,
  logoutUser,
  getUserProfile,
} from "../lib/api";

// User type
interface User {
  name?: string;
  email?: string;
  picture?: string;
  access_token?: string;
}

interface Message {
  from: "bot" | "user";
  text: string;
}

export default function ChatBox() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { from: "bot", text: "Hi! Ask me to search videos or to like/comment/subscribe." },
  ]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // On load, fetch user profile if logged in
    async function fetchUser() {
      try {
        const profile = await getUserProfile();
        setUser(profile);
      } catch {
        setUser(null);
      }
    }
    fetchUser();
  }, []);

  function addMessage(from: "bot" | "user", text: string) {
    setMessages((prev) => [...prev, { from, text }]);
  }

  async function handleSend() {
    if (!input.trim()) return;

    const text = input.trim();
    addMessage("user", text);
    setInput("");
    setLoading(true);

    if (!user) {
      alert("Please login to perform actions!");
      setLoading(false);
      return;
    }

    // FIX #1 — Proper token passing
    const token = user?.access_token ? `Bearer ${user.access_token}` : undefined;

    try {
      // FIX #2 — Pass both message & token
      const res = await callAgent(text, token);

      if (res.error) {
        addMessage("bot", `Error: ${res.error}`);
      } else if (res.results && Array.isArray(res.results)) {
        addMessage("bot", `Found ${res.results.length} videos`);
      } else if (res.status) {
        alert(res.status);
        addMessage("bot", res.status);
      } else {
        addMessage("bot", "No valid response from agent.");
      }
    } catch (err) {
      console.error(err);
      addMessage("bot", "Error communicating with AI agent.");
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
    addMessage("bot", "Logged out.");
  }

  return (
    <div className="border p-4 rounded-lg max-w-[600px] mx-auto">
      {/* User Profile / Login */}
      <div className="flex justify-end mb-2">
        {user ? (
          <div className="flex items-center gap-2">
            {user.picture && (
              <img
                src={user.picture}
                alt={user.name}
                className="w-8 h-8 rounded-full"
              />
            )}
            <span className="font-semibold">{user?.name || user?.email}</span>
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
      <div className="h-[300px] overflow-y-auto bg-gray-100 p-3 rounded mb-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={m.from === "bot" ? "text-blue-600" : "text-black"}
          >
            <b>{m.from}:</b> {m.text}
          </div>
        ))}
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
