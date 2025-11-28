"use client";

import { useState } from "react";
import ChatBot from "../components/ChatBot";
import { fetchVideos } from "../lib/api";

export default function Home() {
  const [videos, setVideos] = useState<any[]>([]);

  async function handleSearch(query: string) {
    const result = await fetchVideos(query);

    if (result?.items) {
      setVideos(result.items);
    } else {
      setVideos([]);
    }
  }

  function handleAction(msg: string) {
    alert(msg);
  }

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold mb-4">YouTube MCP AI</h1>

      <ChatBot onSearch={handleSearch} onActionResult={handleAction} />

      <h2 className="text-xl font-semibold mt-6">Search Results</h2>

      <div className="grid grid-cols-3 gap-4 mt-3">
        {videos.map((v: any) => (
          <div key={v.id} className="border rounded p-2">
            <img src={v.thumbnail} className="w-full rounded" />
            <p className="font-semibold">{v.title}</p>
            <p className="text-sm text-gray-600">{v.channelTitle}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
