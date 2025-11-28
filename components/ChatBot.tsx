"use client";

import { useState } from "react";
import {
  fetchVideos,
  likeVideo,
  commentVideo,
  subscribeChannel,
  getLoginUrl,
  logoutUser,
} from "../lib/api";

interface ChatBotProps {
  onSearch: (q: string) => void;
  onActionResult: (msg: string) => void;
}

export default function ChatBot({ onSearch, onActionResult }: ChatBotProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! Ask me to search videos or to like/comment/subscribe." }
  ]);

  function addMessage(from: string, text: string) {
    setMessages((m) => [...m, { from, text }]);
  }

  async function handleSend() {
    if (!input.trim()) return;

    const text = input.trim();
    addMessage("user", text);

    // --- commands ---
    if (text.startsWith("search ")) {
      const query = text.replace("search ", "");
      onSearch(query);
      addMessage("bot", `Searching for "${query}"...`);
      setInput("");
      return;
    }

    if (text.startsWith("like ")) {
      const id = text.replace("like ", "");
      const r = await likeVideo(id);
      onActionResult(r.message || "Done");
      addMessage("bot", "Liked the video!");
      setInput("");
      return;
    }

    if (text.startsWith("comment ")) {
      const [, id, ...rest] = text.split(" ");
      const comment = rest.join(" ");
      const r = await commentVideo(id, comment);
      onActionResult(r.message || "Comment added");
      addMessage("bot", "Comment posted!");
      setInput("");
      return;
    }

    if (text.startsWith("subscribe ")) {
      const id = text.replace("subscribe ", "");
      const r = await subscribeChannel(id);
      onActionResult(r.message || "Subscribed");
      addMessage("bot", "Subscribed to channel!");
      setInput("");
      return;
    }

    if (text === "login") {
      const { url } = await getLoginUrl();
      window.location.href = url;
      return;
    }

    if (text === "logout") {
      await logoutUser();
      addMessage("bot", "Logged out.");
      return;
    }

    addMessage("bot", `I did not understand: "${text}"`);
    setInput("");
  }

  return (
    <div className="border p-4 rounded-lg max-w-[500px]">
      <div className="h-[250px] overflow-y-auto bg-gray-100 p-3 rounded">
        {messages.map((m, i) => (
          <div key={i} className={m.from === "bot" ? "text-blue-600" : "text-black"}>
            <b>{m.from}:</b> {m.text}
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border p-2 rounded"
          placeholder="Type a command..."
        />
        <button onClick={handleSend} className="bg-blue-600 text-white px-3 rounded">
          Send
        </button>
      </div>
    </div>
  );
}
