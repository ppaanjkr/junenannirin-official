import { NextRequest, NextResponse } from "next/server";
import { checkUser } from "@/lib/firebase/user";
import { getBearerToken, verifyAccessToken } from "@/lib/auth/jwt";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    const token = getBearerToken(req);
    const auth = await verifyAccessToken(token);

    if (!auth?.lineUserId) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 },
      );
    }

    const data = await checkUser(auth.lineUserId);

    if (
      data.status !== "EXIST" ||
      !data.user ||
      Number(data.user.active || 0) !== 1
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found or inactive",
        },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: true,
      status: data.status,
      user: {
        uuid: data.user.uuid || "",
        lineUserId: auth.lineUserId,
        username: data.user.username || "",
        phone: data.user.phone || "",
        team: data.user.team || "",
        name: data.user.name || "",
        address: data.user.address || "",
        active: Number(data.user.active || 0),
      },
    });
  } catch (err) {
    console.error("auth me error:", err);

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