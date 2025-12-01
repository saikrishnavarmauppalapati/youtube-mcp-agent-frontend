const BASE_URL = "https://mcp-youtube-agent-xw94.onrender.com";

// --- Login URL ---
export async function getLoginUrl() {
  const res = await fetch(`${BASE_URL}/auth/login`);
  return res.json();
}

// --- Logout ---
export async function logoutUser() {
  await fetch(`${BASE_URL}/auth/logout`, { method: "POST", credentials: "include" });
}

// --- Get Profile ---
export async function getUserProfile() {
  const res = await fetch(`${BASE_URL}/auth/profile`, {
    credentials: "include",
  });

  if (!res.ok) return null;
  return res.json();
}

// --- CALL AGENT (MAIN FIX) ---
export async function callAgent(message, token) {
  console.log("Sending to agent =>", message, token);

  const res = await fetch(`${BASE_URL}/agent`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: token } : {}),
    },
    body: JSON.stringify({ message }),
  });

  let data;
  try {
    data = await res.json();
  } catch (e) {
    return { error: "Invalid JSON from backend" };
  }

  console.log("Agent response =>", data);
  return data;
}
