import { NextResponse } from "next/server";
import "react";

export const POST = async (req: Request) => {
  try {
    console.log(await req.json());
    return NextResponse.json({ success: "account create" }, { status: 200 });
  } catch {}
};
