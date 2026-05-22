import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { project_id, updated_by } = body;

    if (!project_id) {
      return NextResponse.json(
        { success: false, message: "project_id is required" },
        { status: 400 },
      );
    }

    await adminDb.collection("projects").doc(project_id).update({
      status: "close",
      updated_at: FieldValue.serverTimestamp(),
      updated_by: updated_by || "",
    });

    return NextResponse.json({
      success: true,
      message: "Close project success",
    });
  } catch (err: any) {
    console.error("close project error:", err);

    return NextResponse.json(
      {
        success: false,
        message: err?.message || "Close project failed",
      },
      { status: 500 },
    );
  }
}