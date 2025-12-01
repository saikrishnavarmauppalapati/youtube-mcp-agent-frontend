"use client";

import { callAgent, getUserProfile } from "../lib/api";

export default function VideoCard({ video }: { video: any }) {
  async function handleAction(action: string) {
    const user = await getUserProfile();
    if (!user) {
      alert("Please login to perform this action");
      return;
    }

    let command = "";
    switch (action) {
      case "like":
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

    const res = await callAgent(command);
    if (res.error) {
      alert(res.error);
    } else {
      alert(`${action.charAt(0).toUpperCase() + action.slice(1)} successful!`);
    }
  }

  return (
    <div className="border rounded shadow p-2">
      <img src={video.thumbnail} alt={video.title} className="w-full rounded" />
      <h2 className="font-bold text-lg mt-2">{video.title}</h2>
      <p className="text-sm text-gray-600">{video.description}</p>
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
        <button
          onClick={() => handleAction("like")}
          className="bg-green-500 text-white px-2 py-1 rounded text-xs"
        >
          Like
        </button>
        <button
          onClick={() => handleAction("comment")}
          className="bg-yellow-500 text-white px-2 py-1 rounded text-xs"
        >
          Comment
        </button>
        <button
          onClick={() => handleAction("subscribe")}
          className="bg-purple-500 text-white px-2 py-1 rounded text-xs"
        >
          Subscribe
        </button>
      </div>
    </div>
  );
}
