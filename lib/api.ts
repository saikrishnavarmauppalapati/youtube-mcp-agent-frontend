"use client";

export const API_URL = "https://mcp-youtube-agent-xw94.onrender.com";

// ---- Types ----
export interface User {
  name?: string;
  email?: string;
  picture?: string;
  access_token?: string;
}

export interface AgentResponse {
  results?: any[];
  status?: string;
  response?: string;
  error?: string;
  details?: string;
}

// ---- API functions ----
export async function callAgent(message: string, token?: string): Promise<AgentResponse> {
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

export async function getLoginUrl(): Promise<{ auth_url?: string }> {
  const res = await fetch(`${API_URL}/auth/login`);
  return await res.json();
}

export async function logoutUser(): Promise<{ status: string }> {
  const res = await fetch(`${API_URL}/auth/logout`, { method: "POST" });
  return await res.json();
}

export async function getUserProfile(): Promise<User | null> {
  const res = await fetch(`${API_URL}/auth/me`);
  if (res.status === 401) return null;

  const data = await res.json();
  return {
    name: data.name,
    email: data.email,
    picture: data.picture,
    access_token: (data as any).access_token || undefined,
  };
}
