"use client";
import { useState, useEffect } from "react";
import { callAgent, getLoginUrl, logoutUser, getUserProfile } from "../lib/api";
import VideoCard from "../components/VideoCard";

export default function HomePage() {
  const [message, setMessage] = useState("");
  const [videos, setVideos] = useState([]);
  const [status, setStatus] = useState("");
  const [user, setUser] = useState(null);

  // Fetch user profile on load
  useEffect(() => {
    async function fetchUser() {
      const profile = await getUserProfile();
      setUser(profile);
    }
    fetchUser();
  }, []);

  const handleLogin = async () => {
    const { auth_url } = await getLoginUrl();
    window.location.href = auth_url;
  };

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    alert("Logged out successfully");
  };

  const handleSend = async () => {
    if (!message) return;
    setStatus("Processing...");
    setVideos([]);

    try {
      const data = await callAgent(message);

      if (data.error) {
        alert(data.error);
        setStatus("");
        return;
      }

      if (data.results && Array.isArray(data.results)) {
        setVideos(data.results);
        setStatus(`Found ${data.results.length} videos`);
      } else if (data.status) {
        alert(data.status);
        setStatus("");
      } else {
        setStatus("No valid response from agent.");
      }
    } catch (err) {
      console.error(err);
      setStatus("Error communicating with AI agent.");
    }

    setMessage("");
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">YouTube MCP AI Agent</h1>
        <div>
          {user ? (
            <div className="flex items-center gap-2">
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
      </div>

      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Ask me to search, like, comment, or recommend..."
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
          {videos.map((video, index) => {
            if (!video || !video.videoId) return null;
            return <VideoCard key={video.videoId || index} video={video} />;
          })}
        </div>
      )}
    </div>
  );
}
