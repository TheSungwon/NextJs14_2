import { useRef, useState, useEffect } from "react";
import YouTube from "react-youtube";

interface VideoPlayerProps {
  videoId: string;
  initialWatchedSeconds: number;
}

const VideoPlayer = ({ videoId, initialWatchedSeconds }: VideoPlayerProps) => {
  const playerRef = useRef<any>(null);

  const [watchedSeconds, setWatchedSeconds] = useState(initialWatchedSeconds);

  useEffect(() => {
    const interval = setInterval(() => {
      if (playerRef.current) {
        const currentTime = playerRef.current.getCurrentTime();
        if (currentTime > watchedSeconds) {
          setWatchedSeconds(currentTime);
          updateWatchHistory(currentTime);
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [videoId, watchedSeconds]);

  const updateWatchHistory = async (seconds: number) => {
    try {
      await fetch("/api/watch-history/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ videoId, watchedSeconds: Math.floor(seconds) }),
      });
    } catch (error) {
      console.error("Error updating watch history", error);
    }
  };
  const onReady = (event: any) => {
    playerRef.current = event.target;
    event.target.seekTo(watchedSeconds);
  };
  return (
    <YouTube
      videoId={videoId}
      opts={{ playerVars: { start: watchedSeconds } }}
      onReady={onReady}
    />
  );
};

export default VideoPlayer;
