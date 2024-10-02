import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import clientPromise from "@/lib/mongodb";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = await clientPromise;
  await client.connect();
  const db = client.db("demo_nextauth");
  const posts = await db
    .collection("posts")
    .find({})
    .sort({ createdAt: -1 })
    .toArray();
  // const posts = await Post.find()
  //   .sort({ createdAt: -1 })
  // .populate("author", "email");
  console.log(posts, "@@@@@");
  return NextResponse.json({ posts });
}
