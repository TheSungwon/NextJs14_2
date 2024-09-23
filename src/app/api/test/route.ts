import clientPromise from "../../../lib/mongodb";

import { NextResponse } from "next/server";

export async function GET(request: Request) {
  console.log(request);
  // GET 요청 처리
  const client = await clientPromise;
  const db = client.db("your_database_name");
  console.log(db);
  return NextResponse.json({
    message: "GET request handled",
    data: "dddddddd",
  });
}

export async function POST(request: Request) {
  // POST 요청 처리
  const body = await request.json();
  return NextResponse.json({ message: "POST request handled", data: body });
}

export async function PUT(request: Request) {
  console.log(request);
  // PUT 요청 처리
  return NextResponse.json({ message: "PUT request handled" });
}
