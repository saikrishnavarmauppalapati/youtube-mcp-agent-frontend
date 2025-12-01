"use client";

import { useState } from "react";
import {
  callAgent,
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

    // Check for frontend commands
    if (text.startsWith("like ")) {
      const id = text.replace("like ", "");
      const r = await likeVideo(id);
      onActionResult(r.status || "Liked");
      addMessage("bot", "Liked the video!");
      setInput("");
      return;
    }

    if (text.startsWith("comment ")) {
      const [, id, ...rest] = text.split(" ");
      const comment = rest.join(" ");
      const r = await commentVideo(id, comment);
      onActionResult(r.status || "Commented");
      addMessage("bot", "Comment posted!");
      setInput("");
      return;
    }

    if (text.startsWith("subscribe ")) {
      const id = text.replace("subscribe ", "");
      const r = await subscribeChannel(id);
      onActionResult(r.status || "Subscribed");
      addMessage("bot", "Subscribed!");
      setInput("");
      return;
    }

    if (text === "login") {
      const { auth_url } = await getLoginUrl();
      window.location.href = auth_url;
      return;
    }

    if (text === "logout") {
      await logoutUser();
      addMessage("bot", "Logged out.");
      return;
    }

    // Everything else → send to AI agent
    try {
      const response = await callAgent(text);
      if (response.results) {
        onSearch(response.results);
        addMessage("bot", "Here are some video results.");
      } else if (response.status) {
        addMessage("bot", response.status);
      } else if (response.error) {
        addMessage("bot", response.error);
      } else {
        addMessage("bot", "I did not understand your request.");
      }
    } catch (err) {
      console.error(err);
      addMessage("bot", "Error communicating with AI agent.");
    }

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
