import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const bankId = body.bank_id;

    if (!bankId) {
      return NextResponse.json(
        {
          success: false,
          message: "bank_id is required",
        },
        { status: 400 },
      );
    }

    const projectSnap = await adminDb
      .collection("projects")
      .where("bank_id", "==", String(bankId))
      .limit(1)
      .get();

    if (!projectSnap.empty) {
      return NextResponse.json({
        success: false,
        message: "Cannot delete this bank because it is linked to a project",
      });
    }

    await adminDb.collection("banks").doc(String(bankId)).delete();

    return NextResponse.json({
      success: true,
      message: "Bank deleted successfully",
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: err?.message || "Delete bank failed",
      },
      { status: 500 },
    );
  }
}