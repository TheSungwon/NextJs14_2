import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import clientPromise from "@/lib/mongodb";
import { authOptions } from "../../auth/[...nextauth]/route";
import { ObjectId } from "mongodb";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  console.log(params, "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = await clientPromise;
  await client.connect();
  const db = client.db("demo_nextauth");

  try {
    const video = await db
      .collection("videos")
      // .findOne({ _id: new ObjectId(params.id) });
      .findOne({ youtubeId: params.id });
    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }
    return NextResponse.json(video);
  } catch {
    return NextResponse.json(
      { error: "Error fetching video" },
      { status: 500 }
    );
  }
}
