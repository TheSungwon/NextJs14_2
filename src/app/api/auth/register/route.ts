import clientPromise from "@/lib/mongodb";
import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const req = await request.json();
    const bcrypt = require("bcrypt");

    const hashedPassword = bcrypt.hashSync(req.password, 10);

    const client = (await clientPromise) as MongoClient;
    const db = client.db("demo_nextauth");
    const createUser = await db.collection("users").insertOne({
      email: req.email,
      password: hashedPassword,
      role: "admin",
    });

    console.log(createUser, "@@@@@@@@@@@");
    return NextResponse.json({ success: "account create" }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
