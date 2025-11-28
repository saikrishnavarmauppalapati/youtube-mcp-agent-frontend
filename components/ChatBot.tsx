"use client";

import { useState } from "react";
import { fetchVideos, likeVideo, commentVideo, subscribeChannel } from "../lib/api";

interface ChatBotProps {
  onSearch?: (query: string) => void;
  onActionResult?: (msg: string) => void;
}

export default function ChatBot({ onSearch = () => {}, onActionResult = () => {} }: ChatBotProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi — ask me to search videos or say 'like <videoId>' or 'comment <videoId> <text>'" },
  ]);

  async function send() {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages((m) => [...m, { from: "user", text: userMsg }]);
    setInput("");

    // Fallback parsing only (agentChat removed for now)
    const parts = userMsg.split(" ");
    const cmd = parts[0].toLowerCase();

    if (cmd === "search") {
      const q = parts.slice(1).join(" ") || "technology";
      const results = await fetchVideos(q);
      onSearch(q);
      setMessages((m) => [...m, { from: "bot", text: `Searched for "${q}" and found ${results.length} videos.` }]);
    } else if (cmd === "like") {
      const vid = parts[1];
      if (!vid) return setMessages((m) => [...m, { from: "bot", text: "Usage: like <videoId>" }]);
      const res = await likeVideo(vid);
      onActionResult(res.status);
      setMessages((m) => [...m, { from: "bot", text: res.status }]);
    } else if (cmd === "comment") {
      const vid = parts[1];
      const txt = parts.slice(2).join(" ");
      if (!vid || !txt) return setMessages((m) => [...m, { from: "bot", text: "Usage: comment <videoId> <text>" }]);
      const res = await commentVideo(vid, txt);
      onActionResult(res.status);
      setMessages((m) => [...m, { from: "bot", text: res.status }]);
    } else if (cmd === "subscribe") {
      const ch = parts[1];
      if (!ch) return setMessages((m) => [...m, { from: "bot", text: "Usage: subscribe <channelId>" }]);
      const res = await subscribeChannel(ch);
      onActionResult(res.status);
      setMessages((m) => [...m, { from: "bot", text: res.status }]);
    } else {
      const results = await fetchVideos(userMsg);
      onSearch(userMsg);
      setMessages((m) => [...m, { from: "bot", text: `Searched for "${userMsg}" and returned ${results.length} videos` }]);
    }
  }

  return (
    <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8 }}>
      <h3>Chatbot</h3>
      <div style={{ height: 360, overflowY: "auto", padding: 8, background: "#fafafa", borderRadius: 6 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 8, textAlign: m.from === "user" ? "right" : "left" }}>
            <div style={{ display: "inline-block", padding: "6px 10px", borderRadius: 6, background: m.from === "user" ? "#DCF8C6" : "#eee" }}>
              {m.text}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask: search cats / like VIDEOID / comment VIDEOID hello" style={{ flex: 1, padding: 8 }} />
        <button onClick={send} style={{ padding: "8px 12px" }}>Send</button>
      </div>
    </div>
  );
}
