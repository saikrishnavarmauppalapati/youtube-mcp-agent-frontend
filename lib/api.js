"use client";

export const API_URL = "https://mcp-youtube-agent-xw94.onrender.com";

export async function callAgent(message, token) {
  try {
    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = token;
    }

    const res = await fetch(`${API_URL}/agent/run`, {
      method: "POST",
      headers,
      body: JSON.stringify({ message }),
    });

    return await res.json();
  } catch (err) {
    console.error("Agent API error:", err);
    return { error: "Failed to call agent" };
  }
}

export async function getLoginUrl() {
  try {
    const res = await fetch(`${API_URL}/auth/login`);
    return await res.json();
  } catch {
    return { error: "Failed to get login URL" };
  }
}

export async function logoutUser() {
  try {
    const res = await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
    });
    return await res.json();
  } catch {
    return { error: "Failed to logout" };
  }
}

export async function getUserProfile() {
  try {
    const res = await fetch(`${API_URL}/auth/me`);
    if (res.status === 401) return null;
    return await res.json();
  } catch {
    return null;
  }
}
