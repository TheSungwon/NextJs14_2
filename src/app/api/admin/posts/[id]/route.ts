import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import clientPromise from "@/lib/mongodb";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ObjectId } from "mongodb";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = await clientPromise;
  await client.connect();
  const db = client.db("demo_nextauth");

  await db
    .collection("posts")
    .updateOne({ _id: new ObjectId(params.id) }, { $set: { isDeleted: true } });
  // await Post.findByIdAndUpdate(params.id, { isDeleted: true });

  return NextResponse.json({ message: "Post deleted successfully" });
}
