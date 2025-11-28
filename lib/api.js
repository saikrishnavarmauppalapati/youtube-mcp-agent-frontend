export const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;
const YT_API_KEY = process.env.NEXT_PUBLIC_YT_API_KEY;

// ----------------------------
// FETCH VIDEOS (using YouTube API key for search)
// ----------------------------
export async function fetchVideos(query) {
  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(
        query
      )}&key=${YT_API_KEY}&maxResults=10`
    );
    const data = await res.json();

    const results = data.items.map((item) => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.medium.url,
      channelId: item.snippet.channelId,
      channel: item.snippet.channelTitle,
    }));

    return results;
  } catch (err) {
    console.error("Error fetching videos:", err);
    return [];
  }
}

// ----------------------------
// LOGIN URL
// ----------------------------
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

// ----------------------------
// LOGOUT
// ----------------------------
export async function logoutUser() {
  try {
    await fetch(`${API_BASE}/auth/logout`);
    localStorage.removeItem("access_token");
    return { status: "logged out" };
  } catch (err) {
    console.error("Error logging out:", err);
    return { status: "error" };
  }
}

// ----------------------------
// GET LOGGED-IN USER INFO
// ----------------------------
export async function getUserInfo() {
  const token = localStorage.getItem("access_token");
  if (!token) return { error: "not_authenticated" };

  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return { error: "not_authenticated" };
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error fetching user info:", err);
    return { error: "not_authenticated" };
  }
}

// ----------------------------
// LIKE VIDEO
// ----------------------------
export async function likeVideo(videoId) {
  const token = localStorage.getItem("access_token");
  if (!token) return { status: "Login required" };

  try {
    const res = await fetch(`${API_BASE}/mcp/youtube/like/${videoId}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    return { status: data.status || "Liked!" };
  } catch (err) {
    console.error("Error liking video:", err);
    return { status: "Error liking video" };
  }
}

// ----------------------------
// COMMENT VIDEO
// ----------------------------
export async function commentVideo(videoId, text) {
  const token = localStorage.getItem("access_token");
  if (!token) return { status: "Login required" };

  try {
    const res = await fetch(`${API_BASE}/mcp/youtube/comment`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ video_id: videoId, text }),
    });
    const data = await res.json();
    return { status: data.status || "Comment posted!" };
  } catch (err) {
    console.error("Error commenting:", err);
    return { status: "Error posting comment" };
  }
}

// ----------------------------
// SUBSCRIBE CHANNEL
// ----------------------------
export async function subscribeChannel(channelId) {
  const token = localStorage.getItem("access_token");
  if (!token) return { status: "Login required" };

  try {
    const res = await fetch(`${API_BASE}/mcp/youtube/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ channel_id: channelId }),
    });
    const data = await res.json();
    return { status: data.status || "Subscribed!" };
  } catch (err) {
    console.error("Error subscribing:", err);
    return { status: "Error subscribing" };
  }
}

// ----------------------------
// AGENT CHAT (optional LLM for ChatBot)
// ----------------------------
export async function agentChat(query) {
  try {
    const res = await fetch(`${API_BASE}/mcp/agent/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error agent chat:", err);
    return { error: "Agent unavailable" };
  }
}
