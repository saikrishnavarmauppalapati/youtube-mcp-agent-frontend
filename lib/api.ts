// lib/api.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Login URL
export async function getLoginUrl(): Promise<{ url: string }> {
  const res = await fetch(`${BASE_URL}/auth/login`);
  const data = await res.json();
  return { url: data.auth_url };
}

// Get logged in user
export async function getUserInfo(): Promise<any> {
  const res = await fetch(`${BASE_URL}/auth/me`, { credentials: "include" });
  if (!res.ok) return { error: "not_authenticated" };
  return res.json();
}

// Logout
export async function logoutUser(): Promise<void> {
  await fetch(`${BASE_URL}/auth/logout`, { method: "POST", credentials: "include" });
}

// Fetch videos
export async function fetchVideos(query: string): Promise<any[]> {
  const res = await fetch(`${BASE_URL}/mcp/youtube/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.results || [];
}

// Like video
export async function likeVideo(videoId: string): Promise<any> {
  const res = await fetch(`${BASE_URL}/mcp/youtube/like/${videoId}`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) return { status: "Failed to like" };
  return res.json();
}

// Comment video
export async function commentVideo(videoId: string, text: string): Promise<any> {
  const res = await fetch(`${BASE_URL}/mcp/youtube/comment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ video_id: videoId, text }),
  });
  if (!res.ok) return { status: "Failed to comment" };
  return res.json();
}

// Subscribe channel
export async function subscribeChannel(channelId: string): Promise<any> {
  const res = await fetch(`${BASE_URL}/mcp/youtube/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ channel_id: channelId }),
  });
  if (!res.ok) return { status: "Failed to subscribe" };
  return res.json();
}

// Chatbot (placeholder)
export async function agentChat(prompt: string): Promise<any> {
  return { action: "search", query: prompt };
}
