import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import clientPromise from "@/lib/mongodb";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  const client = await clientPromise;
  const db = client.db("demo_nextauth");

  const skip = (page - 1) * limit;
  const posts = await db
    .collection("posts")
    .find({ isDeleted: false })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .toArray();

  const total = await db
    .collection("posts")
    .countDocuments({ isDeleted: false });

  return NextResponse.json({
    posts,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, content, fileUrl } = await request.json();

  const client = await clientPromise;
  const db = client.db("demo_nextauth");
  console.log(session.user, "@@@@@@@@@@@@@@@@@@");
  const post = {
    title,
    content,
    author: {
      id: session.user.id,
      email: session.user.email,
    },
    fileUrl,
    createdAt: new Date(),
    updatedAt: new Date(),
    isDeleted: false,
  };

  const result = await db.collection("posts").insertOne(post);

  return NextResponse.json({
    message: "Post created successfully",
    post: { ...post, _id: result.insertedId },
  });
}
