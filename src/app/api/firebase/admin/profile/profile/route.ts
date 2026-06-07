import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
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

export async function PUT(req: NextRequest) {
  try {
    const auth = await requireAdmin(req);

    if (!auth) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const body = await req.json();

    const profileEnabled = Boolean(body.profile_edit_enabled);

    const updateData: any = {
      profile_edit_enabled: profileEnabled,

      updated_at: FieldValue.serverTimestamp(),

      updated_by: auth.uuid,
    };

    if (!profileEnabled) {
      updateData.team_edit_enabled = false;
    }

    await adminDb.collection("settings").doc("system").set(updateData, {
      merge: true,
    });

    return NextResponse.json({
      success: true,
      message: "Profile setting updated",
    });
  } catch (err: any) {
    console.error(err);

    return NextResponse.json(
      {
        success: false,
        message: err?.message || "Update profile setting failed",
      },
      {
        status: 500,
      },
    );
  }
}
