"use client";

import { useState, useEffect } from "react";
import {
  getLoginUrl,
  fetchVideos,
  likeVideo,
  commentVideo,
  subscribeChannel,
  getUserInfo,
  logoutUser,
} from "../lib/api";

// Simple toast
function showToast(msg: string) {
  const el = document.createElement("div");
  el.innerText = msg;
  el.style.position = "fixed";
  el.style.bottom = "20px";
  el.style.right = "20px";
  el.style.background = "#333";
  el.style.color = "#fff";
  el.style.padding = "10px 15px";
  el.style.borderRadius = "6px";
  el.style.zIndex = "9999";
  document.body.appendChild(el);
  setTimeout(() => document.body.removeChild(el), 3000);
}

export default function Home() {
  const [videos, setVideos] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<
    { user: string; bot: string }[]
  >([]);

  // Load user info
  useEffect(() => {
    async function loadUser() {
      try {
        const u = await getUserInfo();
        if (!u.error) setUser(u);
      } catch {
        setUser(null);
      }
    }
    loadUser();
  }, []);

  // Load default videos
  useEffect(() => {
    async function loadDefault() {
      const data = await fetchVideos("technology");
      setVideos(data);
    }
    loadDefault();
  }, []);

  async function handleLogin() {
    const { url } = await getLoginUrl();
    if (url) {
      window.location.href = url;
    } else {
      alert("Failed to get login URL");
    }
  }

  async function handleLogout() {
    await logoutUser();
    setUser(null);
    setVideos([]);
    setChatHistory([]);
  }

  async function handleChatCommand(command: string) {
    if (!command.trim()) return;

    setChatHistory((prev) => [
      ...prev,
      { user: command, bot: "Processing..." },
    ]);

    const lower = command.toLowerCase();

    try {
      if (lower.startsWith("search")) {
        const q = command.replace(/search/i, "").trim();
        const data = await fetchVideos(q);
        setVideos(data);
        setChatHistory((p) => [
          ...p.slice(0, -1),
          { user: command, bot: `Found ${data.length} videos for "${q}"` },
        ]);
      } else if (lower.startsWith("like")) {
        const vId = command.split(" ")[1];
        const res = await likeVideo(vId);
        showToast(res.status || "Liked!");
        setChatHistory((p) => [
          ...p.slice(0, -1),
          { user: command, bot: res.status },
        ]);
      } else if (lower.startsWith("comment")) {
        const parts = command.split(" ");
        const vId = parts[1];
        const text = parts.slice(2).join(" ");
        if (!vId || !text) throw new Error("Usage: comment <videoId> <text>");
        const res = await commentVideo(vId, text);
        showToast("Comment posted!");
        setChatHistory((p) => [
          ...p.slice(0, -1),
          { user: command, bot: "Comment posted!" },
        ]);
      } else if (lower.startsWith("subscribe")) {
        const cId = command.split(" ")[1];
        const res = await subscribeChannel(cId);
        showToast(res.status || "Subscribed!");
        setChatHistory((p) => [
          ...p.slice(0, -1),
          { user: command, bot: res.status },
        ]);
      } else {
        setChatHistory((p) => [
          ...p.slice(0, -1),
          { user: command, bot: "Unknown command" },
        ]);
      }
    } catch (err: any) {
      showToast(err.message);
      setChatHistory((p) => [
        ...p.slice(0, -1),
        { user: command, bot: err.message || "Error" },
      ]);
    }

    setChatInput("");
  }

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "auto" }}>
      {/* Header */}
      <header style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>YouTube MCP Agent</h1>
        {!user ? (
          <button
            onClick={handleLogin}
            style={{
              background: "#4285F4",
              color: "white",
              padding: 10,
              borderRadius: 6,
            }}
          >
            Login
          </button>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img
              src={user.picture}
              width={40}
              height={40}
              style={{ borderRadius: "50%" }}
            />
            <div>
              <b>{user.name}</b>
              <div style={{ fontSize: 12 }}>{user.email}</div>
            </div>
            <button
              onClick={handleLogout}
              style={{
                background: "#e53935",
                color: "white",
                padding: "8px 12px",
                borderRadius: 8,
              }}
            >
              Logout
            </button>
          </div>
        )}
      </header>

      {/* Chatbot */}
      <div
        style={{
          marginTop: 20,
          border: "1px solid #ccc",
          borderRadius: 8,
          padding: 15,
        }}
      >
        <h2>ChatBot</h2>
        <div style={{ maxHeight: 200, overflowY: "auto", marginBottom: 10 }}>
          {chatHistory.map((c, i) => (
            <div key={i} style={{ marginBottom: 6 }}>
              <b>User:</b> {c.user}
              <br />
              <b>Bot:</b> {c.bot}
            </div>
          ))}
        </div>

        <input
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Type a command…"
          style={{ padding: 8, width: "70%" }}
        />

        <button
          onClick={() => handleChatCommand(chatInput)}
          style={{ marginLeft: 10, padding: 8 }}
        >
          Send
        </button>
      </div>

      {/* Videos */}
      <div style={{ marginTop: 30 }}>
        {videos.map((v) => (
          <div
            key={v.videoId}
            style={{
              marginBottom: 30,
              borderBottom: "1px solid #ddd",
              paddingBottom: 20,
            }}
          >
            <h2>{v.title}</h2>
            <a
              href={`https://www.youtube.com/watch?v=${v.videoId}`}
              target="_blank"
            >
              <img
                src={v.thumbnail}
                width={320}
                height={180}
                style={{ borderRadius: 8 }}
              />
            </a>
            <p>{v.description}</p>

            <button
              onClick={async () => {
                const res = await likeVideo(v.videoId);
                showToast(res.status);
              }}
              style={{ marginRight: 10, padding: 8 }}
            >
              👍 Like
            </button>

            <button
              onClick={async () => {
                const c = prompt("Enter comment:");
                if (!c) return;
                await commentVideo(v.videoId, c);
                showToast("Comment posted!");
              }}
              style={{ marginRight: 10, padding: 8 }}
            >
              💬 Comment
            </button>

            <button
              onClick={async () => {
                const res = await subscribeChannel(v.channelId);
                showToast(res.status);
              }}
              style={{ padding: 8 }}
            >
              🔔 Subscribe
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
