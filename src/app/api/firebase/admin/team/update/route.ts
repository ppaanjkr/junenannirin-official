import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import {
  deleteFileFromDriveByUrl,
  uploadImageToDrive,
} from "@/lib/google/drive";
import { FieldValue } from "firebase-admin/firestore";
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

function generateValue(label: string) {
  return String(label || "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .trim();
}

function cleanUrl(url?: string) {
  if (!url || String(url).startsWith("blob:")) {
    return "";
  }

  return String(url).trim();
}

async function uploadFileIfExists(
  file: any,
  fileName: string,
) {
  if (!file?.base64) {
    return "";
  }

  const uploaded =
    await uploadImageToDrive({
      base64: file.base64,
      fileName,
    });

  return uploaded.url;
}

async function deleteDriveUrlIfExists(
  url?: string,
) {
  if (!url) return;

  try {
    await deleteFileFromDriveByUrl(
      url,
    );
  } catch (err) {
    console.error(
      "delete drive file failed:",
      err,
    );
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

    const team = body.team || {};

    const teamId = String(team.id || "").trim();

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

    const current = teamSnap.data() || {};

    const label = String(team.label || "").trim();

    if (!label) {
      return NextResponse.json(
        {
          success: false,
          message: "Team name is required",
        },
        {
          status: 400,
        },
      );
    }

    const value = String(current.value || "").trim();

    const nextActive = Number(team.active ?? 1);

    if (nextActive === 0) {
      const pollSnap =
        await adminDb
          .collection(
            "team_poll",
          )
          .where(
            "team",
            "==",
            current.value,
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
    }

    let imageUrl = cleanUrl(team.image_url);

    if (
      team.image_file?.base64
    ) {
      await deleteDriveUrlIfExists(team.image_delete_url);

      imageUrl = await uploadFileIfExists(team.image_file, `${teamId}_avatar.webp`);
    }

    if (
      !team.image_url && team.image_delete_url
    ) {
      await deleteDriveUrlIfExists( team.image_delete_url);
      imageUrl = "";
    }

    await teamRef.set(
      {
        label,
        value,
        image_url: imageUrl,
        show_in_register: Boolean(team.show_in_register),
        active: nextActive,
        updated_at: FieldValue.serverTimestamp(),
        updated_by: auth.uuid,
      },
      {
        merge: true,
      },
    );

    return NextResponse.json({
      success: true,
      id: teamId,
      message: "Team updated successfully",
    });
  } catch (err: any) {
    console.error( "update team error:", err);

    return NextResponse.json(
      {
        success: false,
        message: err?.message || "Update team failed",
      },
      {
        status: 500,
      },
    );
  }
}