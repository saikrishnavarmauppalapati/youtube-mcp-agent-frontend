"use client";

export const API_URL = "https://mcp-youtube-agent-xw94.onrender.com";

// Call AI agent with user message
export async function callAgent(message) {
  try {
    const res = await fetch(`${API_URL}/agent/run`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    return await res.json();
  } catch (err) {
    console.error("Agent API error:", err);
    return { error: "Failed to call agent" };
  }
}

// Optional direct backend actions
export async function likeVideo(videoId) {
  const res = await fetch(`${API_URL}/mcp/youtube/like/${videoId}`, {
    method: "POST",
  });
  return res.json();
}

export async function commentVideo(videoId, text) {
  const res = await fetch(`${API_URL}/mcp/youtube/comment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ video_id: videoId, text }),
  });
  return res.json();
}

export async function subscribeChannel(channelId) {
  const res = await fetch(`${API_URL}/mcp/youtube/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ channel_id: channelId }),
  });
  return res.json();
}

export async function getLoginUrl() {
  const res = await fetch(`${API_URL}/auth/login`);
  return res.json();
}

export async function logoutUser() {
  const res = await fetch(`${API_URL}/auth/logout`, { method: "POST" });
  return res.json();
}
