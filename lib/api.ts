"use client";

export const API_URL = "https://mcp-youtube-agent-xw94.onrender.com";

export async function callAgent(message: string, token?: string) {
  try {
    const res = await fetch(`${API_URL}/agent/run`, {
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

export async function getLoginUrl() {
  const res = await fetch(`${API_URL}/auth/login`);
  return await res.json();
}

export async function logoutUser() {
  const res = await fetch(`${API_URL}/auth/logout`, { method: "POST" });
  return await res.json();
}

export async function getUserProfile() {
  const res = await fetch(`${API_URL}/auth/me`);
  if (res.status === 401) return null;
  return await res.json();
}
