import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("user_id");

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "user_id is required" },
        { status: 400 },
      );
    }

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
      .where("user_id", "==", String(userId))
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
      .where("user_id", "==", String(userId))
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
      .where("user_id", "==", String(userId))
      .where("status", "==", "success")
      .get();

    const transactions = transactionsSnap.docs.map((doc) => doc.data());

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
