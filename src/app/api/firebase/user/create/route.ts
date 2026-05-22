import { NextRequest, NextResponse } from "next/server";
import { createUser } from "@/lib/firebase/user";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const data = await createUser(body);

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        status: "ERROR",
        message: err?.message || "Create user failed",
      },
      { status: 500 },
    );
  }
}