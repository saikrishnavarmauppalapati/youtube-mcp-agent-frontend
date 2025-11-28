const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

/* ---------------------- AUTH ---------------------- */
export async function getLoginUrl() {
  const res = await fetch(`${BASE_URL}/auth/login-url`);
  return res.json();
}

export async function getUserInfo() {
  const res = await fetch(`${BASE_URL}/auth/me`, { credentials: "include" });
  return res.json();
}

export async function logoutUser() {
  const res = await fetch(`${BASE_URL}/auth/logout`, {
    method: "POST",
    credentials: "include"
  });
  return res.json();
}

/* ---------------------- YOUTUBE ACTIONS ---------------------- */

export async function fetchVideos(query: string) {
  const res = await fetch(`${BASE_URL}/mcp/youtube/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ query })
  });

  return res.json();
}

export async function likeVideo(videoId: string) {
  const res = await fetch(`${BASE_URL}/mcp/youtube/like`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ videoId })
  });

  return res.json();
}

export async function commentVideo(videoId: string, text: string) {
  const res = await fetch(`${BASE_URL}/mcp/youtube/comment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ videoId, text })
  });

  return res.json();
}

export async function subscribeChannel(channelId: string) {
  const res = await fetch(`${BASE_URL}/mcp/youtube/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ channelId })
  });

  return res.json();
}
