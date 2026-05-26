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
    const shipments = body.shipments;

    if (!Array.isArray(shipments)) {
      return NextResponse.json(
        {
          success: false,
          message: "shipments must be array",
        },
        { status: 400 },
      );
    }

    const batch = adminDb.batch();
    let updatedCount = 0;

    for (const item of shipments) {
      const shipmentId = String(item.shipment_id || "").trim();

      if (!shipmentId) continue;

      const shipmentRef = adminDb.collection("shipments").doc(shipmentId);
      const shipmentSnap = await shipmentRef.get();

      if (!shipmentSnap.exists) continue;

      const updateData: any = {
        updated_at: FieldValue.serverTimestamp(),
        updated_by: auth.uuid,
      };

      if (Object.prototype.hasOwnProperty.call(item, "tracking_no")) {
        updateData.tracking_no = String(item.tracking_no || "").trim();
      }

      if (Object.prototype.hasOwnProperty.call(item, "carrier")) {
        updateData.carrier = String(item.carrier || "").trim();
      }

      if (Object.prototype.hasOwnProperty.call(item, "status")) {
        updateData.status = String(item.status || "").trim();
      }

      batch.update(shipmentRef, updateData);
      updatedCount++;
    }

    if (updatedCount > 0) {
      await batch.commit();
    }

    return NextResponse.json({
      success: true,
      updated: updatedCount,
    });
  } catch (err: any) {
    console.error("update shipments error:", err);

    return NextResponse.json(
      {
        success: false,
        message: err?.message || "Update shipments failed",
      },
      { status: 500 },
    );
  }
}