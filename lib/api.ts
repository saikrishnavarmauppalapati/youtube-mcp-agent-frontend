const BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

// --- AUTH ---
export async function getLoginUrl() {
  const res = await fetch(`${BASE}/auth/login`);
  return res.json();  // returns { auth_url }
}

export async function getUserInfo() {
  const res = await fetch(`${BASE}/auth/me`, { credentials: "include" });
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

export async function fetchVideos(query: string) {
  const res = await fetch(`${BASE}/mcp/youtube/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  return res.json();
}

export async function likeVideo(videoId: string) {
  const res = await fetch(`${BASE}/mcp/youtube/like/${videoId}`, { method: "POST" });
  return res.json();
}

export async function commentVideo(videoId: string, text: string) {
  const res = await fetch(`${BASE}/mcp/youtube/comment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ video_id: videoId, text }),
  });
  return res.json();
}

export async function subscribeChannel(channelId: string) {
  const res = await fetch(`${BASE}/mcp/youtube/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ channel_id: channelId }),
  });
  return res.json();
}
