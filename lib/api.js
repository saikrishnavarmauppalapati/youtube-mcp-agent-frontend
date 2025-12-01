"use client";

export const API_URL = "https://mcp-youtube-agent-xw94.onrender.com";

// Helper: get stored token from localStorage
function getStoredToken() {
  try {
    const t = localStorage.getItem("access_token");
    return t ? `Bearer ${t}` : null;
  } catch {
    return null;
  }
}

// Call AI agent with message. token param optional; falls back to localStorage.
export async function callAgent(message, token = null) {
  try {
    const auth = token || getStoredToken();
    const res = await fetch(`${API_URL}/agent/run`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(auth && { Authorization: auth }),
      },
      body: JSON.stringify({ message }),
    });
    return await res.json();
  } catch (err) {
    console.error("Agent API error:", err);
    return { error: "Failed to call agent" };
  }
}

// OAuth login URL
export async function getLoginUrl() {
  try {
    const res = await fetch(`${API_URL}/auth/login`);
    return await res.json(); // { auth_url: "..." }
  } catch (err) {
    console.error("getLoginUrl error:", err);
    return { error: "Failed to get login URL" };
  }
}

// Logout user (also clear localStorage)
export async function logoutUser() {
  try {
    const res = await fetch(`${API_URL}/auth/logout`, { method: "POST" });
    // clear local token
    try { localStorage.removeItem("access_token"); } catch {}
    return await res.json();
  } catch (err) {
    console.error("logout error:", err);
    try { localStorage.removeItem("access_token"); } catch {}
    return { error: "Failed to logout" };
  }
}

// Get logged-in user profile
// This will call backend /auth/me (which accepts Authorization header) AND attach access_token from localStorage
export async function getUserProfile() {
  try {
    const token = localStorage.getItem("access_token");
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    const res = await fetch(`${API_URL}/auth/me`, { headers });
    if (res.status === 401) return null;
    const profile = await res.json();
    // attach access_token so frontend can use it
    if (profile && token) profile.access_token = token;
    return profile;
  } catch (err) {
    console.error("getUserProfile error:", err);
    return null;
  }
}
