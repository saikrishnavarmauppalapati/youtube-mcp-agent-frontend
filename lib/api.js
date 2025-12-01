"use client";

export const API_URL = "https://mcp-youtube-agent-xw94.onrender.com";

// Call MCP Agent
export async function callAgent(message) {
  try {
    const res = await fetch(`${API_URL}/agent/run`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();
    console.log("AGENT RESPONSE:", data);
    return data;
  } catch (err) {
    console.error("Agent API error:", err);
    return { error: "Failed to call agent" };
  }
}

// Login
export async function getLoginUrl() {
  try {
    const res = await fetch(`${API_URL}/auth/login`);
    return await res.json();
  } catch (err) {
    return { error: "Failed to get login URL" };
  }
}

// Logout
export async function logoutUser() {
  try {
    const res = await fetch(`${API_URL}/auth/logout`, { method: "POST" });
    return await res.json();
  } catch (err) {
    return { error: "Failed to logout" };
  }
}

// Get User Profile
export async function getUserProfile() {
  try {
    const res = await fetch(`${API_URL}/auth/me`);
    if (res.status === 401) return null;
    return await res.json();
  } catch (err) {
    return null;
  }
}
