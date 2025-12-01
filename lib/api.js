"use client";

export const API_URL = "https://mcp-youtube-agent-xw94.onrender.com";

// ----------------------------
// Agent Call
// ----------------------------
export async function callAgent(message) {
  try {
    const res = await fetch(`${API_URL}/agent/run`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
      credentials: "include",
    });
    return await res.json();
  } catch (err) {
    console.error("Agent API error:", err);
    return { error: "Failed to call agent" };
  }
}

// ----------------------------
// OAuth Login URL
// ----------------------------
export async function getLoginUrl() {
  const res = await fetch(`${API_URL}/auth/login`);
  return await res.json(); // returns { auth_url: "..." }
}

// ----------------------------
// Logout
// ----------------------------
export async function logoutUser() {
  await fetch(`${API_URL}/auth/logout`, { method: "POST" });
}

// ----------------------------
// Get User Profile
// ----------------------------
export async function getUserProfile() {
  try {
    const res = await fetch(`${API_URL}/auth/me`);
    if (res.status === 401) return null;
    return await res.json(); // { name, email, picture }
  } catch (err) {
    console.error(err);
    return null;
  }
}
