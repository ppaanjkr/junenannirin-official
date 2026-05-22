import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

export async function GET() {
  try {
    const snap = await adminDb
      .collection("projects")
      .orderBy("created_at", "desc")
      .get();

    const projects = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({
      success: true,
      data: projects,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: err?.message || "Get project list failed",
      },
      { status: 500 },
    );
  }
}