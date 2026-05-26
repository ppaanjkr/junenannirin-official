import { NextRequest, NextResponse } from "next/server";
import { createUser } from "@/lib/firebase/user";
import { signAccessToken } from "@/lib/auth/jwt";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const data = await createUser(body);

    if (data.status !== "CREATED" || !data.user) {
      return NextResponse.json(data);
    }

    const accessToken = await signAccessToken({
      uuid: data.user.uuid || "",
      lineUserId: data.user.lineUserId || body.lineUserId || "",
      username: data.user.username || "",
      team: data.user.team || "",
      active: Number(data.user.active || 0),
    });

    return NextResponse.json({
      ...data,
      accessToken,
    });
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