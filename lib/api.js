"use client";

export const API_URL = "https://mcp-youtube-agent-xw94.onrender.com";

// Call AI agent
export async function callAgent(message, token) {
  try {
    const res = await fetch(`${API_URL}/agent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: token } : {}),
      },
      body: JSON.stringify({ message }),
    });
    return await res.json();
  } catch (err) {
    console.error("Agent API error:", err);
    return { error: "Failed to call agent" };
  }
}

// OAuth login
export async function getLoginUrl() {
  const res = await fetch(`${API_URL}/auth/login`);
  return await res.json();
}

// Logout user
export async function logoutUser() {
  const res = await fetch(`${API_URL}/auth/logout`, { method: "POST" });
  return await res.json();
}

// Get logged-in user profile
export async function getUserProfile() {
  const res = await fetch(`${API_URL}/auth/me`);
  if (res.status === 401) return null;
  return await res.json();
}
