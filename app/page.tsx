"use client";

import { useEffect, useState } from "react";
import { callAgent, getLoginUrl, getUserProfile, logoutUser } from "../lib/api";
import VideoCard from "../components/VideoCard";

export default function HomePage() {
  const [message, setMessage] = useState("");
  const [videos, setVideos] = useState<any[]>([]);
  const [status, setStatus] = useState("");
  const [user, setUser] = useState<any>(null);

  // Load user profile
  useEffect(() => {
    async function loadUser() {
      const u = await getUserProfile();
      setUser(u);
    }
    loadUser();
  }, []);

  // Login
  const handleLogin = async () => {
    const { auth_url } = await getLoginUrl();
    if (auth_url) window.location.href = auth_url;
  };

  // Logout
  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
  };

  // Send message to agent
  const handleSend = async () => {
    if (!message.trim()) return;

    setStatus("Processing...");
    setVideos([]);

    const data = await callAgent(message);

    console.log("FINAL DATA:", data);

    if (data.error) {
      setStatus(data.error);
      return;
    }

    if (data.results) {
      setVideos(data.results);
      setStatus(`Found ${data.results.length} videos`);
      return;
    }

    if (data.status) {
      setStatus(data.status);
      return;
    }

    setStatus("No valid response from agent.");
  };

  return (
    <div className="container mx-auto p-4">

      {/* Navbar */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">YouTube MCP AI Agent</h1>

        {user ? (
          <div className="flex items-center gap-3">
            {user.picture ? (
              <img
                src={user.picture}
                className="w-10 h-10 rounded-full border"
                alt="profile"
              />
            ) : null}

            <span className="font-semibold">{user.name}</span>

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

      {/* Input */}
      <div className="flex mb-4">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Search DevOps videos, Like, Comment, etc..."
          className="border px-4 py-2 flex-1 rounded-l"
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 py-2 rounded-r"
        >
          Send
        </button>
      </div>

      {status && <p className="text-blue-600 mb-4">{status}</p>}

      {/* Videos */}
      {videos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {videos.map((video, i) => (
            <VideoCard key={i} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}
