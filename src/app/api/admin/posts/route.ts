import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import Post from "@/models/Post";
import clientPromise from "@/lib/mongodb";

export async function GET(request: Request) {
  const session = await getServerSession();
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = await clientPromise;
  await client.connect();

  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .populate("author", "email");

  return NextResponse.json({ posts });
}
