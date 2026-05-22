import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

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

  if (typeof value === "string") {
    const text = value.trim();

    const match = text.match(
      /^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:,\s*(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/,
    );

    if (match) {
      const [, d, m, y, hh = "0", mm = "0", ss = "0"] = match;

      return new Date(
        Number(y),
        Number(m) - 1,
        Number(d),
        Number(hh),
        Number(mm),
        Number(ss),
      ).toISOString();
    }

    const date = new Date(text);
    return isNaN(date.getTime()) ? text : date.toISOString();
  }

  return "";
}

function parseDateTime(value: any) {
  if (!value) return 0;

  if (typeof value?.toDate === "function") {
    return value.toDate().getTime();
  }

  if (value?._seconds) {
    return value._seconds * 1000;
  }

  if (value instanceof Date) {
    return value.getTime();
  }

  const date = new Date(value);
  return isNaN(date.getTime()) ? 0 : date.getTime();
}

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("user_id");

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "user_id is required" },
        { status: 400 },
      );
    }

    const [
      projectsSnap,
      donationsSnap,
      ordersSnap,
      transactionsSnap,
      rewardsSnap,
      rewardItemsSnap,
      selectionsSnap,
      shipmentsSnap,
    ] = await Promise.all([
      adminDb.collection("projects").get(),
      adminDb.collection("donations").where("user_id", "==", userId).get(),
      adminDb.collection("userrewards").where("user_id", "==", userId).get(),
      adminDb.collection("transactions").where("user_id", "==", userId).get(),
      adminDb.collection("rewards").get(),
      adminDb.collection("rewarditems").get(),
      adminDb.collection("userrewarditemselections").get(),
      adminDb.collection("shipments").where("user_id", "==", userId).get(),
    ]);

    const projects = projectsSnap.docs.map((doc) => ({
      docId: doc.id,
      ...doc.data(),
    })) as any[];

    const donations = donationsSnap.docs.map((doc) => ({
      docId: doc.id,
      ...doc.data(),
    })) as any[];

    const orders = ordersSnap.docs.map((doc) => ({
      docId: doc.id,
      ...doc.data(),
    })) as any[];

    const transactions = transactionsSnap.docs.map((doc) => ({
      docId: doc.id,
      ...doc.data(),
    })) as any[];

    const rewards = rewardsSnap.docs.map((doc) => ({
      docId: doc.id,
      ...doc.data(),
    })) as any[];

    const rewardItems = rewardItemsSnap.docs.map((doc) => ({
      docId: doc.id,
      ...doc.data(),
    })) as any[];

    const selections = selectionsSnap.docs.map((doc) => ({
      docId: doc.id,
      ...doc.data(),
    })) as any[];

    const shipments = shipmentsSnap.docs.map((doc) => ({
      docId: doc.id,
      ...doc.data(),
    })) as any[];

    const projectMap = Object.fromEntries(
      projects.map((p) => [String(p.id || p.docId), p]),
    );

    const shopProjectIds = new Set(
      projects
        .filter((p) => String(p.type) === "shop")
        .map((p) => String(p.id || p.docId)),
    );

    const donationProjectIds = new Set(
      projects
        .filter((p) => String(p.type) === "donation")
        .map((p) => String(p.id || p.docId)),
    );

    const rewardMap = Object.fromEntries(
      rewards.map((r) => [String(r.id || r.docId), r]),
    );

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
        active: Number(ri.active ?? 1),
      });
    });

    const selectionMap: Record<string, any[]> = {};

    selections.forEach((s: any) => {
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

    const userOrders = orders.filter((o: any) =>
      shopProjectIds.has(String(o.project_id)),
    );

    const orderGroup: Record<string, any[]> = {};

    userOrders.forEach((o: any) => {
      const orderId = String(o.order_id || "").trim();

      if (!orderId) return;

      if (!orderGroup[orderId]) {
        orderGroup[orderId] = [];
      }

      orderGroup[orderId].push(o);
    });

    const shop = Object.entries(orderGroup).map(([orderId, orderItems]) => {
      const firstOrderItem: any = orderItems[0];

      const transaction = transactions.find(
        (t: any) =>
          String(t.type) === "shop" &&
          String(t.data_id || "").trim() === String(orderId).trim(),
      );

      const project = projectMap[String(firstOrderItem.project_id)] || {};

      const shipment = shipments.find(
        (s: any) =>
          String(s.id || s.docId || "").trim() ===
            String(firstOrderItem.shipment_id || "").trim() ||
          String(s.order_id || "").trim() === String(orderId).trim(),
      );

      const historyItems = orderItems.map((i: any) => {
        const reward = rewardMap[String(i.reward_id)];
        const rewardId = String(i.reward_id);
        const userRewardId = String(i.id || i.docId);
        const orderQty = Number(i.qty || 0);

        const details: any[] = [];

        const baseItems = rewardItemsMap[rewardId] || [];

        baseItems.forEach((baseItem: any) => {
          if (Number(baseItem.active) !== 1) return;

          if (Number(baseItem.has_option) !== 1) {
            details.push({
              reward_item_id: baseItem.id,
              item_name: baseItem.item_name,
              has_option: 0,
              option_name: "",
              selected_option: "",
              qty: Number(baseItem.qty || 0) * orderQty,
            });
          }
        });

        const rowSelections = selectionMap[userRewardId] || [];

        rowSelections.forEach((sel: any) => {
          details.push({
            reward_item_id: sel.reward_item_id,
            item_name: sel.item_name,
            has_option: 1,
            option_name: sel.option_name,
            selected_option: sel.selected_option,
            qty: Number(sel.qty || 0),
          });
        });

        details.sort((a, b) => {
          const nameCompare = String(a.item_name).localeCompare(
            String(b.item_name),
          );

          if (nameCompare !== 0) return nameCompare;

          return String(a.selected_option || "").localeCompare(
            String(b.selected_option || ""),
          );
        });

        return {
          user_reward_id: i.id || i.docId,
          reward_id: i.reward_id,

          title: reward?.title || "",
          description: reward?.description || "",
          image_url: reward?.image_url || "",

          qty: Number(i.qty || 0),
          price: Number(i.price || 0),
          total: Number(i.total_amount || 0),

          details,
        };
      });

      const fallbackAmount = historyItems.reduce(
        (sum, item) => sum + Number(item.total || 0),
        0,
      );

      return {
        order_id: orderId,
        order_no: orderId,

        project: {
          id: project.id || "",
          name: project.name || "",
          image_url: project.image_url || "",
        },

        items: historyItems,

        amount: transaction ? Number(transaction.amount || 0) : fallbackAmount,

        status: project.sub_status || "",

        shipment: {
          tracking_no: shipment?.tracking_no || "",
          carrier: shipment?.carrier || "",
          status: shipment?.status || "",
        },

        created_at: toIsoDate(
          transaction?.created_at || firstOrderItem.created_at,
        ),
      };
    });

    const userDonations = donations.filter((d: any) =>
      donationProjectIds.has(String(d.project_id)),
    );

    const donation = userDonations.map((d: any) => {
      const project = projectMap[String(d.project_id)] || {};

      const transaction = transactions.find(
        (t: any) =>
          String(t.type) === "donation" && String(t.data_id) === String(d.id),
      );

      return {
        donation_id: d.id || d.docId,

        project: {
          id: project.id || "",
          name: project.name || "",
          image_url: project.image_url || "",
        },

        amount: transaction
          ? Number(transaction.amount || 0)
          : Number(d.verified_amount || d.input_amount || 0),

        created_at: toIsoDate(transaction?.created_at || d.created_at),
      };
    });

    shop.sort(
      (a, b) => parseDateTime(b.created_at) - parseDateTime(a.created_at),
    );

    donation.sort(
      (a, b) => parseDateTime(b.created_at) - parseDateTime(a.created_at),
    );

    return NextResponse.json({
      success: true,
      data: {
        shop,
        donation,
      },
    });
  } catch (err: any) {
    console.error("get user history error:", err);

    return NextResponse.json(
      {
        success: false,
        message: err?.message || "Get user history failed",
      },
      { status: 500 },
    );
  }
}