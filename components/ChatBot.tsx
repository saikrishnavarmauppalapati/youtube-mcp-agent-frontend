"use client";

import { useState, useEffect, useRef } from "react";

// API helpers
async function getLoginUrl() {
  const res = await fetch("/auth/login");
  return res.json();
}

async function logoutUser() {
  await fetch("/auth/logout", { method: "POST" });
}

async function getUserProfile(token?: string) {
  const res = await fetch("/auth/me", {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  return res.json();
}

async function callAgent(message: string, token: string) {
  const res = await fetch("/agent/run", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ message }),
  });
  return res.json();
}

// Types
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
    { from: "bot", text: "Hi! Ask me to search, like, comment, subscribe, liked or recommend videos." },
  ]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load user on mount
    async function fetchUser() {
      try {
        const profile = await getUserProfile();
        if (!profile.error) setUser(profile);
      } catch {}
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

    if (!user?.access_token) {
      alert("Please login first!");
      setLoading(false);
      return;
    }

    try {
      const res = await callAgent(text, user.access_token);
      if (res.error) {
        addMessage("bot", `Error: ${res.error}`);
      } else if (res.results) {
        addMessage("bot", JSON.stringify(res.results, null, 2));
      } else if (res.status) {
        addMessage("bot", res.status);
      } else {
        addMessage("bot", "No valid response from agent.");
      }
    } catch (err) {
      console.error(err);
      addMessage("bot", "Error communicating with agent.");
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  async function handleLogin() {
    const { auth_url } = await getLoginUrl();
    window.location.href = auth_url;
  }

  async function handleLogout() {
    await logoutUser();
    setUser(null);
    addMessage("bot", "Logged out.");
  }

  return (
    <div className="max-w-xl mx-auto p-4 border rounded-lg shadow-md">
      {/* User info / login */}
      <div className="flex justify-end mb-3">
        {user ? (
          <div className="flex items-center gap-2">
            {user.picture && <img src={user.picture} alt={user.name} className="w-8 h-8 rounded-full" />}
            <span className="font-semibold">{user.name || user.email}</span>
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

      {/* Chat messages */}
      <div className="h-64 overflow-y-auto bg-gray-100 p-3 rounded mb-3">
        {messages.map((m, i) => (
          <div key={i} className={m.from === "bot" ? "text-blue-600" : "text-black"}>
            <b>{m.from}:</b> {m.text}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          placeholder="Type a command (search/like/comment/subscribe/liked/recommend)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 border rounded"
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className={`px-4 py-2 rounded text-white ${loading ? "bg-gray-400" : "bg-blue-600"}`}
        >
          {loading ? "Processing..." : "Send"}
        </button>
      </div>
    </div>
  );
}
