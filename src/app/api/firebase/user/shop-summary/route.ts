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

    const projectId = req.nextUrl.searchParams.get("project_id");
    const userId = String(auth.uuid).trim();

    if (!projectId) {
      return NextResponse.json(
        {
          success: false,
          message: "project_id is required",
        },
        { status: 400 },
      );
    }

    const projectSnap = await adminDb
      .collection("projects")
      .doc(String(projectId))
      .get();

    const project = projectSnap.exists ? projectSnap.data() : null;

    const userRewardsSnap = await adminDb
      .collection("userrewards")
      .where("project_id", "==", String(projectId))
      .where("user_id", "==", String(userId))
      .get();

    const userItems = userRewardsSnap.docs.map((doc) => ({
      docId: doc.id,
      ...doc.data(),
    })) as any[];

    const userRewardIds = userItems.map((i) => String(i.id || i.docId));

    let userSelections: any[] = [];

    if (userRewardIds.length > 0) {
      const selectionsSnap = await adminDb
        .collection("userrewarditemselections")
        .get();

      userSelections = selectionsSnap.docs
        .map((doc) => ({
          docId: doc.id,
          ...doc.data(),
        }))
        .filter((s: any) =>
          userRewardIds.includes(String(s.user_reward_id || "")),
        );
    }

    const selectionMap: Record<string, any[]> = {};

    userSelections.forEach((s: any) => {
      const userRewardId = String(s.user_reward_id || "");

      if (!selectionMap[userRewardId]) {
        selectionMap[userRewardId] = [];
      }

      selectionMap[userRewardId].push({
        reward_item_id: String(s.reward_item_id || ""),
        item_name: String(s.item_name || ""),
        option_name: String(s.option_name || ""),
        selected_option: String(s.selected_option || ""),
        qty: Number(s.qty || 0),
      });
    });

    const orderIds = Array.from(
      new Set(
        userItems.map((i) => String(i.order_id || "").trim()).filter(Boolean),
      ),
    );

    let userTransactions: any[] = [];

    if (orderIds.length > 0) {
      const transactionsSnap = await adminDb
        .collection("transactions")
        .where("type", "==", "shop")
        .get();

      userTransactions = transactionsSnap.docs
        .map((doc) => ({
          docId: doc.id,
          ...doc.data(),
        }))
        .filter((t: any) => orderIds.includes(String(t.data_id || "")));
    }

    const totalAmount = userTransactions.reduce(
      (sum, t: any) => sum + Number(t.amount || 0),
      0,
    );

    const rewardIds = Array.from(
      new Set(
        userItems.map((i) => String(i.reward_id || "").trim()).filter(Boolean),
      ),
    );

    let rewards: any[] = [];

    if (rewardIds.length > 0) {
      const rewardsSnap = await adminDb.collection("rewards").get();

      rewards = rewardsSnap.docs
        .map((doc) => ({
          docId: doc.id,
          ...doc.data(),
        }))
        .filter((r: any) => rewardIds.includes(String(r.id || r.docId)));
    }

    const rewardMap = Object.fromEntries(
      rewards.map((r: any) => [String(r.id || r.docId), r]),
    );

    let rewardItems: any[] = [];

    if (rewardIds.length > 0) {
      const rewardItemsSnap = await adminDb
        .collection("rewarditems")
        .where("active", "==", 1)
        .get();

      rewardItems = rewardItemsSnap.docs
        .map((doc) => ({
          docId: doc.id,
          ...doc.data(),
        }))
        .filter((ri: any) => rewardIds.includes(String(ri.reward_id || "")));
    }

    const rewardItemsMap: Record<string, any[]> = {};

    rewardItems.forEach((ri: any) => {
      const rewardId = String(ri.reward_id || "");

      if (!rewardItemsMap[rewardId]) {
        rewardItemsMap[rewardId] = [];
      }

      rewardItemsMap[rewardId].push({
        id: String(ri.id || ri.docId),
        reward_id: rewardId,
        item_name: String(ri.item_name || ""),
        qty: Number(ri.qty || 0),
        has_option: Number(ri.has_option || 0),
        option_name: String(ri.option_name || ""),
        active: Number(ri.active || 0),
      });
    });

    const rewardGroup: Record<string, any> = {};

    userItems.forEach((r: any) => {
      const rewardId = String(r.reward_id || "");
      const reward = rewardMap[rewardId];
      const userRewardId = String(r.id || r.docId);
      const rewardQty = Number(r.qty || 0);

      if (!rewardGroup[rewardId]) {
        rewardGroup[rewardId] = {
          reward_id: rewardId,
          title: reward?.title || "",
          min_amount: Number(reward?.min_amount || 0),
          qty: 0,
          options: [],
          details: [],
        };
      }

      rewardGroup[rewardId].qty += rewardQty;

      const baseItems = rewardItemsMap[rewardId] || [];

      baseItems.forEach((baseItem: any) => {
        if (Number(baseItem.active) !== 1) return;

        if (Number(baseItem.has_option) !== 1) {
          const detailKey = `${baseItem.id}|nooption`;

          const existingDetail = rewardGroup[rewardId].details.find(
            (x: any) => x.key === detailKey,
          );

          const addQty = Number(baseItem.qty || 0) * rewardQty;

          if (existingDetail) {
            existingDetail.qty += addQty;
          } else {
            rewardGroup[rewardId].details.push({
              key: detailKey,
              reward_item_id: baseItem.id,
              item_name: baseItem.item_name,
              has_option: 0,
              option_name: "",
              selected_option: "",
              qty: addQty,
            });
          }
        }
      });

      const rowSelections = selectionMap[userRewardId] || [];

      rowSelections.forEach((sel: any) => {
        const existing = rewardGroup[rewardId].options.find(
          (x: any) =>
            String(x.reward_item_id) === String(sel.reward_item_id) &&
            String(x.option_name).toLowerCase() ===
              String(sel.option_name).toLowerCase() &&
            String(x.selected_option).toLowerCase() ===
              String(sel.selected_option).toLowerCase(),
        );

        if (existing) {
          existing.qty += Number(sel.qty || 0);
        } else {
          rewardGroup[rewardId].options.push({
            reward_item_id: sel.reward_item_id,
            item_name: sel.item_name,
            option_name: sel.option_name,
            selected_option: sel.selected_option,
            qty: Number(sel.qty || 0),
          });
        }

        const detailKey = `${sel.reward_item_id}|${String(
          sel.option_name,
        ).toLowerCase()}|${String(sel.selected_option).toLowerCase()}`;

        const existingDetail = rewardGroup[rewardId].details.find(
          (x: any) => x.key === detailKey,
        );

        if (existingDetail) {
          existingDetail.qty += Number(sel.qty || 0);
        } else {
          rewardGroup[rewardId].details.push({
            key: detailKey,
            reward_item_id: sel.reward_item_id,
            item_name: sel.item_name,
            has_option: 1,
            option_name: sel.option_name,
            selected_option: sel.selected_option,
            qty: Number(sel.qty || 0),
          });
        }
      });
    });

    const items = Object.values(rewardGroup)
      .map((item: any) => ({
        ...item,
        options: item.options.sort((a: any, b: any) => {
          const nameCompare = String(a.item_name).localeCompare(
            String(b.item_name),
          );

          if (nameCompare !== 0) return nameCompare;

          return String(a.selected_option).localeCompare(
            String(b.selected_option),
          );
        }),
        details: item.details
          .map((d: any) => {
            const { key, ...rest } = d;

            return rest;
          })
          .sort((a: any, b: any) => {
            const nameCompare = String(a.item_name).localeCompare(
              String(b.item_name),
            );

            if (nameCompare !== 0) return nameCompare;

            return String(a.selected_option).localeCompare(
              String(b.selected_option),
            );
          }),
      }))
      .sort(
        (a: any, b: any) =>
          Number(a.min_amount || 0) - Number(b.min_amount || 0),
      );

    const shipmentSnap = await adminDb
      .collection("shipments")
      .where("project_id", "==", String(projectId))
      .where("user_id", "==", String(userId))
      .limit(1)
      .get();

    const shipment = shipmentSnap.empty ? null : shipmentSnap.docs[0].data();

    return NextResponse.json({
      success: true,
      data: {
        total_amount: totalAmount,
        items,
        shipment: {
          tracking_no: shipment?.tracking_no || "",
          carrier: shipment?.carrier || "",
          status: shipment?.status || "",
        },
        sub_status: project?.sub_status || "",
      },
    });
  } catch (err: any) {
    console.error("get user shop summary error:", err);

    return NextResponse.json(
      {
        success: false,
        message: err?.message || "Get user shop summary failed",
      },
      { status: 500 },
    );
  }
}