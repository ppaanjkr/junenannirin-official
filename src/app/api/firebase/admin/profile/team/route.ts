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

    const enabled = Boolean(body.team_edit_enabled);

    if (enabled) {
      const systemDoc = await adminDb
        .collection("settings")
        .doc("system")
        .get();

      const profileEnabled = Boolean(systemDoc.data()?.profile_edit_enabled);

      if (!profileEnabled) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Profile editing must be enabled before team editing can be enabled.",
          },
          {
            status: 400,
          },
        );
      }
    }

    await adminDb
      .collection("settings")
      .doc("system")
      .set(
        {
          team_edit_enabled: Boolean(body.team_edit_enabled),

          updated_at: FieldValue.serverTimestamp(),

          updated_by: auth.uuid,
        },
        {
          merge: true,
        },
      );

    return NextResponse.json({
      success: true,
      message: "Team setting updated",
    });
  } catch (err: any) {
    console.error(err);

    return NextResponse.json(
      {
        success: false,
        message: err?.message || "Update team setting failed",
      },
      {
        status: 500,
      },
    );
  }
}
