import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { google } from "googleapis";
import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "../auth/[...nextauth]/route";
import Video from "@/models/Video";

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user.role !== "admin") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const client = await clientPromise;
  await client.connect();
  const db = client.db("demo_nextauth");

  if (req.method === "POST") {
    try {
      const { youtubeId } = req.body;
      console.log(youtubeId);

      const youtube = google.youtube({
        version: "v3",
        auth: process.env.YOUTUBE_API_KEY,
      });

      console.log(youtube);

      const response = await youtube.videos.list({
        part: ["snippet", "contentDetails"],
        id: [youtubeId],
      });

      if (response.data.items && response.data.items.length > 0) {
        const videoData = response.data.items[0];
        const duration = parseDuration(
          videoData.contentDetails?.duration || ""
        );

        const video = new Video({
          youtubeId,
          title: videoData.snippet?.title || "",
          description: videoData.snippet?.description || "",
          duration,
        });

        await db.collection("videos").insertOne(video);

        return res.status(201).json(video);
      } else {
        return res.status(404).json({ error: "Video not found" });
      }
    } catch {
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
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
