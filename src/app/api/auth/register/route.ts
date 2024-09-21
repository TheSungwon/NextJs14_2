import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const req = await request.json();
    console.log(req, "@@@@@@");
    const bcrypt = require("bcrypt");

    const hashedPassword = bcrypt.hashSync(req.password, 10);
    console.log(hashedPassword);

    const client = await clientPromise;
    const db = client.db("demo_nextauth");
    console.log(db);
    const createUser = await db.collection("users").insertOne({
      email: req.email,
      password: hashedPassword,
    });

    return NextResponse.json({ success: "account create" }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
