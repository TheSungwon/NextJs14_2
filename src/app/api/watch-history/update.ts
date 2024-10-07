import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import Video from "@/models/Video";
import { NextApiRequest, NextApiResponse } from "next";

export default async function hnadler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const client = await clientPromise;
  await client.connect();
  const db = client.db("demo_nextauth");

  if (req.method === "POST") {
    try {
      const { videoId, watchedSeconds } = req.body;

      const video = await Video.findOne({ youtubeId: videoId });
      if (!video) {
        return res.status(404).json({ error: "Video not found" });
      }

      if (watchedSeconds < 0 || watchedSeconds > video.duration) {
        return res.status(400).json({ error: "Invalid watched time" });
      }

      let watchHistory = await db.collection("watchHistory").findOne({
        user: session.user.id,
        video: video._id,
      });
      if (!watchHistory) {
        watchHistory = {
          user: session.user.id,
          video: video._id,
          watchedSeconds: 0,
          _id: new ObjectId(),
        };
      }

      if (watchHistory && watchedSeconds > watchHistory.watchedSeconds) {
        watchHistory.watchedSeconds = watchedSeconds;
        watchHistory.lastWatchedAt = new Date();
      }

      await db
        .collection("watchHistory")
        .updateOne(
          { _id: watchHistory?._id },
          { $set: { watchedSeconds, lastWatchedAt: new Date() } }
        );

      return res.status(200).json({ message: "Watched time updated" });
    } catch (error) {
      console.error("Error updating watched time", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
