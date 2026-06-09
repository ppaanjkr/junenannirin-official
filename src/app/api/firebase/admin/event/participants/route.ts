import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { getBearerToken, verifyAccessToken } from "@/lib/auth/jwt";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function requireAdmin(req: NextRequest) {
  const token = getBearerToken(req);
  const auth = await verifyAccessToken(token);

  if (!auth?.uuid || Number(auth.active || 0) !== 1 || auth.team !== "admin") {
    return null;
  }

  return auth;
}

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAdmin(req);

    if (!auth) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 },
      );
    }

    const projectId = req.nextUrl.searchParams.get("project_id");

    if (!projectId) {
      return NextResponse.json(
        {
          success: false,
          message: "Project id required",
        },
        { status: 400 },
      );
    }

    const snap = await adminDb
      .collection("event_participants")
      .where("project_id", "==", projectId)
      .orderBy("queue")
      .get();

    const participants = snap.docs.map((doc) => doc.data());

    const userIds = participants.map((x: any) => x.user_id).filter(Boolean);

    const userMap: Record<string, any> = {};

    if (userIds.length > 0) {
      const usersSnap = await adminDb
        .collection("users")
        .where("uuid", "in", userIds.slice(0, 30))
        .get();

      usersSnap.docs.forEach((doc) => {
        const user = doc.data();

        userMap[user.uuid] = user;
      });
    }

    const data = participants.map((item: any) => ({
      ...item,

      username: userMap[item.user_id]?.username || "",
      app_phone: userMap[item.user_id]?.phone || "",

      // display_name: userMap[item.user_id]?.name || "",
    }));

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: err.message || "Load failed",
      },
      { status: 500 },
    );
  }
}
