"use client";

import React from "react";
import { likeVideo, commentVideo, subscribeChannel } from "../lib/api";

export default function VideoCard({ video, onActionResult }) {
  const openVideo = () => {
    if (video.videoId) {
      window.open(`https://www.youtube.com/watch?v=${video.videoId}`, "_blank");
    }
  };

  const doLike = async () => {
    const res = await likeVideo(video.videoId);
    onActionResult(res?.status ? "Like done" : JSON.stringify(res));
  };

  const doComment = async () => {
    const txt = prompt("Enter comment:");
    if (!txt) return;
    const res = await commentVideo(video.videoId, txt);
    onActionResult(res?.status ? "Comment posted" : JSON.stringify(res));
  };

  const doSubscribe = async () => {
    const ch = video.channelId || prompt("Enter channelId:");
    if (!ch) return;
    const res = await subscribeChannel(ch);
    onActionResult(res?.status ? "Subscribed" : JSON.stringify(res));
  };

  return (
    <div style={{ border: "1px solid #e6e6e6", borderRadius: 8, padding: 12 }}>
      <div onClick={openVideo} style={{ cursor: "pointer" }}>
        <img src={video.thumbnail} alt={video.title} width="100%" style={{ borderRadius: 6 }} />
        <h4 style={{ margin: "8px 0" }}>{video.title}</h4>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={doLike}>👍</button>
        <button onClick={doComment}>💬</button>
        <button onClick={doSubscribe}>🔔</button>
      </div>
    </div>
  );
}
