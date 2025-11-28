const BASE_URL = "https://mcp-youtube-agent-xw94.onrender.com"; // replace with your backend URL

// ----------------------------
// LOGIN
// ----------------------------
export async function getLoginUrl(): Promise<{ url: string | null }> {
  try {
    const res = await fetch(`${BASE_URL}/auth/login`);
    const data = await res.json();
    return { url: data.auth_url || null };
  } catch (err) {
    console.error("getLoginUrl error:", err);
    return { url: null };
  }
}

// ----------------------------
// VIDEO SEARCH
// ----------------------------
export async function fetchVideos(query: string): Promise<any[]> {
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
export async function likeVideo(videoId: string) {
  try {
    const res = await fetch(`${BASE_URL}/mcp/youtube/like/${videoId}`, { method: "POST" });
    return res.json();
  } catch (err) {
    console.error("likeVideo error:", err);
    return { status: "error" };
  }
}

// ----------------------------
// COMMENT VIDEO
// ----------------------------
export async function commentVideo(videoId: string, text: string) {
  try {
    const res = await fetch(`${BASE_URL}/mcp/youtube/comment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ video_id: videoId, text }),
    });
    return res.json();
  } catch (err) {
    console.error("commentVideo error:", err);
    return { status: "error" };
  }
}

// ----------------------------
// SUBSCRIBE CHANNEL
// ----------------------------
export async function subscribeChannel(channelId: string) {
  try {
    const res = await fetch(`${BASE_URL}/mcp/youtube/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ channel_id: channelId }),
    });
    return res.json();
  } catch (err) {
    console.error("subscribeChannel error:", err);
    return { status: "error" };
  }
}

// ----------------------------
// AGENT CHAT (optional if backend supports it)
// ----------------------------
export async function agentChat(message: string): Promise<{ bot: string }> {
  try {
    const res = await fetch(`${BASE_URL}/mcp/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    return res.json();
  } catch (err) {
    console.error("agentChat error:", err);
    return { bot: "Error" };
  }
}

// ----------------------------
// USER INFO
// ----------------------------
export async function getUserInfo() {
  try {
    const res = await fetch(`${BASE_URL}/auth/me`);
    return res.json();
  } catch (err) {
    console.error("getUserInfo error:", err);
    return null;
  }
}

// ----------------------------
// LOGOUT
// ----------------------------
export async function logoutUser() {
  try {
    const res = await fetch(`${BASE_URL}/auth/logout`, { method: "POST" });
    return res.json();
  } catch (err) {
    console.error("logoutUser error:", err);
    return { status: "error" };
  }
}
