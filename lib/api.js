// NO "use client" needed here
export const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://mcp-youtube-agent-xw94.onrender.com";

export async function callAgent(message) {
  try {
    const res = await fetch(`${API_URL}/agent/run`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    return await res.json();
  } catch (err) {
    console.error("Agent API error:", err);
    return { error: "Failed to call agent" };
  }
}
