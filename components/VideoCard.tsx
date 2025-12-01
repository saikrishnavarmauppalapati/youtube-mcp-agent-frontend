"use client";
import React, { useState } from "react";

interface Video {
  title: string;
  videoId: string;
  channelId?: string;
  description?: string;
  thumbnail?: string;
}

interface Props {
  video: Video;
  user: any;
}

export default function VideoCard({ video, user }: Props) {
  const [actionStatus, setActionStatus] = useState("");

  const BASE_URL = "https://mcp-youtube-agent-xw94.onrender.com";

  const headers = user?.access_token
    ? { Authorization: `Bearer ${user.access_token}` }
    : {};

  const handleLike = async () => {
    setActionStatus("Liking...");
    try {
      const res = await fetch(`${BASE_URL}/mcp/youtube/like/${video.videoId}`, {
        method: "POST",
        headers,
      });
      const data = await res.json();
      setActionStatus(data.status || "Liked!");
    } catch (err) {
      console.error(err);
      setActionStatus("Failed to like video");
    }
  };

  const handleComment = async () => {
    const text = prompt("Enter your comment:");
    if (!text) return;
    setActionStatus("Commenting...");
    try {
      const res = await fetch(`${BASE_URL}/mcp/youtube/comment`, {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ video_id: video.videoId, text }),
      });
      const data = await res.json();
      setActionStatus(data.status || "Commented!");
    } catch (err) {
      console.error(err);
      setActionStatus("Failed to comment");
    }
  };

  const handleSubscribe = async () => {
    if (!video.channelId) {
      alert("No channel ID found for this video");
      return;
    }
    setActionStatus("Subscribing...");
    try {
      const res = await fetch(`${BASE_URL}/mcp/youtube/subscribe`, {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ channel_id: video.channelId }),
      });
      const data = await res.json();
      setActionStatus(data.status || "Subscribed!");
    } catch (err) {
      console.error(err);
      setActionStatus("Failed to subscribe");
    }
  };

  return (
    <div className="border rounded p-2 shadow hover:shadow-lg">
      {video.thumbnail && (
        <img src={video.thumbnail} alt={video.title} className="w-full h-40 object-cover rounded" />
      )}
      <h2 className="font-semibold mt-2">{video.title}</h2>
      <p className="text-sm text-gray-600">{video.description}</p>

      <div className="flex gap-2 mt-2">
        <button onClick={handleLike} className="bg-blue-500 text-white px-2 py-1 rounded">
          Like
        </button>
        <button onClick={handleComment} className="bg-green-500 text-white px-2 py-1 rounded">
          Comment
        </button>
        <button onClick={handleSubscribe} className="bg-red-500 text-white px-2 py-1 rounded">
          Subscribe
        </button>
      </div>

      {actionStatus && <p className="text-sm text-gray-800 mt-1">{actionStatus}</p>}

      <a
        href={`https://www.youtube.com/watch?v=${video.videoId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 text-sm mt-1 block"
      >
        Watch on YouTube
      </a>
    </div>
  );
}
