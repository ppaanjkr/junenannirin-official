import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

function safePhone(phone: string) {
  return String(phone || "").replace(/\D/g, "").slice(0, 10);
}

export async function POST(req: NextRequest) {
  try {
    const user = await req.json();

    if (!user) {
      return NextResponse.json({
        success: false,
        message: "user is required",
      });
    }

    if (!user.uuid) {
      return NextResponse.json({
        success: false,
        message: "uuid is required",
      });
    }

    const uuid = String(user.uuid);
    const phone = safePhone(user.phone);

    const userRef = adminDb.collection("users").doc(uuid);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return NextResponse.json({
        success: false,
        message: "Member not found",
      });
    }

    await userRef.update({
      name: user.name || "",
      phone,
      address: user.address || "",
      team: user.team || "",
      active: user.active ? 1 : 0,
      updated_at: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({
      success: true,
      message: "Member updated",
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: err?.message || "Update member failed",
      },
      { status: 500 },
    );
  }
}