import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const shipments = body.shipments;

    if (!Array.isArray(shipments)) {
      return NextResponse.json({
        success: false,
        message: "shipments must be array",
      });
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
      };

      if (Object.prototype.hasOwnProperty.call(item, "tracking_no")) {
        updateData.tracking_no = item.tracking_no || "";
      }

      if (Object.prototype.hasOwnProperty.call(item, "carrier")) {
        updateData.carrier = item.carrier || "";
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
    return NextResponse.json(
      {
        success: false,
        message: err?.message || "Update shipments failed",
      },
      { status: 500 },
    );
  }
}