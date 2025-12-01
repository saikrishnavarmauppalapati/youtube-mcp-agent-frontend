"use client";

export const API_URL = "https://mcp-youtube-agent-xw94.onrender.com";

export async function callAgent(message) {
  try {
    const res = await fetch(`${API_URL}/agent/run`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
      credentials: "include",
    });
    const data = await res.json();
    if (data.error && data.error.includes("not_authenticated")) {
      return { error: "Please login to perform this action" };
    }
    return data;
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
  await fetch(`${API_URL}/auth/logout`, { method: "POST" });
}

export async function getUserProfile() {
  const res = await fetch(`${API_URL}/auth/me`);
  const data = await res.json();
  if (data.error && data.error === "not_authenticated") return null;
  return data;
}
