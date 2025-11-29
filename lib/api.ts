const BASE = "https://mcp-youtube-agent-xw94.onrender.com";

// --- AUTH ---
export async function getLoginUrl() {
  const res = await fetch(`${BASE}/auth/login`, { cache: "no-store" });
  const data = await res.json();
  return { url: data.auth_url }; // normalize for frontend
}

export async function getUserInfo() {
  const res = await fetch(`${BASE}/auth/me`, {
    credentials: "include",
    cache: "no-store",
  });
  return res.json();
}

export async function logoutUser() {
  const res = await fetch(`${BASE}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
  return res.json();
}

// --- YOUTUBE ACTIONS ---

export async function fetchVideos(query) {
  const res = await fetch(`${BASE}/mcp/youtube/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify({ query }),
  });

  const data = await res.json();
  return data.results || [];
}

export async function likeVideo(videoId) {
  const res = await fetch(`${BASE}/mcp/youtube/like/${videoId}`, {
    method: "POST",
  });
  return res.json();
}

export async function commentVideo(videoId, text) {
  const res = await fetch(`${BASE}/mcp/youtube/comment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ video_id: videoId, text }),
  });
  return res.json();
}

export async function subscribeChannel(channelId) {
  const res = await fetch(`${BASE}/mcp/youtube/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ channel_id: channelId }),
  });
  return res.json();
}
