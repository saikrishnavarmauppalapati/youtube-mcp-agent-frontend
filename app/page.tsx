"use client";

import { useState, useEffect } from "react";
import {
  getLoginUrl,
  getUserInfo,
  logoutUser,
  fetchVideos,
  likeVideo,
  commentVideo,
  subscribeChannel,
} from "../lib/api";

export default function HomePage() {
  const [user, setUser] = useState<any>(null);
  const [query, setQuery] = useState("");
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // ---------------------------
  // Load user on page open
  // ---------------------------
  useEffect(() => {
    (async () => {
      const data = await getUserInfo();
      if (!data.error) setUser(data);
    })();
  }, []);

  // ---------------------------
  // LOGIN
  // ---------------------------
  async function handleLogin() {
    const res = await getLoginUrl();
    if (res.auth_url) {
      window.location.href = res.auth_url;
    } else {
      alert("Failed to load login URL");
    }
  }

  // ---------------------------
  // LOGOUT
  // ---------------------------
  async function handleLogout() {
    await logoutUser();
    setUser(null);
    alert("Logged out");
  }

  // ---------------------------
  // SEARCH VIDEOS
  // ---------------------------
  async function handleSearch() {
    if (!query.trim()) return alert("Enter search term");

    setLoading(true);
    const res = await fetchVideos(query);
    setVideos(res.results || []);
    setLoading(false);
  }

  // ---------------------------
  // LIKE
  // ---------------------------
  async function handleLike(videoId: string) {
    if (!user) return alert("Login required");

    const res = await likeVideo(videoId);
    alert("Video liked!");
  }

  // ---------------------------
  // COMMENT
  // ---------------------------
  async function handleComment(videoId: string) {
    if (!user) return alert("Login required");

    const text = prompt("Enter your comment:");
    if (!text) return;

    const res = await commentVideo(videoId, text);
    alert("Comment posted!");
  }

  // ---------------------------
  // SUBSCRIBE
  // ---------------------------
  async function handleSubscribe(channelId: string) {
    if (!user) return alert("Login required");

    const res = await subscribeChannel(channelId);
    alert("Subscribed!");
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">

      {/* ------------------ HEADER ------------------ */}
      <div className="flex justify-between items-center mb-6">

        <h1 className="text-2xl font-bold">YouTube MCP Agent</h1>

        {/* User logged in */}
        {user ? (
          <div className="flex items-center gap-4">
            <img
              src={user.picture}
              alt="profile"
              className="w-10 h-10 rounded-full border"
            />
            <span className="font-semibold">{user.name}</span>

            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition"
            >
              Logout
            </button>
          </div>
        ) : (
          /* User NOT logged in */
          <button
            onClick={handleLogin}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition"
          >
            Login with Google
          </button>
        )}

      </div>

      {/* ------------------ SEARCH SECTION ------------------ */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Search videos..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 border p-2 rounded"
        />

        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded transition"
        >
          Search
        </button>
      </div>

      {/* ------------------ RESULTS ------------------ */}
      {loading && <p>Loading...</p>}

      {!loading && videos.length === 0 && (
        <p className="opacity-60">No videos found yet. Try searching!</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {videos.map((v) => (
          <div key={v.videoId} className="border p-4 rounded shadow">

            {/* CLICKABLE VIDEO THUMBNAIL */}
            <a
              href={`https://www.youtube.com/watch?v=${v.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:opacity-80 transition"
            >
              <img src={v.thumbnail} className="w-full rounded mb-2 cursor-pointer" />
            </a>

            <a
              href={`https://www.youtube.com/watch?v=${v.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <h2 className="font-bold text-lg hover:underline cursor-pointer mb-2">
                {v.title}
              </h2>
            </a>

            <p className="text-sm opacity-70 mb-3">{v.description}</p>

            {/* BUTTONS */}
            <div className="flex gap-2">
              <button
                onClick={() => handleLike(v.videoId)}
                className="px-3 py-1 bg-pink-500 hover:bg-pink-600 text-white rounded transition"
              >
                Like
              </button>

              <button
                onClick={() => handleComment(v.videoId)}
                className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded transition"
              >
                Comment
              </button>

              <button
                onClick={() => handleSubscribe(v.channelId)}
                className="px-3 py-1 bg-purple-500 hover:bg-purple-600 text-white rounded transition"
              >
                Subscribe
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
