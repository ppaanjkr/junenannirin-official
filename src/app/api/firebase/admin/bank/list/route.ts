import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const snap = await adminDb.collection("banks").get();

    return NextResponse.json({
      success: true,
      data: snap.docs.map((doc) => ({
        id: doc.data().id || doc.id,
        docId: doc.id,
        ...doc.data(),
      })),
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: err?.message || "Get bank list failed",
      },
      { status: 500 },
    );
  }
}