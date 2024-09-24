import clientPromise from "@/lib/mongodb";
import { MongoClient } from "mongodb";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import "react";

export const POST = async (req: Request) => {
  try {
    const session = await getServerSession();
    const { email } = await req.json();
    console.log(email, session, "123123123");
    const client = (await clientPromise) as MongoClient;
    const db = client.db("demo_nextauth");
    const user = await db
      .collection("users")
      .findOne({ email: session?.user?.email });

    if (!user) {
      return NextResponse.json(
        { error: "User doesn't exist" },
        { status: 400 }
      );
    }

    if (user && session?.user) {
      await db
        .collection("users")
        .updateOne({ email: session?.user?.email }, { $set: { email } });
    }
    return NextResponse.json({ success: "account update" }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json({ error }, { status: 500 });
  }
};
