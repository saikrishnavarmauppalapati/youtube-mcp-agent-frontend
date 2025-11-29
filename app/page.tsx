"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const BACKEND = "https://mcp-youtube-agent-xw94.onrender.com";

  const [user, setUser] = useState<any>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(false);

  // -----------------------------
  // Fetch logged-in user
  // -----------------------------
  const fetchUser = async () => {
    try {
      const res = await fetch(`${BACKEND}/auth/me`);
      if (res.status === 200) {
        const data = await res.json();
        setUser(data);
      } else {
        setUser(null);
      }
    } catch (e) {
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // -----------------------------
  // Login
  // -----------------------------
  const login = async () => {
    const res = await fetch(`${BACKEND}/auth/login`);
    const data = await res.json();
    window.location.href = data.auth_url;
  };

  // -----------------------------
  // Logout
  // -----------------------------
  const logout = async () => {
    await fetch(`${BACKEND}/auth/logout`, { method: "POST" });
    setUser(null);
  };

  // -----------------------------
  // Video Search
  // -----------------------------
  const searchVideos = async () => {
    setLoading(true);

    const res = await fetch(`${BACKEND}/mcp/youtube/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });

    const data = await res.json();
    setResults(data.results || []);
    setLoading(false);
  };

  // -----------------------------
  // Protected Action Check
  // -----------------------------
  const requireLogin = () => {
    if (!user) {
      alert("Please login to continue.");
      return false;
    }
    return true;
  };

  // -----------------------------
  // Like
  // -----------------------------
  const likeVideo = async (videoId: string) => {
    if (!requireLogin()) return;

    await fetch(`${BACKEND}/mcp/youtube/like/${videoId}`, { method: "POST" });
    alert("Video liked!");
  };

  // -----------------------------
  // Comment
  // -----------------------------
  const commentVideo = async (videoId: string) => {
    if (!requireLogin()) return;

    await fetch(`${BACKEND}/mcp/youtube/comment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        video_id: videoId,
        text: commentText,
      }),
    });

    alert("Comment added!");
    setCommentText("");
  };

  // -----------------------------
  // Subscribe
  // -----------------------------
  const subscribe = async (channelId: string) => {
    if (!requireLogin()) return;

    await fetch(`${BACKEND}/mcp/youtube/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ channel_id: channelId }),
    });

    alert("Subscribed successfully!");
  };

  // -----------------------------
  // Button Styles
  // -----------------------------
  const btn =
    "px-4 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all";

  const btnDanger =
    "px-4 py-2 rounded-md bg-red-600 text-white font-medium hover:bg-red-700 transition-all";

  const btnGreen =
    "px-4 py-2 rounded-md bg-green-600 text-white font-medium hover:bg-green-700 transition-all";

  return (
    <div className="p-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-5">🎬 YouTube MCP Agent</h1>

      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6">
        {!user ? (
          <button className={btn} onClick={login}>
            Login with Google
          </button>
        ) : (
          <div className="flex items-center gap-4">
            <img
              src={user.picture}
              className="w-10 h-10 rounded-full border"
              alt="Profile"
            />
            <span className="font-semibold">{user.name}</span>
            <button className={btnDanger} onClick={logout}>
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Search Bar */}
      <div className="flex gap-3 mb-4">
        <input
          className="w-full p-2 border rounded-md"
          placeholder="Search videos..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className={btn} onClick={searchVideos}>
          Search
        </button>
      </div>

      {loading && <p>Searching...</p>}

      {/* Results */}
      <div className="space-y-6">
        {results.map((v) => (
          <div key={v.videoId} className="p-4 border rounded-md shadow">

            {/* CLICK TO OPEN YOUTUBE VIDEO */}
            <div
              className="flex gap-4 cursor-pointer"
              onClick={() =>
                window.open(`https://www.youtube.com/watch?v=${v.videoId}`, "_blank")
              }
            >
              <img src={v.thumbnail} className="w-48 rounded" />

              <div>
                <h2 className="font-bold text-lg">{v.title}</h2>
                <p className="text-sm text-gray-600">{v.description}</p>

                <div className="flex gap-3 mt-3">
                  {/* Stop video opening when clicking buttons */}
                  <button
                    className={btn}
                    onClick={(e) => {
                      e.stopPropagation();
                      likeVideo(v.videoId);
                    }}
                  >
                    👍 Like
                  </button>

                  <button
                    className={btnGreen}
                    onClick={(e) => {
                      e.stopPropagation();
                      subscribe(v.channelId);
                    }}
                  >
                    🔔 Subscribe
                  </button>
                </div>

                {/* Comment Box */}
                <div className="mt-3 flex gap-2">
                  <input
                    className="flex-1 p-2 border rounded"
                    placeholder="Write comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                  <button
                    className={btn}
                    onClick={(e) => {
                      e.stopPropagation();
                      commentVideo(v.videoId);
                    }}
                  >
                    💬 Comment
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {results.length === 0 && !loading && (
          <p className="text-gray-500 mt-5">No results yet. Try searching.</p>
        )}
      </div>
    </div>
  );
}
