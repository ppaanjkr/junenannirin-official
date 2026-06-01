import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import { getBearerToken, verifyAccessToken } from "@/lib/auth/jwt";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getCurrentMaxNumber(
  collectionName: string,
  fieldName: string,
  prefix: string,
) {
  const snap = await adminDb.collection(collectionName).get();

  let max = 0;

  snap.docs.forEach((doc) => {
    const value = String(doc.data()[fieldName] || doc.id || "").trim();
    const match = value.match(new RegExp(`^${prefix}(\\d+)$`, "i"));

    if (match) {
      max = Math.max(max, Number(match[1]));
    }
  });

  return max;
}

function buildId(prefix: string, number: number, pad = 5) {
  return `${prefix}${String(number).padStart(pad, "0")}`;
}

async function generateNextId(collectionName: string, prefix: string, pad = 5) {
  const max = await getCurrentMaxNumber(collectionName, "id", prefix);
  return buildId(prefix, max + 1, pad);
}

async function generateOrderId() {
  const max = await getCurrentMaxNumber("userrewards", "order_id", "OR");
  return buildId("OR", max + 1, 5);
}

async function isDuplicateTrans(transRef?: string) {
  if (!transRef) return false;

  const snap = await adminDb
    .collection("transactions")
    .where("transRef", "==", String(transRef).trim())
    .limit(1)
    .get();

  return !snap.empty;
}

async function ensureShipment(userId: string, projectId: string) {
  const snap = await adminDb
    .collection("shipments")
    .where("user_id", "==", userId)
    .where("project_id", "==", projectId)
    .limit(1)
    .get();

  if (!snap.empty) {
    const doc = snap.docs[0];
    const data = doc.data();

    return {
      exists: true,
      shipmentId: String(data.id || doc.id),
    };
  }

  const shipmentId = await generateNextId("shipments", "S", 5);
  const now = FieldValue.serverTimestamp();

  await adminDb.collection("shipments").doc(shipmentId).set({
    id: shipmentId,
    user_id: userId,
    project_id: projectId,
    delivery_method: "",
    event: "",
    tracking_no: "",
    carrier: "",
    status: "pending",
    created_at: now,
    created_by: userId,
    updated_at: now,
    updated_by: userId,
  });

  return {
    exists: false,
    shipmentId,
  };
}

function normalizeItems(items: any[]) {
  return items.map((item) => ({
    id: item.id || item.reward_id || "",
    name: item.name || "",
    price: Number(item.price || 0),
    qty: Number(item.qty || 0),
    selections: Array.isArray(item.selections) ? item.selections : [],
  }));
}

