import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const filename = `${Date.now()}-${file.name}`;
  const filepath = path.join(process.cwd(), "public", "uploads", filename);

  await writeFile(filepath, buffer);

  return NextResponse.json({ fileUrl: `/uploads/${filename}` });
}
