"use client";

import { likeVideo, commentVideo, subscribeChannel } from "../lib/api";

interface VideoCardProps {
  video: any;
  onActionResult?: (msg: string) => void;
}

export default function VideoCard({ video, onActionResult = () => {} }: VideoCardProps) {
  const openVideo = () => {
    if (video.videoId) window.open(`https://www.youtube.com/watch?v=${video.videoId}`, "_blank");
  };

  const doLike = async () => {
    const res = await likeVideo(video.videoId);
    onActionResult(res.status);
  };

  const doComment = async () => {
    const txt = prompt("Enter comment:");
    if (!txt) return;
    const res = await commentVideo(video.videoId, txt);
    onActionResult(res.status);
  };

  const doSubscribe = async () => {
    const ch = video.channelId;
    if (!ch) return;
    const res = await subscribeChannel(ch);
    onActionResult(res.status);
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
