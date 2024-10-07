"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import VideoPlayer from "../../../../components/VideoPlayer";

interface Video {
  _id: string;
  youtubeId: string;
  title: string;
  description: string;
  duration: number;
}

export default function VideoDetail() {
  const [video, setVideo] = useState<Video | null>(null);
  const [watchedSeconds, setWatchedSeconds] = useState(0);
  const { data: session, status } = useSession();
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    if (status === "authenticated" && id) {
      fetchVideo();
      fetchWatchHistory();
    }
  }, [status, id]);

  const fetchVideo = async () => {
    try {
      const res = await fetch(`/api/videos/${id}`);
      if (!res.ok) {
        throw new Error("Failed to fetch video");
      }
      const data = await res.json();
      setVideo(data);
    } catch (error) {
      console.error("Error fetching video:", error);
    }
  };

  const fetchWatchHistory = async () => {
    try {
      const res = await fetch(`/api/watch-history/${id}`);
      if (!res.ok) {
        throw new Error("Failed to fetch watch history");
      }
      const data = await res.json();
      setWatchedSeconds(data.watchedSeconds);
    } catch (error) {
      console.error("Error fetching watch history:", error);
    }
  };

  if (status === "loading") return <div>Loading...</div>;
  if (!session) return <div>Please sign in to view this video</div>;
  if (!video) return <div>Loading video...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{video.title}</h1>
      <div className="mb-4">
        <VideoPlayer
          videoId={video.youtubeId}
          initialWatchedSeconds={watchedSeconds}
        />
      </div>
      <p className="text-gray-700">{video.description}</p>
    </div>
  );
}
