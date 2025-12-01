"use client";

export const API_URL = "https://mcp-youtube-agent-xw94.onrender.com";

// ----------------------------
// Call AI Agent
// ----------------------------
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

// ----------------------------
// Login
// ----------------------------
export async function getLoginUrl() {
  try {
    const res = await fetch(`${API_URL}/auth/login`);
    return await res.json();
  } catch (err) {
    console.error("Login API error:", err);
    return { error: "Failed to get login URL" };
  }
}

// ----------------------------
// Logout
// ----------------------------
export async function logoutUser() {
  try {
    const res = await fetch(`${API_URL}/auth/logout`, { method: "POST" });
    return await res.json();
  } catch (err) {
    console.error("Logout API error:", err);
    return { error: "Failed to logout" };
  }
}

// ----------------------------
// Get User Profile
// ----------------------------
export async function getUserProfile() {
  try {
    const res = await fetch(`${API_URL}/auth/me`);
    if (!res.ok) throw new Error("Not authenticated");
    return await res.json();
  } catch (err) {
    console.error("Get user profile error:", err);
    return null;
  }
}

// ----------------------------
// Get Liked Videos
// ----------------------------
export async function getLikedVideos() {
  try {
    const res = await fetch(`${API_URL}/mcp/youtube/liked`);
    if (!res.ok) throw new Error("Please login to perform this action");
    return await res.json();
  } catch (err) {
    alert(err.message || "Failed to fetch liked videos");
    return { results: [] };
  }
}

// ----------------------------
// Recommend Videos
// ----------------------------
export async function getRecommendedVideos() {
  try {
    const res = await fetch(`${API_URL}/mcp/youtube/recommend`);
    if (!res.ok) throw new Error("Please login to perform this action");
    return await res.json();
  } catch (err) {
    alert(err.message || "Failed to fetch recommended videos");
    return { results: [] };
  }
}

// ----------------------------
// Like Video
// ----------------------------
export async function likeVideo(videoId) {
  try {
    const res = await fetch(`${API_URL}/mcp/youtube/like/${videoId}`, {
      method: "POST",
    });
    if (!res.ok) throw new Error("Please login to perform this action");
    return await res.json();
  } catch (err) {
    alert(err.message || "Failed to like video");
    return { error: err.message };
  }
}

// ----------------------------
// Comment on Video
// ----------------------------
export async function commentVideo(videoId, text) {
  try {
    const res = await fetch(`${API_URL}/mcp/youtube/comment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ video_id: videoId, text }),
    });
    if (!res.ok) throw new Error("Please login to perform this action");
    return await res.json();
  } catch (err) {
    alert(err.message || "Failed to comment on video");
    return { error: err.message };
  }
}

// ----------------------------
// Subscribe to Channel
// ----------------------------
export async function subscribeChannel(channelId) {
  try {
    const res = await fetch(`${API_URL}/mcp/youtube/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ channel_id: channelId }),
    });
    if (!res.ok) throw new Error("Please login to perform this action");
    return await res.json();
  } catch (err) {
    alert(err.message || "Failed to subscribe to channel");
    return { error: err.message };
  }
}
