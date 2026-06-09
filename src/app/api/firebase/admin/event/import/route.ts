import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
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

async function generateParticipantId() {
  const snap = await adminDb
    .collection("event_participants")
    .orderBy("id", "desc")
    .limit(1)
    .get();

  if (snap.empty) {
    return 1;
  }

  const lastId = snap.docs[0].data().id || "EP_000000";

  return Number(String(lastId).replace("EP_", "")) + 1;
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

    const projectId = body.project_id;

    const participants = body.participants || [];

    if (!projectId) {
      return NextResponse.json(
        {
          success: false,
          message: "Project id required",
        },
        { status: 400 },
      );
    }

    const batch = adminDb.batch();

    // delete old
    const oldSnap = await adminDb
      .collection("event_participants")
      .where("project_id", "==", projectId)
      .get();

    oldSnap.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    let runningNo = await generateParticipantId();

    for (const item of participants) {
      const participantId = `EP_${String(runningNo).padStart(6, "0")}`;

      runningNo++;

      const ref = adminDb.collection("event_participants").doc(participantId);

      batch.set(ref, {
        id: participantId,
        project_id: projectId,
        queue: Number(item.queue || 0),
        full_name: item.name || "",
        user_id: item.uuid || "",
        phone: item.phone || "",
        twitter: item.twitter || "",
        checked_in: false,
        checked_in_at: null,
        checked_in_by: "",
        created_at: FieldValue.serverTimestamp(),
        updated_at: FieldValue.serverTimestamp(),
        created_by: auth.uuid,
        updated_by: auth.uuid,
      });
    }

    await batch.commit();

    return NextResponse.json({
      success: true,
      count: participants.length,
    });
  } catch (err: any) {
    console.error(err);

    return NextResponse.json(
      {
        success: false,
        message: err.message || "Import failed",
      },
      { status: 500 },
    );
  }
}
