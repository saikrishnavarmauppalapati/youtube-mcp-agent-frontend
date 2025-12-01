"use client";

export const API_URL = "https://mcp-youtube-agent-xw94.onrender.com";

// Call AI agent with message
export async function callAgent(message, token) {
  try {
    const res = await fetch(`${API_URL}/agent/run`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { "Authorization": `Bearer ${token}` }),
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
    return await res.json();
  } catch (err) {
    console.error(err);
    return { error: "Failed to get login URL" };
  }
}

// Logout user
export async function logoutUser() {
  try {
    const res = await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
    });
    return await res.json();
  } catch (err) {
    console.error(err);
    return { error: "Failed to logout" };
  }
}

// Get logged-in user profile
export async function getUserProfile() {
  try {
    const res = await fetch(`${API_URL}/auth/me`);
    if (res.status === 401) return null;
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}
