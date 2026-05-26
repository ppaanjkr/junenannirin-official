import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { getBearerToken, verifyAccessToken } from "@/lib/auth/jwt";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
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

    // ใช้ userId จาก token เท่านั้น ห้ามรับจาก query/body
    const userId = String(auth.uuid).trim();

    const projectsSnap = await adminDb.collection("projects").get();

    const projects = projectsSnap.docs.map((doc) => ({
      docId: doc.id,
      ...doc.data(),
    })) as any[];

    const shopProjectIds = projects
      .filter((p) => String(p.type) === "shop")
      .map((p) => String(p.id || p.docId));

    const donationProjectIds = projects
      .filter((p) => String(p.type) === "donation")
      .map((p) => String(p.id || p.docId));

    const userRewardsSnap = await adminDb
      .collection("userrewards")
      .where("user_id", "==", userId)
      .get();

    const userRewards = userRewardsSnap.docs.map((doc) => ({
      docId: doc.id,
      ...doc.data(),
    })) as any[];

    const shopOrders = userRewards.filter((o) =>
      shopProjectIds.includes(String(o.project_id)),
    );

    const uniqueShopProjectIds = Array.from(
      new Set(
        shopOrders
          .map((o) => String(o.project_id || "").trim())
          .filter(Boolean),
      ),
    );

    const donationsSnap = await adminDb
      .collection("donations")
      .where("user_id", "==", userId)
      .get();

    const donations = donationsSnap.docs.map((doc) => ({
      docId: doc.id,
      ...doc.data(),
    })) as any[];

    const donationList = donations.filter((o) =>
      donationProjectIds.includes(String(o.project_id)),
    );

    const uniqueDonationProjectIds = Array.from(
      new Set(
        donationList
          .map((o) => String(o.project_id || "").trim())
          .filter(Boolean),
      ),
    );

    const transactionsSnap = await adminDb
      .collection("transactions")
      .where("user_id", "==", userId)
      .where("status", "==", "success")
      .get();

    const transactions = transactionsSnap.docs.map((doc) => ({
      docId: doc.id,
      ...doc.data(),
    })) as any[];

    const totalAmount = transactions.reduce(
      (sum: number, t: any) => sum + Number(t.amount || 0),
      0,
    );

    return NextResponse.json({
      success: true,
      data: {
        totalProjects:
          uniqueShopProjectIds.length + uniqueDonationProjectIds.length,
        totalOrders: shopOrders.length,
        totalAmount,
      },
    });
  } catch (err: any) {
    console.error("get profile summary error:", err);

    return NextResponse.json(
      {
        success: false,
        message: err?.message || "Get profile summary failed",
      },
      { status: 500 },
    );
  }
}