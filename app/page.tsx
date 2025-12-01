"use client";

import { useEffect, useState } from "react";
import { callAgent, getLoginUrl, logoutUser, getUserProfile } from "../lib/api";
import VideoCard from "../components/VideoCard";

export default function HomePage() {
  const [message, setMessage] = useState("");
  const [videos, setVideos] = useState<any[]>([]);
  const [status, setStatus] = useState("");
  const [user, setUser] = useState<any | null>(null);

  // Load user profile on mount
  useEffect(() => {
    async function loadUser() {
      const u = await getUserProfile();
      setUser(u);
    }
    loadUser();
  }, []);

  // Login
  const handleLogin = async () => {
    const res = await getLoginUrl();
    if (res.auth_url) {
      window.location.href = res.auth_url;
    } else {
      alert("Login URL not available. Check backend.");
    }
  };

  // Logout
  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    setVideos([]);
    alert("Logged out.");
  };

  // Send message to AI agent
  const handleSend = async () => {
    if (!message.trim()) return;
    if (!user) {
      alert("Please login to perform this action");
      return;
    }

    setStatus("Processing...");
    setVideos([]);

    try {
      const token = user?.access_token ? `Bearer ${user.access_token}` : null;
      const data = await callAgent(message, token);

      if (data.error) {
        alert(data.error + (data.details ? ` (${data.details})` : ""));
        setStatus("");
        return;
      }

      // Agent returned search results
      if (Array.isArray(data.results)) {
        setVideos(data.results);
        setStatus(`Found ${data.results.length} videos`);
        return;
      }

      // Agent returned a status string (like/comment/subscribe)
      if (data.status) {
        alert(data.status);
        setStatus("");
        return;
      }

      // Agent returned raw response
      if (data.response && typeof data.response === "string") {
        alert(data.response);
        setStatus("");
        return;
      }

      setStatus("No valid response from agent.");
    } catch (err) {
      console.error(err);
      setStatus("Error communicating with agent.");
    } finally {
      setMessage("");
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">YouTube MCP AI Agent</h1>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {user.picture && (
                <img src={user.picture} alt="profile" className="w-8 h-8 rounded-full" />
              )}
              <span className="font-semibold">{user.name || user.email}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={handleLogin}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              Login
            </button>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Ask me to search, like, comment, or recommend..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border rounded-l px-4 py-2 flex-1"
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 py-2 rounded-r"
        >
          Send
        </button>
      </div>

      {/* Status */}
      {status && <p className="text-green-600 mb-4">{status}</p>}

      {/* Video results */}
      {videos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {videos.map((video, i) => (
            <VideoCard key={video.videoId || i} video={video} user={user} />
          ))}
        </div>
      )}
    </div>
  );
}
