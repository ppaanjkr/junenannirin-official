import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

  try {

    const body = await req.json();

    const API_URL =
      process.env.NEXT_PUBLIC_API_URL!;

    const gasRes = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "checkUser",
        lineUserId: body.lineUserId,
      }),
      cache: "no-store",
    });

    const data = await gasRes.json();

    return NextResponse.json(data);

  } catch (err) {

    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}