import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import { getBearerToken, verifyAccessToken } from "@/lib/auth/jwt";

export const dynamic = "force-dynamic";

async function requireAdmin(req: NextRequest) {
  const token = getBearerToken(req);
  const auth = await verifyAccessToken(token);

  if (!auth?.uuid || Number(auth.active || 0) !== 1 || auth.team !== "admin") {
    return null;
  }

  return auth;
}

export async function POST(req: NextRequest) {
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

    const body = await req.json();

    const participantId = body.participant_id;

    if (!participantId) {
      return NextResponse.json(
        {
          success: false,
          message: "Participant id required",
        },
        { status: 400 },
      );
    }

    await adminDb.collection("event_participants").doc(participantId).update({
      checked_in: true,
      checked_in_at: FieldValue.serverTimestamp(),
      checked_in_by: auth.uuid,
      updated_at: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({
      success: true,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: err.message || "Check-in failed",
      },
      { status: 500 },
    );
  }
}
