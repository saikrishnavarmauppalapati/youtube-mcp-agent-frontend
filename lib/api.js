export const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

// FETCH VIDEOS
export async function fetchVideos(query) {
  try {
    const res = await fetch(`${API_BASE}/mcp/youtube/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ query }),
    });
    const data = await res.json();
    return data.results || [];
  } catch (err) {
    console.error("Error fetching videos:", err);
    return [];
  }
}

// LOGIN URL
export async function getLoginUrl() {
  try {
    const res = await fetch(`${API_BASE}/auth/login`);
    const data = await res.json();
    return { url: data.auth_url };
  } catch (err) {
    console.error("Error getting login URL:", err);
    return { url: "#" };
  }
}

// LOGOUT
export async function logoutUser() {
  try {
    await fetch(`${API_BASE}/auth/logout`, { credentials: "include" });
    return { status: "logged out" };
  } catch (err) {
    console.error("Error logging out:", err);
    return { status: "error" };
  }
}

// GET LOGGED-IN USER INFO
export async function getUserInfo() {
  try {
    const res = await fetch(`${API_BASE}/auth/me`, { credentials: "include" });
    if (!res.ok) return { error: "not_authenticated" };
    return await res.json();
  } catch (err) {
    console.error("Error fetching user info:", err);
    return { error: "not_authenticated" };
  }
}

// LIKE VIDEO
export async function likeVideo(videoId) {
  try {
    const res = await fetch(`${API_BASE}/mcp/youtube/like/${videoId}`, { method: "POST", credentials: "include" });
    const data = await res.json();
    return { status: data.status || "Liked!" };
  } catch (err) {
    console.error("Error liking video:", err);
    return { status: "Error liking video" };
  }
}

// COMMENT VIDEO
export async function commentVideo(videoId, text) {
  try {
    const res = await fetch(`${API_BASE}/mcp/youtube/comment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ video_id: videoId, text }),
    });
    const data = await res.json();
    return { status: data.status || "Comment posted!" };
  } catch (err) {
    console.error("Error commenting:", err);
    return { status: "Error posting comment" };
  }
}

// SUBSCRIBE CHANNEL
export async function subscribeChannel(channelId) {
  try {
    const res = await fetch(`${API_BASE}/mcp/youtube/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ channel_id: channelId }),
    });
    const data = await res.json();
    return { status: data.status || "Subscribed!" };
  } catch (err) {
    console.error("Error subscribing:", err);
    return { status: "Error subscribing" };
  }
}
