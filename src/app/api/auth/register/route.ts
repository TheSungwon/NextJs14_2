import mongoose from "@/lib/mongodb"; // mongoose를 가져옵니다.
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import User from "@/models/User"; // User 모델을 임포트합니다.

export async function POST(request: Request) {
  try {
    const req = await request.json();
    console.log(req);

    const hashedPassword = bcrypt.hashSync(req.password, 10);
    console.log(hashedPassword);

    // MongoDB에 저장
    await mongoose.connection;

    const user = new User({
      name: req.name,
      email: req.email,
      password: hashedPassword,
      role: req.role || "admin", // role 필드 추가 (기본값 설정)
    });
    await user.save();

    return NextResponse.json({ success: "account create" }, { status: 200 });
  } catch (error: unknown) {
    console.error("에러: ", error); // 에러 로그 추가
    return NextResponse.json({ error }, { status: 500 });
  }
}
