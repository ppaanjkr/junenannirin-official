import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { getBearerToken, verifyAccessToken } from "@/lib/auth/jwt";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const token = getBearerToken(req);
    const auth = await verifyAccessToken(token);

    if (!auth?.uuid) {
      return NextResponse.json({
        success: true,
        has_permission: false,
      });
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
      .where("user_id", "==", auth.uuid)
      .limit(1)
      .get();

    if (snap.empty) {
      return NextResponse.json({
        success: true,
        has_permission: false,
      });
    }

    const participant = snap.docs[0].data();

    return NextResponse.json({
      success: true,
      has_permission: true,
      participant,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: err.message || "Load queue failed",
      },
      { status: 500 },
    );
  }
}
