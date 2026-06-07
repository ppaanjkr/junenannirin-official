import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import { getBearerToken, verifyAccessToken } from "@/lib/auth/jwt";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function safePhone(phone: string) {
  return String(phone || "")
    .replace(/\D/g, "")
    .slice(0, 10);
}

export async function POST(req: NextRequest) {
  try {
    const token = getBearerToken(req);
    const auth = await verifyAccessToken(token);

    if (!auth?.uuid || Number(auth.active || 0) !== 1) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 },
      );
    }

    const systemSnap = await adminDb.collection("settings").doc("system").get();

    const settings = systemSnap.data() || {};

    const profileEditEnabled = Boolean(settings.profile_edit_enabled);
    const teamEditEnabled = Boolean(settings.team_edit_enabled);

    const data = await req.json();
    const team = String(data.team || "").trim();

    // ใช้ userId จาก token เท่านั้น ห้ามเชื่อ body.user_id
    const userId = String(auth.uuid || "").trim();

    const phone = safePhone(data.phone);
    const name = String(data.name || "").trim();
    const address = String(data.address || "").trim();

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

    if (!team) {
      return NextResponse.json(
        { success: false, message: "Team is required" },
        { status: 400 },
      );
    }

    const teamSnap = await adminDb
      .collection("teams")
      .where("value", "==", team)
      .where("active", "==", 1)
      .limit(1)
      .get();

    if (teamSnap.empty) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid team",
        },
        {
          status: 400,
        },
      );
    }

    const userRef = adminDb.collection("users").doc(userId);
    const userSnap = await userRef.get();

    const currentUser = userSnap.data() || {};

    const currentTeam = String(currentUser.team || "").trim();

    if (!userSnap.exists) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 },
      );
    }

    const duplicateSnap = await adminDb
      .collection("users")
      .where("phone", "==", phone)
      .get();

    const isDuplicate = duplicateSnap.docs.some((doc) => {
      const docId = String(doc.id);
      const docUuid = String(doc.data().uuid || "");

      return docId !== userId && docUuid !== userId;
    });

    if (isDuplicate) {
      return NextResponse.json(
        {
          success: false,
          code: "PHONENUMBER_DUPLICATE",
          message: "Phonenumber already taken",
        },
        { status: 409 },
      );
    }

    if (currentTeam !== team && !teamEditEnabled) {
      return NextResponse.json(
        {
          success: false,
          message: "Team editing is disabled",
        },
        {
          status: 403,
        },
      );
    }

    await userRef.update({
      name,
      phone,
      address,
      team,
      updated_at: FieldValue.serverTimestamp(),
    });

    if (currentTeam && currentTeam !== team) {
      const reduceTeam = await adminDb
        .collection("team_poll")
        .doc(currentTeam)
        .set(
          {
            count: FieldValue.increment(-1),
            active_count: FieldValue.increment(-1),
            updated_at: new Date().toISOString(),
          },
          {
            merge: true,
          },
        );
      const addTeam = await adminDb
        .collection("team_poll")
        .doc(team)
        .set(
          {
            count: FieldValue.increment(1),
            active_count: FieldValue.increment(1),
            updated_at: new Date().toISOString(),
          },
          {
            merge: true,
          },
        );
    }

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
