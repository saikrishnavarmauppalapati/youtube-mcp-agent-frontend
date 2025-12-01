"use client";
import { useState } from "react";
import { callAgent } from "../lib/api";
import VideoCard from "../components/VideoCard";

export default function HomePage() {
  const [message, setMessage] = useState("");
  const [videos, setVideos] = useState([]);
  const [status, setStatus] = useState("");

  const handleSend = async () => {
    if (!message) return;
    setStatus("Processing...");
    setVideos([]);
    const data = await callAgent(message);
    setStatus("");
    if (data.error) {
      alert(data.error);
      return;
    }

    if (data.results) {
      setVideos(data.results);
    } else if (data.status) {
      setStatus(data.status);
    }

    setMessage("");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">YouTube MCP AI Agent</h1>

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

      {status && <p className="text-green-600 mb-4">{status}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {videos.map((video) => (
          <VideoCard key={video.videoId} video={video} />
        ))}
      </div>
    </div>
  );
}
