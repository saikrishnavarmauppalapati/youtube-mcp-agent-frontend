"use client";

import { useState, useEffect } from "react";
import { 
  getLoginUrl,
  fetchVideos,
  likeVideo,
  commentVideo,
  subscribeChannel,
  getUserInfo,
  logoutUser
} from "../lib/api";

/**
 * Props:
 *  - onSearch(results) : call to load videos in main UI
 *  - onActionResult(msg) : show alert or toast
 */
export default function ChatBot({ onSearch, onActionResult }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi — ask me to search videos or say 'like <videoId>' or 'comment <videoId> <text>'" },
  ]);
  const [user, setUser] = useState(null); // user info after login

  // Check login on mount
  useEffect(() => {
    async function loadUser() {
      try {
        const data = await getMe();
        setUser(data);
      } catch (err) {
        setUser(null);
      }
    }
    loadUser();
  }, []);

  async function send() {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages((m) => [...m, { from: "user", text: userMsg }]);
    setInput("");

    // First try agent (LLM) if available
    const agentResp = await agentChat(userMsg);
    if (!agentResp || agentResp.error) {
      const fallback = await fallbackHandle(userMsg);
      setMessages((m) => [...m, { from: "bot", text: fallback }]);
    } else {
      // handle agent actions
      if (agentResp.action === "search" && agentResp.query) {
        const results = await fetchVideos(agentResp.query); // search using YouTube API
        onSearch(results);
        setMessages((m) => [...m, { from: "bot", text: `Found ${results.length} videos for "${agentResp.query}"` }]);
      } else if (agentResp.action === "like" && agentResp.videoId) {
        const res = await likeVideo(agentResp.videoId);
        setMessages((m) => [...m, { from: "bot", text: res?.status || "Liked!" }]);
        onActionResult("Liked!");
      } else {
        setMessages((m) => [...m, { from: "bot", text: JSON.stringify(agentResp).slice(0, 400) }]);
      }
    }
  }

  async function fallbackHandle(text) {
    const parts = text.split(" ");
    const cmd = parts[0].toLowerCase();

    if (cmd === "search") {
      const q = parts.slice(1).join(" ") || "technology";
      const results = await fetchVideos(q);
      onSearch(results);
      return `Found ${results.length} videos for "${q}"`;
    }

    if (cmd === "like") {
      const vid = parts[1];
      if (!vid) return "Usage: like <videoId>";
      const r = await likeVideo(vid);
      onActionResult("Liked!");
      return "Liked ✅";
    }

    if (cmd === "comment") {
      const vid = parts[1];
      const txt = parts.slice(2).join(" ");
      if (!vid || !txt) return "Usage: comment <videoId> <text>";
      await commentVideo(vid, txt);
      onActionResult("Comment posted!");
      return "Comment posted ✅";
    }

    if (cmd === "subscribe") {
      const ch = parts[1];
      if (!ch) return "Usage: subscribe <channelId>";
      await subscribeChannel(ch);
      onActionResult("Subscribed!");
      return "Subscribed ✅";
    }

    // Default: search
    const results = await fetchVideos(text);
    onSearch(results);
    return `Found ${results.length} videos for "${text}"`;
  }

  async function handleLogout() {
    await logout();
    setUser(null);
    onActionResult("Logged out");
  }

  return (
    <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8 }}>
      <h3>Chatbot</h3>

      {/* User info / login */}
      <div style={{ marginBottom: 12 }}>
        {user ? (
          <div>
            <span>Welcome, {user.name}</span>{" "}
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <a href="/auth/login">
            <button>Login with Google</button>
          </a>
        )}
      </div>

      {/* Messages */}
      <div style={{ height: 360, overflowY: "auto", padding: 8, background: "#fafafa", borderRadius: 6 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 8, textAlign: m.from === "user" ? "right" : "left" }}>
            <div
              style={{
                display: "inline-block",
                padding: "6px 10px",
                borderRadius: 6,
                background: m.from === "user" ? "#DCF8C6" : "#eee",
              }}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask: search cats / like VIDEOID / comment VIDEOID hello"
          style={{ flex: 1, padding: 8 }}
        />
        <button onClick={send} style={{ padding: "8px 12px" }}>
          Send
        </button>
      </div>
    </div>
  );
}
