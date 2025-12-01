"use client";

import { useEffect, useState } from "react";
import { callAgent, getLoginUrl, logoutUser, getUserProfile } from "../lib/api";
import VideoCard from "../components/VideoCard";

export default function HomePage() {
  const [message, setMessage] = useState("");
  const [videos, setVideos] = useState<any[]>([]);
  const [status, setStatus] = useState("");
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    async function load() {
      const u = await getUserProfile();
      setUser(u);
    }
    load();
  }, []);

  const handleLogin = async () => {
    const res = await getLoginUrl();
    if (res.auth_url) {
      window.location.href = res.auth_url;
    } else {
      alert("Login URL not available. Check backend.");
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    setVideos([]);
    alert("Logged out.");
  };

  const handleSend = async () => {
    if (!message.trim()) return;
    setStatus("Processing...");
    setVideos([]);

    try {
      // pass token if available (getUserProfile attaches access_token)
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

      // Agent returned a status string (for like/comment/subscribe)
      if (data.status) {
        alert(data.status);
        setStatus("");
        return;
      }

      // In some cases agent returns {response: "..."} or other shapes
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
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">YouTube MCP AI Agent</h1>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              {user.picture && (
                <img src={user.picture} alt="profile" className="w-8 h-8 rounded-full" />
              )}
              <span className="font-semibold">{user.name || user.email}</span>
              <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded">
                Logout
              </button>
            </>
          ) : (
            <button onClick={handleLogin} className="bg-green-500 text-white px-3 py-1 rounded">
              Login
            </button>
          )}
        </div>
      </div>

      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Ask me to search (e.g. 'search devops'), like, comment, or recommend..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border rounded-l px-4 py-2 flex-1"
        />
        <button
          onClick={() => {
            if (!user) {
              alert("Please login to perform this action");
              return;
            }
            handleSend();
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-r"
        >
          Send
        </button>
      </div>

      {status && <p className="text-green-600 mb-4">{status}</p>}

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
