// lib/api.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://your-backend-domain.com";

export async function getLoginUrl() {
  const res = await fetch(`${BASE_URL}/auth/login`);
  const data = await res.json();
  return { url: data.auth_url };
}

export async function getUserInfo() {
  const res = await fetch(`${BASE_URL}/auth/me`, {
    credentials: "include",
  });
  if (!res.ok) return { error: "not_authenticated" };
  return res.json();
}

export async function logoutUser() {
  await fetch(`${BASE_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
}

export async function fetchVideos(query: string) {
  const res = await fetch(`${BASE_URL}/mcp/youtube/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.results || [];
}

export async function likeVideo(videoId: string) {
  const res = await fetch(`${BASE_URL}/mcp/youtube/like/${videoId}`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) return { status: "Failed to like" };
  return res.json();
}

export async function commentVideo(videoId: string, text: string) {
  const res = await fetch(`${BASE_URL}/mcp/youtube/comment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ video_id: videoId, text }),
  });
  if (!res.ok) return { status: "Failed to comment" };
  return res.json();
}

export async function subscribeChannel(channelId: string) {
  const res = await fetch(`${BASE_URL}/mcp/youtube/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ channel_id: channelId }),
  });
  if (!res.ok) return { status: "Failed to subscribe" };
  return res.json();
}
