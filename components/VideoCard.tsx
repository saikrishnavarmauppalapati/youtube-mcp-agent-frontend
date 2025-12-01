"use client";

import { callAgent } from "../lib/api";

export default function VideoCard({ video, user }: { video: any; user: any }) {
  async function handleAction(action: string) {
    if (!user?.access_token) {
      alert("Please login to perform this action");
      return;
    }

    let command = "";
    switch (action) {
      case "like":
        command = JSON.stringify({ tool: "like", args: { video_id: video.videoId } });
        // We will send the plain command text to agent (agent expects natural language or JSON depending setup).
        // But to be simple, use natural language that LLM will parse, e.g. "like <videoId>" — agent handles both.
        command = `like ${video.videoId}`;
        break;
      case "comment":
        const comment = prompt("Enter your comment:");
        if (!comment) return;
        command = `comment ${video.videoId} ${comment}`;
        break;
      case "subscribe":
        command = `subscribe ${video.channelId}`;
        break;
      default:
        return;
    }

    const token = `Bearer ${user.access_token}`;
    const res = await callAgent(command, token);

    if (res.error) {
      alert("Action failed: " + (res.error || JSON.stringify(res)));
    } else if (res.status) {
      alert(res.status);
    } else if (res.response) {
      alert(res.response);
    } else {
      alert("Action completed");
    }
  }

  return (
    <div className="border rounded shadow p-2">
      <img src={video.thumbnail} alt={video.title} className="w-full rounded" />
      <h2 className="font-bold text-lg mt-2">{video.title}</h2>
      <p className="text-sm text-gray-600 line-clamp-3">{video.description}</p>
      <p className="text-xs text-gray-400 mt-1">Channel: {video.channelId}</p>

      <div className="mt-2 flex gap-2">
        <a
          href={`https://www.youtube.com/watch?v=${video.videoId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline text-sm"
        >
          Watch
        </a>
        <button onClick={() => handleAction("like")} className="bg-green-500 text-white px-2 py-1 rounded text-xs">
          Like
        </button>
        <button onClick={() => handleAction("comment")} className="bg-yellow-500 text-white px-2 py-1 rounded text-xs">
          Comment
        </button>
        <button onClick={() => handleAction("subscribe")} className="bg-purple-500 text-white px-2 py-1 rounded text-xs">
          Subscribe
        </button>
      </div>
    </div>
  );
}
