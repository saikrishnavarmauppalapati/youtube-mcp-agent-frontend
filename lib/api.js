// lib/api.js

// ----------------------------
// BASE URL
// ----------------------------
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://youtube-mcp-agent-backend.vercel.app";

// ----------------------------
// FETCH VIDEOS
// ----------------------------
export async function fetchVideos(query) {
  try {
    const res = await fetch(`${BASE_URL}/mcp/youtube/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
    const data = await res.json();
    return data.results || [];
  } catch (err) {
    console.error("fetchVideos error:", err);
    return [];
  }
}

// ----------------------------
// LIKE VIDEO
// ----------------------------
export async function likeVideo(videoId) {
  try {
    const res = await fetch(`${BASE_URL}/mcp/youtube/like/${videoId}`, { method: "POST" });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("likeVideo error:", err);
    return { status: "error", error: err.message };
  }
}

// ----------------------------
// COMMENT VIDEO
// ----------------------------
export async function commentVideo(videoId, text) {
  try {
    const res = await fetch(`${BASE_URL}/mcp/youtube/comment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ video_id: videoId, text }),
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("commentVideo error:", err);
    return { status: "error", error: err.message };
  }
}

// ----------------------------
// SUBSCRIBE CHANNEL
// ----------------------------
export async function subscribeChannel(channelId) {
  try {
    const res = await fetch(`${BASE_URL}/mcp/youtube/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ channel_id: channelId }),
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("subscribeChannel error:", err);
    return { status: "error", error: err.message };
  }
}

// ----------------------------
// AGENT CHAT (Optional LLM)
// ----------------------------
export async function agentChat(prompt) {
  try {
    const res = await fetch(`${BASE_URL}/agent/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("agentChat error:", err);
    return null;
  }
}

// ----------------------------
// GET LOGGED-IN USER INFO
// ----------------------------
export async function getMe() {
  const res = await fetch(`${BASE_URL}/auth/me`);
  if (!res.ok) throw new Error("Not authenticated");
  return res.json();
}

// ----------------------------
// LOGOUT
// ----------------------------
export async function logout() {
  const res = await fetch(`${BASE_URL}/auth/logout`, { method: "POST" });
  return res.json();
}
