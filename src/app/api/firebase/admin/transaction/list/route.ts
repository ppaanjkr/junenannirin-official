import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
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

function toIsoDate(value: any) {
  if (!value) return "";

  if (typeof value?.toDate === "function") {
    return value.toDate().toISOString();
  }

  if (value?._seconds) {
    return new Date(value._seconds * 1000).toISOString();
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  return value;
}

export async function GET(req: NextRequest) {
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

    const project_id = req.nextUrl.searchParams.get("project_id");

    if (!project_id) {
      return NextResponse.json(
        {
          success: false,
          message: "project_id is required",
        },
        { status: 400 },
      );
    }

    const rewardSnap = await adminDb
      .collection("userrewards")
      .where("project_id", "==", project_id)
      .get();

    const orderIds = [
      ...new Set(
        rewardSnap.docs.map((doc) => doc.data().order_id).filter(Boolean),
      ),
    ];

    if (orderIds.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
      });
    }

    const transactions: any[] = [];

    // Firestore IN limit = 10
    for (let i = 0; i < orderIds.length; i += 10) {
      const chunk = orderIds.slice(i, i + 10);

      const txSnap = await adminDb
        .collection("transactions")
        .where("data_id", "in", chunk)
        .get();

      txSnap.docs.forEach((doc) => {
        const tx = doc.data();

        transactions.push({
          id: tx.id || doc.id,
          data_id: tx.data_id || "",
          user_id: tx.user_id || "",
          project_id,
          amount: Number(tx.amount || 0),
          status: tx.status || "",
          type: tx.type || "",
          reference_id: tx.reference_id || "",
          trans_ref: tx.transRef || "",
          created_at: toIsoDate(tx.created_at),
          updated_at: toIsoDate(tx.updated_at),
        });
      });
    }

    transactions.sort(
      (a, b) =>
        new Date(b.created_at || 0).getTime() -
        new Date(a.created_at || 0).getTime(),
    );

    const userIds = [
      ...new Set(transactions.map((x) => x.user_id).filter(Boolean)),
    ];

    const userMap = new Map();

    for (let i = 0; i < userIds.length; i += 10) {
      const chunk = userIds.slice(i, i + 10);

      const userSnap = await adminDb
        .collection("users")
        .where("uuid", "in", chunk)
        .get();

      userSnap.docs.forEach((doc) => {
        const u = doc.data();

        userMap.set(u.uuid, {
          username: u.username || "",
          name: u.name || "",
        });
      });
    }

    const result = transactions.map((tx) => {
      const owner = userMap.get(tx.user_id) || {};

      return {
        ...tx,
        username: owner.username || "",
        name: owner.name || "",
      };
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (err: any) {
    console.error("admin transaction list error:", err);

    return NextResponse.json(
      {
        success: false,
        message: err?.message || "Get transactions failed",
      },
      { status: 500 },
    );
  }
}
