import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

export async function GET() {
  try {
    const snap = await adminDb.collection("banks").get();

    const banks = snap.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .sort(
        (a: any, b: any) =>
          new Date(b.created_at || 0).getTime() -
          new Date(a.created_at || 0).getTime(),
      );

    return NextResponse.json({
      success: true,
      data: banks,
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