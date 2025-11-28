const BASE_URL = " https://mcp-youtube-agent-xw94.onrender.com"; // replace with your backend URL

export async function getLoginUrl(): Promise<{ url: string | null }> {
  try {
    const res = await fetch(`${BASE_URL}/auth/login`);
    const data = await res.json();

    // Backend returns { auth_url: "..." } so map it to { url: ... }
    return { url: data.auth_url || null };
  } catch (err) {
    console.error("getLoginUrl error:", err);
    return { url: null };
  }
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
export async function agentChat(message: string): Promise<{ bot: string }> {
  const res = await fetch(`${BASE_URL}/mcp/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
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
