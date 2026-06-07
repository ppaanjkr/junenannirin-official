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

async function requireAdmin(req: NextRequest) {
  const token = getBearerToken(req);
  const auth = await verifyAccessToken(token);

  if (!auth?.uuid || Number(auth.active || 0) !== 1 || auth.team !== "admin") {
    return null;
  }

  return auth;
}

const shouldCountTeam = (team: string) => {
  const value = String(team || "")
    .trim()
    .toLowerCase();

  return value && value !== "admin" && value !== "june";
};

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

    const user = await req.json();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "user is required",
        },
        { status: 400 },
      );
    }

    const uuid = String(user.uuid || "").trim();
    const name = String(user.name || "").trim();
    const phone = safePhone(user.phone);
    const address = String(user.address || "").trim();
    const team = String(user.team || "").trim();

    if (!uuid) {
      return NextResponse.json(
        {
          success: false,
          message: "uuid is required",
        },
        { status: 400 },
      );
    }

    if (phone && (phone[0] !== "0" || phone.length !== 10)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid phone number",
        },
        { status: 400 },
      );
    }

    const userRef = adminDb.collection("users").doc(uuid);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return NextResponse.json(
        {
          success: false,
          message: "Member not found",
        },
        { status: 404 },
      );
    }

    if (phone) {
      const duplicateSnap = await adminDb
        .collection("users")
        .where("phone", "==", phone)
        .get();

      const duplicate = duplicateSnap.docs.some((doc) => {
        const docId = String(doc.id);
        const docUuid = String(doc.data().uuid || "");

        return docId !== uuid && docUuid !== uuid;
      });

      if (duplicate) {
        return NextResponse.json(
          {
            success: false,
            code: "PHONENUMBER_DUPLICATE",
            message: "Phonenumber already taken",
          },
          { status: 409 },
        );
      }
    }

    const oldUser = userSnap.data() || {};

    const oldTeam = String(oldUser.team || "").trim();
    const newTeam = String(team || "").trim();

    const oldActive = Number(oldUser.active ?? 0);
    const newActive = user.active ? 1 : 0;

    const shouldCountTeam = (teamName: string) => {
      const value = String(teamName || "")
        .trim()
        .toLowerCase();

      return value !== "" && value !== "admin" && value !== "june";
    };

    const oldIncluded = shouldCountTeam(oldTeam);
    const newIncluded = shouldCountTeam(newTeam);

    await userRef.update({
      name,
      phone,
      address,
      team,
      active: user.active ? 1 : 0,
      updated_at: FieldValue.serverTimestamp(),
      updated_by: auth.uuid,
    });

    try {
      if (oldTeam !== newTeam) {
        // ออกจากทีมที่ถูกนับ
        if (oldIncluded) {
          await adminDb
            .collection("team_poll")
            .doc(oldTeam)
            .set(
              {
                count: FieldValue.increment(-1),
                active_count:
                  oldActive === 1
                    ? FieldValue.increment(-1)
                    : FieldValue.increment(0),
                updated_at: new Date().toISOString(),
              },
              { merge: true },
            );
        }

        // เข้าไปทีมที่ถูกนับ
        if (newIncluded) {
          await adminDb
            .collection("team_poll")
            .doc(newTeam)
            .set(
              {
                team: newTeam,
                count: FieldValue.increment(1),
                active_count:
                  newActive === 1
                    ? FieldValue.increment(1)
                    : FieldValue.increment(0),
                updated_at: new Date().toISOString(),
              },
              { merge: true },
            );
        }
      }

      // active เปลี่ยน แต่ยังอยู่ทีมเดิม
      else if (oldIncluded && oldActive !== newActive) {
        await adminDb
          .collection("team_poll")
          .doc(newTeam)
          .set(
            {
              active_count: FieldValue.increment(newActive === 1 ? 1 : -1),
              updated_at: new Date().toISOString(),
            },
            { merge: true },
          );
      }
    } catch (err) {
      console.error("team_poll update failed", err);
    }

    return NextResponse.json({
      success: true,
      message: "Member updated",
    });
  } catch (err: any) {
    console.error("update admin user error:", err);

    return NextResponse.json(
      {
        success: false,
        message: err?.message || "Update member failed",
      },
      { status: 500 },
    );
  }
}
