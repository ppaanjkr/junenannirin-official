import { NextRequest, NextResponse } from "next/server";
import { checkUser } from "@/lib/firebase/user";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.lineUserId) {
      return NextResponse.json(
        { success: false, message: "lineUserId is required" },
        { status: 400 },
      );
    }

    const data = await checkUser(body.lineUserId);

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: "Check user failed",
      },
      {
        status: 500,
      },
    );
  }
}