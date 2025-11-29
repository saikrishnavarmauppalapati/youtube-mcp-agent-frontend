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
  const [chatHistory, setChatHistory] = useState<{ user: string; bot: string }[]>([]);

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
    const { auth_url } = await getLoginUrl();
    if (auth_url) {
      window.location.href = auth_url;
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
    setChatHistory((prev) => [...prev, { user: command, bot: "Processing..." }]);
    const lower = command.toLowerCase();

    try {
      if (lower.startsWith("search")) {
        const query = command.replace(/search/i, "").trim();
        const data = await fetchVideos(query);
        setVideos(data);
        setChatHistory((prev) => [...prev.slice(0, -1), { user: command, bot: `Found ${data.length} videos for "${query}"` }]);
      } else if (lower.startsWith("like")) {
        const videoId = command.split(" ")[1];
        const res = await likeVideo(videoId);
        showToast(res.status || "Liked!");
        setChatHistory((prev) => [...prev.slice(0, -1), { user: command, bot: res.status || "Liked!" }]);
      } else if (lower.startsWith("comment")) {
        const [_, videoId, ...textParts] = command.split(" ");
        const commentText = textParts.join(" ");
        if (!videoId || !commentText) throw new Error("Usage: comment <videoId> <text>");
        const res = await commentVideo(videoId, commentText);
        showToast(res.status || "Comment posted!");
        setChatHistory((prev) => [...prev.slice(0, -1), { user: command, bot: res.status || "Comment posted!" }]);
      } else if (lower.startsWith("subscribe")) {
        const channelId = command.split(" ")[1];
        if (!channelId) throw new Error("Usage: subscribe <channelId>");
        const res = await subscribeChannel(channelId);
        showToast(res.status || "Subscribed!");
        setChatHistory((prev) => [...prev.slice(0, -1), { user: command, bot: res.status || "Subscribed!" }]);
      } else {
        setChatHistory((prev) => [...prev.slice(0, -1), { user: command, bot: "Unknown command" }]);
      }
    } catch (err: any) {
      setChatHistory((prev) => [...prev.slice(0, -1), { user: command, bot: err.message || "Error" }]);
      showToast(err.message || "Error executing command");
    }

    setChatInput("");
  }

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "auto" }}>
      
      {/* Header */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>YouTube MCP Agent</h1>
        <div>
          {!user ? (
            <button onClick={handleLogin} style={{ background: "#4285F4", color: "white", padding: 10, borderRadius: 6 }}>
              Login with Google
            </button>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <img src={user.picture} width={40} height={40} style={{ borderRadius: "50%" }} />
              <div>
                <b>{user.name}</b>
                <div style={{ fontSize: 12, color: "#555" }}>{user.email}</div>
              </div>
              <button onClick={handleLogout} style={{ background: "#e53935", color: "white", padding: "8px 12px", borderRadius: 8 }}>
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Chatbot */}
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
        <button onClick={() => handleChatCommand(chatInput)} style={{ marginLeft: 10, padding: 8 }}>
          Send
        </button>
      </div>

      {/* Video list */}
      <div style={{ marginTop: 30 }}>
        {videos.map((v: any) => (
          <div key={v.videoId} style={{ marginBottom: 30, borderBottom: "1px solid #ddd", paddingBottom: 20 }}>

            <h2
              onClick={() => window.open(`https://www.youtube.com/watch?v=${v.videoId}`, "_blank")}
              style={{ cursor: "pointer", color: "#1a0dab" }}
            >
              {v.title}
            </h2>

            <img
              src={v.thumbnail}
              width={320}
              height={180}
              style={{ borderRadius: 8, cursor: "pointer" }}
              onClick={() => window.open(`https://www.youtube.com/watch?v=${v.videoId}`, "_blank")}
            />

            <p>{v.description}</p>

            <button
              onClick={async () => { 
                if (!user) return alert("Please login first");
                const res = await likeVideo(v.videoId); 
                showToast(res.status || "Liked!"); 
              }}
              style={{ marginRight: 10, padding: 8 }}
            >
              👍 Like
            </button>

            <button
              onClick={async () => { 
                if (!user) return alert("Please login first");
                const comment = prompt("Enter comment:"); 
                if (!comment) return; 
                const res = await commentVideo(v.videoId, comment); 
                showToast(res.status || "Comment posted!"); 
              }}
              style={{ marginRight: 10, padding: 8 }}
            >
              💬 Comment
            </button>

            <button
              onClick={async () => { 
                if (!user) return alert("Please login first");
                const res = await subscribeChannel(v.channelId); 
                showToast(res.status || "Subscribed!"); 
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
