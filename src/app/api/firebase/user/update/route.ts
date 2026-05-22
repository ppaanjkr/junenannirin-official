import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

function safePhone(phone: string) {
  return String(phone || "").replace(/\D/g, "").slice(0, 10);
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const userId = String(data.user_id || "").trim();
    const phone = safePhone(data.phone);
    const name = String(data.name || "").trim();
    const address = String(data.address || "").trim();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "user_id is required" },
        { status: 400 },
      );
    }

    if (!name) {
      return NextResponse.json(
        { success: false, message: "name is required" },
        { status: 400 },
      );
    }

    if (!phone || phone[0] !== "0" || phone.length !== 10) {
      return NextResponse.json(
        { success: false, message: "Invalid phone number" },
        { status: 400 },
      );
    }

    if (!address) {
      return NextResponse.json(
        { success: false, message: "address is required" },
        { status: 400 },
      );
    }

    const userRef = adminDb.collection("users").doc(userId);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return NextResponse.json({
        success: false,
        message: "User not found",
      });
    }

    const duplicateSnap = await adminDb
      .collection("users")
      .where("phone", "==", phone)
      .get();

    const isDuplicate = duplicateSnap.docs.some(
      (doc) => String(doc.id) !== userId && String(doc.data().uuid) !== userId,
    );

    if (isDuplicate) {
      return NextResponse.json({
        success: false,
        code: "PHONENUMBER_DUPLICATE",
        message: "Phonenumber already taken",
      });
    }

    await userRef.update({
      name,
      phone,
      address,
      updated_at: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({
      success: true,
      data: {
        user_id: userId,
        name,
        phone,
        address,
      },
    });
  } catch (err: any) {
    console.error("update user error:", err);

    return NextResponse.json(
      {
        success: false,
        message: err?.message || "Update user failed",
      },
      { status: 500 },
    );
  }
}