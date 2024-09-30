import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import Post from "@/models/Post";
import clientPromise from "@/lib/mongodb";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession();
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = await clientPromise;
  await client.connect();

  await Post.findByIdAndUpdate(params.id, { isDeleted: true });

  return NextResponse.json({ message: "Post deleted successfully" });
}
