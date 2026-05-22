import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

const allowSubStatus = ["pre-order", "process", "shipping", "completed"];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { project_id, sub_status, updated_by } = body;

    if (!project_id) {
      return NextResponse.json(
        { success: false, message: "project_id is required" },
        { status: 400 },
      );
    }

    if (!allowSubStatus.includes(sub_status)) {
      return NextResponse.json(
        { success: false, message: "Invalid sub_status" },
        { status: 400 },
      );
    }

    const projectRef = adminDb.collection("projects").doc(project_id);
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
      sub_status,
      updated_at: FieldValue.serverTimestamp(),
      updated_by: updated_by || "",
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