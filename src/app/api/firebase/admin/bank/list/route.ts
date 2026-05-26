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

export async function GET(req: NextRequest) {
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

    const snap = await adminDb.collection("banks").get();

    const banks = snap.docs
      .map((doc) => ({
        id: doc.data().id || doc.id,
        docId: doc.id,
        ...doc.data(),
      }))
      .sort((a: any, b: any) => {
        const aId = String(a.id || "");
        const bId = String(b.id || "");

        return aId.localeCompare(bId, undefined, {
          numeric: true,
          sensitivity: "base",
        });
      });

    return NextResponse.json({
      success: true,
      data: banks,
    });
  } catch (err: any) {
    console.error("get bank list error:", err);

    return NextResponse.json(
      {
        success: false,
        message: err?.message || "Get bank list failed",
      },
      { status: 500 },
    );
  }
}