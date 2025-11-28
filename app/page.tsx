"use client";

import { useState, useEffect } from "react";
import {
  fetchVideos,
  getLoginUrl,
  likeVideo,
  commentVideo,
  subscribeChannel,
  getUserInfo,
  logoutUser
} from "../lib/api";

// Simple toast notification
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
  const [search, setSearch] = useState("technology");
  const [user, setUser] = useState<any>(null);
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<{ user: string; bot: string }[]>([]);

  async function loadVideos(query?: string) {
    const data = await fetchVideos(query || search);
    setVideos(data);
  }

  async function loadUser() {
    const u = await getUserInfo();
    if (u && !u.error) setUser(u);
  }

  useEffect(() => {
    loadVideos();
    loadUser();
  }, []);

  async function handleLogin() {
    const { url } = await getLoginUrl();
    window.location.href = url;
  }

  async function handleLogout() {
    await logoutUser();
    window.location.reload();
  }

  // Extract videoId from URL or ID
  function extractVideoId(url: string) {
    try {
      const parsed = new URL(url);
      return parsed.searchParams.get("v") || url;
    } catch {
      return url;
    }
  }

  // Chatbot command handler
  async function handleChatCommand(command: string) {
    setChatHistory((prev) => [...prev, { user: command, bot: "Processing..." }]);
    const lower = command.toLowerCase();

    if (lower.includes("search")) {
      const query = command.replace(/search/i, "").trim();
      const data = await fetchVideos(query);
      setVideos(data);
      setChatHistory((prev) => [...prev.slice(0, -1), { user: command, bot: `Found ${data.length} videos for "${query}"` }]);
    } else if (lower.includes("like")) {
      const parts = command.split(" ");
      const videoId = extractVideoId(parts[parts.length - 1]);
      const res = await likeVideo(videoId);
      showToast(res.status || "Liked!");
      setChatHistory((prev) => [...prev.slice(0, -1), { user: command, bot: res.status || "Liked!" }]);
    } else if (lower.includes("comment")) {
      const match = command.match(/comment (.+)/i);
      if (match) {
        const commentText = match[1];
        const lastVideo = videos[0]; // default: first video
        if (lastVideo) {
          const res = await commentVideo(lastVideo.videoId, commentText);
          showToast(res.status || "Comment posted!");
          setChatHistory((prev) => [...prev.slice(0, -1), { user: command, bot: res.status || "Comment posted!" }]);
        }
      }
    } else if (lower.includes("subscribe")) {
      const channelId = videos[0]?.channelId;
      if (channelId) {
        const res = await subscribeChannel(channelId);
        showToast(res.status || "Subscribed!");
        setChatHistory((prev) => [...prev.slice(0, -1), { user: command, bot: res.status || "Subscribed!" }]);
      }
    } else {
      setChatHistory((prev) => [...prev.slice(0, -1), { user: command, bot: "Unknown command" }]);
    }

    setChatInput("");
  }

  return (
    <div style={{ padding: "20px", maxWidth: 900, margin: "auto" }}>

      {/* HEADER */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>YouTube MCP Agent</h1>
        <div>
          {!user ? (
            <button onClick={handleLogin} style={{ background: "#4285F4", color: "white", padding: "10px", borderRadius: "6px" }}>
              Login with Google
            </button>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <img src={user.picture} width={40} height={40} style={{ borderRadius: "50%" }} />
              <div>
                <b>{user.name}</b>
                <div style={{ fontSize: 12, color: "#555" }}>{user.email}</div>
              </div>
              <button onClick={handleLogout} style={{ background: "#e53935", color: "white", padding: "8px 12px", borderRadius: "8px" }}>
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* CHATBOT */}
      <div style={{ marginTop: 20, border: "1px solid #ccc", borderRadius: 8, padding: 15 }}>
        <h2>ChatBot</h2>
        <div style={{ maxHeight: 200, overflowY: "auto", marginBottom: 10 }}>
          {chatHistory.map((c, i) => (
            <div key={i} style={{ marginBottom: 6 }}>
              <b>User:</b> {c.user} <br />
              <b>Bot:</b> {c.bot}
            </div>
          ))}
        </div>
        <input
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Type a command..."
          style={{ padding: 8, width: "70%" }}
        />
        <button
          onClick={() => handleChatCommand(chatInput)}
          style={{ marginLeft: 10, padding: 8, cursor: "pointer" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#ddd")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "")}
        >
          Send
        </button>
      </div>

      {/* VIDEO LIST */}
      <div style={{ marginTop: 30 }}>
        {videos.map((v: any) => (
          <div key={v.videoId} style={{ marginBottom: 30, borderBottom: "1px solid #ddd", paddingBottom: 20 }}>
            <h2>{v.title}</h2>
            <a href={`https://www.youtube.com/watch?v=${v.videoId}`} target="_blank">
              <img src={v.thumbnail} width={320} height={180} style={{ borderRadius: 8 }} />
            </a>
            <p>{v.description}</p>
            <button
              onClick={async () => { const res = await likeVideo(v.videoId); showToast(res.status || "Liked!"); }}
              style={{ marginRight: 10, padding: 8, cursor: "pointer" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#ddd")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "")}
            >
              👍 Like
            </button>
	    <button
              onClick={async () => {
              const userComment = prompt("Enter your comment:"); // prompt for comment
              if (!userComment) return; // if empty, do nothing
              const res = await commentVideo(v.videoId, userComment);
              alert(res.status); // show toast/alert for success or failure
              }}
              style={{ marginLeft: 10 }}
            >
              💬 Comment
	    </button>
            <button
              onClick={async () => { const res = await subscribeChannel(v.channelId); showToast(res.status || "Subscribed!"); }}
              style={{ padding: 8, cursor: "pointer" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#ddd")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "")}
            >
              🔔 Subscribe
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
