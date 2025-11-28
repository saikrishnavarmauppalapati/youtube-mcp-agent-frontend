const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://youtube-mcp-agent-backend.vercel.app";

// Login URL
export async function getLoginUrl(): Promise<{ url: string }> {
  const res = await fetch(`${BASE_URL}/auth/login`);
  const data = await res.json();
  return { url: data.auth_url }; // must match backend JSON key
}

// Fetch videos
export async function fetchVideos(query: string): Promise<any[]> {
  const res = await fetch(`${BASE_URL}/mcp/youtube/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  const data = await res.json();
  return data.results || [];
}

// Other actions
export async function likeVideo(videoId: string) {
  const res = await fetch(`${BASE_URL}/mcp/youtube/like/${videoId}`, { method: "POST" });
  return res.json();
}

export async function commentVideo(videoId: string, text: string) {
  const res = await fetch(`${BASE_URL}/mcp/youtube/comment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ video_id: videoId, text }),
  });
  return res.json();
}

export async function subscribeChannel(channelId: string) {
  const res = await fetch(`${BASE_URL}/mcp/youtube/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ channel_id: channelId }),
  });
  return res.json();
}

export async function getUserInfo() {
  const res = await fetch(`${BASE_URL}/auth/me`);
  return res.json();
}

export async function logoutUser() {
  const res = await fetch(`${BASE_URL}/auth/logout`, { method: "POST" });
  return res.json();
}
