"use client"; // Add this

export default function VideoCard({ video }) {
  if (!video) return null;

  return (
    <div className="border rounded shadow p-2">
      <img src={video.thumbnail} alt={video.title} className="w-full rounded" />
      <h2 className="font-bold text-lg mt-2">{video.title}</h2>
      <p className="text-sm text-gray-600">{video.description}</p>
      <p className="text-xs text-gray-400 mt-1">Channel: {video.channelId}</p>
      <div className="mt-2">
        <a
          href={`https://www.youtube.com/watch?v=${video.videoId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline text-sm"
        >
          Watch Video
        </a>
      </div>
    </div>
  );
}
