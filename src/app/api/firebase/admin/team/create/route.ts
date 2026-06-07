import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import { uploadImageToDrive } from "@/lib/google/drive";
import { getBearerToken, verifyAccessToken } from "@/lib/auth/jwt";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function requireAdmin(req: NextRequest) {
  const token = getBearerToken(req);

  const auth = await verifyAccessToken(token);

  if (
    !auth?.uuid ||
    Number(auth.active || 0) !== 1 ||
    auth.team !== "admin"
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

async function generateTeamId() {
  const snap = await adminDb
    .collection("teams")
    .orderBy("id", "desc")
    .limit(1)
    .get();

  if (snap.empty) {
    return "TEAM00001";
  }

  const lastId = String(snap.docs[0].data().id || "");

  const lastNo = Number(lastId.replace("TEAM", "")) || 0;

  return `TEAM${String(lastNo + 1).padStart(5, "0")}`;
}

async function uploadFileIfExists(
  file: any,
  fileName: string,
) {
  if (!file?.base64) return "";

  const uploaded =
    await uploadImageToDrive({
      base64: file.base64,
      fileName,
    });

  return uploaded.url;
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

    const value = generateValue(label);

    if (!value) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid team name",
        },
        {
          status: 400,
        },
      );
    }

    const duplicateSnap =
      await adminDb
        .collection("teams")
        .where(
          "value",
          "==",
          value,
        )
        .limit(1)
        .get();

    if (!duplicateSnap.empty) {
      return NextResponse.json(
        {
          success: false,
          message: "Team already exists",
        },
        {
          status: 409,
        },
      );
    }

    const teamId = await generateTeamId();

    let imageUrl = "";

    if (
      team.image_file?.base64
    ) {
      imageUrl = await uploadFileIfExists(team.image_file,`${teamId}_avatar.webp`);
    }

    const now = FieldValue.serverTimestamp();

    await adminDb
      .collection("teams")
      .doc(teamId)
      .set({
        id: teamId,
        value,
        label,
        image_url: imageUrl,
        show_in_register: Boolean(team.show_in_register),
        active: Number(team.active ?? 1),
        created_at: now,
        created_by: auth.uuid,
        updated_at: now,
        updated_by: auth.uuid,
      });

    return NextResponse.json({
      success: true,
      id: teamId,
      message: "Team created successfully",
    });
  } catch (err: any) {
    console.error("create team error:", err);

    return NextResponse.json(
      {
        success: false,
        message: err?.message || "Create team failed",
      },
      {
        status: 500,
      },
    );
  }
}