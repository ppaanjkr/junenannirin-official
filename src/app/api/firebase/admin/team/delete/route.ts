import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { deleteFileFromDriveByUrl } from "@/lib/google/drive";
import { getBearerToken, verifyAccessToken } from "@/lib/auth/jwt";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function requireAdmin(req: NextRequest) {
  const token = getBearerToken(req);

  const auth = await verifyAccessToken(token);

  if (
    !auth?.uuid || Number(auth.active || 0) !== 1 || auth.team !== "admin"
  ) {
    return null;
  }

  return auth;
}

async function deleteDriveUrlIfExists(
  url?: string,
) {
  if (!url) return;

  try {
    await deleteFileFromDriveByUrl(url);
  } catch (err) {
    console.error("delete drive file failed:", err);
  }
}

export async function POST(
  req: NextRequest,
) {
  try {
    const auth =
      await requireAdmin(req);

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

    const teamId = String(body.team_id || "").trim();

    if (!teamId) {
      return NextResponse.json(
        {
          success: false,
          message: "Team id is required",
        },
        {
          status: 400,
        },
      );
    }

    const teamRef =
      adminDb
        .collection("teams")
        .doc(teamId);

    const teamSnap = await teamRef.get();

    if (!teamSnap.exists) {
      return NextResponse.json(
        {
          success: false,
          message: "Team not found",
        },
        {
          status: 404,
        },
      );
    }

    const team = teamSnap.data() || {};

    const teamValue = String(team.value || "").trim();

    const pollSnap =
      await adminDb
        .collection("team_poll")
        .where(
          "team",
          "==",
          teamValue,
        )
        .limit(1)
        .get();

    const memberCount =
      pollSnap.empty
        ? 0
        : Number(
            pollSnap.docs[0].data()
              ?.count || 0,
          );

    if (memberCount > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "This team still has members",
        },
        {
          status: 400,
        },
      );
    }

    await deleteDriveUrlIfExists(team.image_url);

    await teamRef.delete();

    return NextResponse.json({
      success: true,
      message: "Team deleted successfully",
    });
  } catch (err: any) {
    console.error("delete team error:", err);

    return NextResponse.json(
      {
        success: false,
        message: err?.message || "Delete team failed"
      },
      {
        status: 500,
      },
    );
  }
}