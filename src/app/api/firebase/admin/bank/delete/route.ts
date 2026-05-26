import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
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
    const bankId = String(body.bank_id || "").trim();

    if (!bankId) {
      return NextResponse.json(
        {
          success: false,
          message: "bank_id is required",
        },
        { status: 400 },
      );
    }

    const bankRef = adminDb.collection("banks").doc(bankId);
    const bankSnap = await bankRef.get();

    if (!bankSnap.exists) {
      return NextResponse.json(
        {
          success: false,
          message: "Bank not found",
        },
        { status: 404 },
      );
    }

    const projectSnap = await adminDb
      .collection("projects")
      .where("bank_id", "==", bankId)
      .limit(1)
      .get();

    if (!projectSnap.empty) {
      return NextResponse.json(
        {
          success: false,
          message: "Cannot delete this bank because it is linked to a project",
        },
        { status: 400 },
      );
    }

    await bankRef.delete();

    return NextResponse.json({
      success: true,
      message: "Bank deleted successfully",
    });
  } catch (err: any) {
    console.error("delete bank error:", err);

    return NextResponse.json(
      {
        success: false,
        message: err?.message || "Delete bank failed",
      },
      { status: 500 },
    );
  }
}