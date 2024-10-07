import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { google } from "googleapis";
import { authOptions } from "../auth/[...nextauth]/route";
import Video from "@/models/Video";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }
  console.log(req, "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
  const client = await clientPromise;
  await client.connect();
  const db = client.db("demo_nextauth");

  try {
    const { youtubeId } = await req.json();
    const youtube = google.youtube({
      version: "v3",
      auth: process.env.YOUTUBE_API_KEY,
    });

    const response = await youtube.videos.list({
      part: ["snippet", "contentDetails"],
      id: [youtubeId],
    });

    if (response.data.items && response.data.items.length > 0) {
      const videoData = response.data.items[0];
      const duration = parseDuration(videoData.contentDetails?.duration || "");

      const video = new Video({
        youtubeId,
        title: videoData.snippet?.title || "",
        description: videoData.snippet?.description || "",
        duration,
      });

      await db.collection("videos").insertOne(video);

      return new Response(JSON.stringify(video), { status: 201 });
    } else {
      return new Response(JSON.stringify({ error: "Video not found" }), {
        status: 404,
      });
    }
  } catch {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}

function parseDuration(duration: string): number {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return 0;

  const hours = parseInt(match?.[1] ?? "0") || 0;
  const minutes = parseInt(match?.[2] ?? "0") || 0;
  const seconds = parseInt(match?.[3] ?? "0") || 0;

  return hours * 3600 + minutes * 60 + seconds;
}
