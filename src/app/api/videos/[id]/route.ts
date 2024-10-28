import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import mongoose from "@/lib/mongodb";
import Video from "@/models/Video";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  console.log(params, "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");

  // GET 요청 처리

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await mongoose.connection;

  try {
    const video = await Video
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
