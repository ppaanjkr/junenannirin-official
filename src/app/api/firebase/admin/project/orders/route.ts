import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { getBearerToken, verifyAccessToken } from "@/lib/auth/jwt";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function parseDateTime(value: any) {
  if (!value) return 0;

  if (typeof value?.toDate === "function") {
    return value.toDate().getTime();
  }

  if (value?._seconds) {
    return new Date(value._seconds * 1000).getTime();
  }

  if (value instanceof Date) {
    return value.getTime();
  }

  const text = String(value).trim();

  const match = text.match(
    /^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:,\s*(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/,
  );

  if (match) {
    const d = Number(match[1]);
    const m = Number(match[2]);
    const y = Number(match[3]);
    const hh = Number(match[4] || 0);
    const mm = Number(match[5] || 0);
    const ss = Number(match[6] || 0);

    return new Date(y, m - 1, d, hh, mm, ss).getTime();
  }

  const date = new Date(text);
  return isNaN(date.getTime()) ? 0 : date.getTime();
}

function toData(doc: FirebaseFirestore.QueryDocumentSnapshot) {
  return {
    docId: doc.id,
    ...doc.data(),
  };
}

async function requireAdmin(req: NextRequest) {
  const token = getBearerToken(req);
  const auth = await verifyAccessToken(token);

  if (!auth?.uuid || Number(auth.active || 0) !== 1 || auth.team !== "admin") {
    return null;
  }

  return auth;
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

    const projectId = req.nextUrl.searchParams.get("project_id");

    if (!projectId) {
      return NextResponse.json(
        { success: false, message: "project_id is required" },
        { status: 400 },
      );
    }

    const [
      usersSnap,
      rewardsSnap,
      rewardItemsSnap,
      userRewardsSnap,
      selectionsSnap,
      shipmentsSnap,
    ] = await Promise.all([
      adminDb.collection("users").get(),
      adminDb.collection("rewards").get(),
      adminDb.collection("rewarditems").get(),
      adminDb
        .collection("userrewards")
        .where("project_id", "==", String(projectId))
        .get(),
      adminDb.collection("userrewarditemselections").get(),
      adminDb
        .collection("shipments")
        .where("project_id", "==", String(projectId))
        .get(),
    ]);

    const users = usersSnap.docs.map(toData);
    const rewards = rewardsSnap.docs.map(toData);
    const rewardItems = rewardItemsSnap.docs.map(toData);
    const projectOrders = userRewardsSnap.docs.map(toData);
    const selections = selectionsSnap.docs.map(toData);
    const shipments = shipmentsSnap.docs.map(toData);

    const rewardMap: Record<string, any> = {};
    rewards.forEach((r: any) => {
      rewardMap[String(r.id || r.docId)] = r;
    });

    const rewardItemsMap: Record<string, any[]> = {};
    rewardItems.forEach((ri: any) => {
      const rewardId = String(ri.reward_id);

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

    const selectionMap: Record<string, any[]> = {};
    selections.forEach((s: any) => {
      const userRewardId = String(s.user_reward_id || "").trim();

      if (!selectionMap[userRewardId]) {
        selectionMap[userRewardId] = [];
      }

      selectionMap[userRewardId].push({
        reward_item_id: String(s.reward_item_id || "").trim(),
        item_name: String(s.item_name || ""),
        option_name: String(s.option_name || ""),
        selected_option: String(s.selected_option || ""),
        qty: Number(s.qty || 0),
      });
    });

    const userMap: Record<string, any> = {};
    users.forEach((u: any) => {
      userMap[String(u.uuid || u.docId)] = u;
    });

    const shipmentMap: Record<string, any> = {};
    shipments.forEach((s: any) => {
      const key = `${s.user_id}_${s.project_id}`;
      shipmentMap[key] = s;
    });

    const grouped: Record<string, any> = {};

    projectOrders.forEach((order: any) => {
      const userId = String(order.user_id);

      if (!grouped[userId]) {
        const user = userMap[userId] || {};
        const shipmentKey = `${userId}_${projectId}`;
        const shipment = shipmentMap[shipmentKey] || {};

        grouped[userId] = {
          user: {
            uuid: user.uuid || "",
            username: user.username || "",
            name: user.name || "",
            address: user.address || "",
            phone: user.phone || "",
          },

          shipment: {
            id: shipment.id || shipment.docId || "",
            tracking_no: shipment.tracking_no || "",
            carrier: shipment.carrier || "",
            status: shipment.status || "",
          },

          total_amount: 0,
          total_qty: 0,
          latest_order_at: order.created_at || "",

          orders_map: {},
        };
      }

      const currentTime = parseDateTime(order.created_at);
      const latestTime = parseDateTime(grouped[userId].latest_order_at);

      if (currentTime > latestTime) {
        grouped[userId].latest_order_at = order.created_at;
      }

      grouped[userId].total_amount += Number(order.total_amount || 0);
      grouped[userId].total_qty += Number(order.qty || 0);

      const rewardId = String(order.reward_id);
      const reward = rewardMap[rewardId] || {};
      const userRewardId = String(order.id || order.docId);
      const orderQty = Number(order.qty || 0);

      if (!grouped[userId].orders_map[rewardId]) {
        grouped[userId].orders_map[rewardId] = {
          reward_id: rewardId,
          title: reward.title || "",
          price: Number(reward.min_amount || 0),
          qty: 0,
          details_map: {},
        };
      }

      grouped[userId].orders_map[rewardId].qty += orderQty;

      const baseItems = rewardItemsMap[rewardId] || [];

      baseItems.forEach((baseItem: any) => {
        if (Number(baseItem.active) !== 1) return;

        if (Number(baseItem.has_option) !== 1) {
          const detailKey = `${baseItem.id}_nooption`;

          if (!grouped[userId].orders_map[rewardId].details_map[detailKey]) {
            grouped[userId].orders_map[rewardId].details_map[detailKey] = {
              reward_item_id: baseItem.id,
              item_name: baseItem.item_name,
              has_option: 0,
              option_name: "",
              selected_option: "",
              qty: 0,
            };
          }

          grouped[userId].orders_map[rewardId].details_map[detailKey].qty +=
            Number(baseItem.qty || 0) * orderQty;
        }
      });

      const rowSelections = selectionMap[userRewardId] || [];

      rowSelections.forEach((sel: any) => {
        const detailKey = `${sel.reward_item_id}_${sel.option_name || "option"}_${
          sel.selected_option || "nooption"
        }`;

        if (!grouped[userId].orders_map[rewardId].details_map[detailKey]) {
          grouped[userId].orders_map[rewardId].details_map[detailKey] = {
            reward_item_id: sel.reward_item_id,
            item_name: sel.item_name,
            has_option: 1,
            option_name: sel.option_name,
            selected_option: sel.selected_option,
            qty: 0,
          };
        }

        grouped[userId].orders_map[rewardId].details_map[detailKey].qty +=
          Number(sel.qty || 0);
      });
    });

    const result = Object.values(grouped).map((item: any) => {
      const orders = Object.values(item.orders_map)
        .map((order: any) => {
          const details = Object.values(order.details_map || {}).sort(
            (a: any, b: any) => {
              const nameCompare = String(a.item_name).localeCompare(
                String(b.item_name),
              );

              if (nameCompare !== 0) return nameCompare;

              return String(a.selected_option || "").localeCompare(
                String(b.selected_option || ""),
              );
            },
          );

          delete order.details_map;

          return {
            ...order,
            details,
          };
        })
        .sort(
          (a: any, b: any) => Number(a.price || 0) - Number(b.price || 0),
        );

      delete item.orders_map;

      return {
        ...item,
        orders,
      };
    });

    result.sort((a: any, b: any) => {
      return String(a.user.name || "").localeCompare(String(b.user.name || ""));
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (err: any) {
    console.error("get admin project orders error:", err);

    return NextResponse.json(
      {
        success: false,
        message: err?.message || "Get admin project orders failed",
      },
      { status: 500 },
    );
  }
}