export async function POST(req: NextRequest) {
  try {
    const token = getBearerToken(req);
    const auth = await verifyAccessToken(token);

    if (
      !auth?.uuid ||
      Number(auth.active || 0) !== 1 ||
      auth.team !== "admin"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 },
      );
    }

    const data = await req.json();

    if (!data) {
      return NextResponse.json(
        { success: false, message: "Missing data" },
        { status: 400 },
      );
    }

    if (!Array.isArray(data.items) || data.items.length === 0) {
      return NextResponse.json(
        { success: false, message: "items must be array" },
        { status: 400 },
      );
    }

    if (!data.project_id) {
      return NextResponse.json(
        { success: false, message: "Missing project_id" },
        { status: 400 },
      );
    }

    if (!data.user_id) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing user_id",
        },
        { status: 400 },
      );
    }

    if (await isDuplicateTrans(data.transRef)) {
      return NextResponse.json(
        { success: false, message: "Duplicate slip" },
        { status: 400 },
      );
    }

    const userId = String(data.user_id).trim();
    const projectId = String(data.project_id).trim();
    const amount = Number(data.amount || 0);
    const items = normalizeItems(data.items);

    const invalidItem = items.find(
      (item) => !item.id || item.qty <= 0 || item.price < 0,
    );

    if (invalidItem) {
      return NextResponse.json(
        { success: false, message: "Invalid item data" },
        { status: 400 },
      );
    }

    const projectRef = adminDb.collection("projects").doc(projectId);
    const projectSnap = await projectRef.get();

    if (!projectSnap.exists) {
      return NextResponse.json(
        { success: false, message: "Project not found" },
        { status: 404 },
      );
    }

    const projectData = projectSnap.data() || {};
    const status = String(projectData.status || "").trim();

    if (status !== "open") {
      return NextResponse.json(
        { success: false, message: "Project is not open" },
        { status: 400 },
      );
    }

    const shipmentResult = await ensureShipment(userId, projectId);
    const shipmentId = shipmentResult.shipmentId;

    const now = FieldValue.serverTimestamp();
    const batch = adminDb.batch();

    const orderId = await generateOrderId();

    const baseUserRewardNo = await getCurrentMaxNumber(
      "userrewards",
      "id",
      "UR",
    );

    const baseSelectionNo = await getCurrentMaxNumber(
      "userrewarditemselections",
      "id",
      "URS",
    );

    let selectionRunningNo = baseSelectionNo;
    let rewardCount = 0;
    let selectionCount = 0;

    for (let index = 0; index < items.length; index++) {
      const item = items[index];

      const userRewardId = buildId("UR", baseUserRewardNo + index + 1, 5);
      const totalAmount = item.price * item.qty;

      const rewardRef = adminDb.collection("userrewards").doc(userRewardId);

      batch.set(rewardRef, {
        id: userRewardId,
        order_id: orderId,
        user_id: userId,
        project_id: projectId,
        reward_id: item.id,
        qty: item.qty,
        price: item.price,
        total_amount: totalAmount,
        type: "base",
        created_at: now,
        created_by: userId,
        updated_at: now,
        status: "paid",
        shipment_id: shipmentId,
        updated_by: "",
      });

      rewardCount++;

      for (const selection of item.selections) {
        const rewardItemId = String(selection.reward_item_id || "").trim();
        const itemName = String(selection.item_name || "").trim();
        const optionName = String(selection.option_name || "").trim();
        const selectedOption = String(
          selection.selected_option || selection.selected_size || "",
        ).trim();
        const selectionQty = Number(selection.qty || 0);

        if (!rewardItemId) throw new Error("Missing reward_item_id");
        if (!itemName) throw new Error("Missing item_name");
        if (!optionName) throw new Error("Missing option_name");
        if (!selectedOption) throw new Error("Missing selected_option");
        if (selectionQty <= 0) throw new Error("Invalid selection qty");

        selectionRunningNo++;
        const selectionId = buildId("URS", selectionRunningNo, 5);

        const selectionRef = adminDb
          .collection("userrewarditemselections")
          .doc(selectionId);

        batch.set(selectionRef, {
          id: selectionId,
          user_reward_id: userRewardId,
          reward_item_id: rewardItemId,
          item_name: itemName,
          option_name: optionName,
          selected_option: selectedOption,
          qty: selectionQty,
          created_at: now,
          created_by: userId,
        });

        selectionCount++;
      }
    }

    const transactionId = await generateNextId("transactions", "TX", 5);

    batch.set(adminDb.collection("transactions").doc(transactionId), {
      id: transactionId,
      type: "shop",
      data_id: orderId,
      referenceId: data.referenceId || "",
      transRef: data.transRef || "",
      dateTime: data.dateTime || "",
      amount,
      status: "success",
      created_at: now,
      user_id: userId,
    });

    const currentAmount = Number(projectData.current_amount || 0);

    batch.update(projectRef, {
      current_amount: currentAmount + amount,
      updated_at: now,
      updated_by: userId,
    });

    await batch.commit();

    return NextResponse.json({
      success: true,
      orderId,
      shipmentId,
      count: rewardCount,
      selectionCount,
      shipmentCreated: !shipmentResult.exists,
    });
  } catch (err: any) {
    console.error("create order error:", err);

    return NextResponse.json(
      {
        success: false,
        message: "something error",
        error: err?.message || "Create order failed",
      },
      { status: 500 },
    );
  }
}
