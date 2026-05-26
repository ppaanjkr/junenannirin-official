import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import { getBearerToken, verifyAccessToken } from "@/lib/auth/jwt";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const allowSubStatus = ["pre-order", "process", "shipping", "completed"];

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

    const projectId = String(body.project_id || "").trim();
    const subStatus = String(body.sub_status || "").trim();

    if (!projectId) {
      return NextResponse.json(
        { success: false, message: "project_id is required" },
        { status: 400 },
      );
    }

    if (!allowSubStatus.includes(subStatus)) {
      return NextResponse.json(
        { success: false, message: "Invalid sub_status" },
        { status: 400 },
      );
    }

    const projectRef = adminDb.collection("projects").doc(projectId);
    const projectDoc = await projectRef.get();

    if (!projectDoc.exists) {
      return NextResponse.json(
        { success: false, message: "Project not found" },
        { status: 404 },
      );
    }

    const project = projectDoc.data();

    if (project?.type !== "shop") {
      return NextResponse.json(
        { success: false, message: "Sub status is only for shop project" },
        { status: 400 },
      );
    }

    await projectRef.update({
      sub_status: subStatus,
      updated_at: FieldValue.serverTimestamp(),
      updated_by: auth.uuid,
    });

    return NextResponse.json({
      success: true,
      message: "Update sub status success",
    });
  } catch (err: any) {
    console.error("update sub status error:", err);

    return NextResponse.json(
      {
        success: false,
        message: err?.message || "Update sub status failed",
      },
      { status: 500 },
    );
  }
}