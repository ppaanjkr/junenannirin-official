import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

function toPlainData(doc: FirebaseFirestore.QueryDocumentSnapshot) {
  return {
    docId: doc.id,
    ...doc.data(),
  };
}

function buildOptionUsageSummary(
  projectRewardItems: any[],
  projectUserRewards: any[],
  userRewardItemSelections: any[],
) {
  const projectUserRewardIds = new Set(
    projectUserRewards.map((r) => String(r.id || r.docId)),
  );

  const projectRewardItemIds = new Set(
    projectRewardItems.map((item) => String(item.id || item.docId)),
  );

  const optionUsageMap: Record<string, any> = {};

  projectRewardItems
    .filter((item) => Number(item.has_option) === 1)
    .forEach((item) => {
      const itemName = String(item.item_name || "").trim();
      const optionName = String(item.option_name || "").trim();

      if (!itemName) return;

      const groupKey = `${itemName}|${optionName}`;

      if (!optionUsageMap[groupKey]) {
        optionUsageMap[groupKey] = {
          item_name: itemName,
          option_name: optionName,
          options: {},
        };
      }
    });

  userRewardItemSelections.forEach((selection) => {
    const userRewardId = String(selection.user_reward_id || "").trim();
    const rewardItemId = String(selection.reward_item_id || "").trim();

    if (!projectUserRewardIds.has(userRewardId)) return;
    if (!projectRewardItemIds.has(rewardItemId)) return;

    const itemName = String(selection.item_name || "").trim();
    const optionName = String(selection.option_name || "").trim();
    const selectedOption = String(selection.selected_option || "").trim();

    if (!itemName || !selectedOption) return;

    const groupKey = `${itemName}|${optionName}`;

    if (!optionUsageMap[groupKey]) {
      optionUsageMap[groupKey] = {
        item_name: itemName,
        option_name: optionName,
        options: {},
      };
    }

    if (!optionUsageMap[groupKey].options[selectedOption]) {
      optionUsageMap[groupKey].options[selectedOption] = 0;
    }

    optionUsageMap[groupKey].options[selectedOption] += Number(
      selection.qty || 0,
    );
  });

  return Object.values(optionUsageMap)
    .map((item: any) => ({
      item_name: item.item_name,
      option_name: item.option_name,
      options: Object.entries(item.options)
        .map(([option_value, qty]) => ({
          option_value,
          qty,
        }))
        .sort((a: any, b: any) => {
          const order = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];

          const aIndex = order.indexOf(String(a.option_value).toUpperCase());
          const bIndex = order.indexOf(String(b.option_value).toUpperCase());

          if (aIndex === -1 && bIndex === -1) {
            return String(a.option_value).localeCompare(String(b.option_value));
          }

          if (aIndex === -1) return 1;
          if (bIndex === -1) return -1;

          return aIndex - bIndex;
        }),
    }))
    .filter((item: any) => item.options.length > 0)
    .sort((a: any, b: any) =>
      String(a.item_name).localeCompare(String(b.item_name)),
    );
}

export async function GET(req: NextRequest) {
  try {
    const projectId = req.nextUrl.searchParams.get("project_id");

    if (!projectId) {
      return NextResponse.json(
        { success: false, message: "project_id is required" },
        { status: 400 },
      );
    }

    const [
      projectSnap,
      rewardsSnap,
      rewardItemsSnap,
      userRewardsSnap,
      transactionsSnap,
      donationsSnap,
      selectionsSnap,
      targetsSnap,
    ] = await Promise.all([
      adminDb.collection("projects").doc(String(projectId)).get(),
      adminDb.collection("rewards").get(),
      adminDb.collection("rewarditems").get(),
      adminDb.collection("userrewards").get(),
      adminDb.collection("transactions").get(),
      adminDb.collection("donations").get(),
      adminDb.collection("userrewarditemselections").get(),
      adminDb.collection("targets").get(),
    ]);

    if (!projectSnap.exists) {
      return NextResponse.json({
        success: false,
        message: "Project not found",
      });
    }

    const project = {
      docId: projectSnap.id,
      ...projectSnap.data(),
      id: projectSnap.data()?.id || projectSnap.id,
    } as any;

    const rewards = rewardsSnap.docs.map(toPlainData);
    const rewardItems = rewardItemsSnap.docs.map(toPlainData);
    const userRewards = userRewardsSnap.docs.map(toPlainData);
    const transactions = transactionsSnap.docs.map(toPlainData);
    const donations = donationsSnap.docs.map(toPlainData);
    const userRewardItemSelections = selectionsSnap.docs.map(toPlainData);
    const targets = targetsSnap.docs.map(toPlainData);

    let summary = {
      totalRevenue: 0,
      totalOrders: 0,
      totalUsers: 0,
    };

    let shop: any = null;
    let donation: any = null;

    if (String(project.type) === "shop") {
      const projectRewards = rewards.filter(
        (r: any) => String(r.project_id) === String(projectId),
      );

      const projectOrders = userRewards.filter(
        (r: any) => String(r.project_id) === String(projectId),
      );

      const orderIds = Array.from(
        new Set(
          projectOrders
            .map((o: any) => String(o.order_id || "").trim())
            .filter(Boolean),
        ),
      );

      const projectTransactions = transactions.filter(
        (t: any) =>
          String(t.type) === "shop" &&
          orderIds.includes(String(t.data_id || "").trim()),
      );

      summary.totalRevenue = projectTransactions.reduce(
        (sum: number, t: any) => sum + Number(t.amount || 0),
        0,
      );

      summary.totalOrders = orderIds.length;

      summary.totalUsers = new Set(
        projectOrders.map((o: any) => String(o.user_id)),
      ).size;

      const rewardSummaryMap: Record<string, any> = {};

      projectRewards.forEach((r: any) => {
        const rewardId = String(r.id || r.docId);

        rewardSummaryMap[rewardId] = {
          reward_id: rewardId,
          title: r.title || "",
          qty: 0,
          total_qty: 0,
          image_url: r.image_url || "",
          price: Number(r.min_amount || 0),
          min_amount: Number(r.min_amount || 0),
          description: r.description || "",
        };
      });

      projectOrders.forEach((order: any) => {
        const rewardId = String(order.reward_id);

        if (!rewardSummaryMap[rewardId]) return;

        rewardSummaryMap[rewardId].qty += Number(order.qty || 0);
        rewardSummaryMap[rewardId].total_qty += Number(order.qty || 0);
      });

      const rewardSummary = Object.values(rewardSummaryMap).sort(
        (a: any, b: any) =>
          Number(a.min_amount || 0) - Number(b.min_amount || 0),
      );

      const rewardIds = projectRewards.map((r: any) => String(r.id || r.docId));

      const projectRewardItems = rewardItems.filter((item: any) =>
        rewardIds.includes(String(item.reward_id)),
      );

      const rewardItemMap: Record<string, any[]> = {};

      projectRewardItems.forEach((item: any) => {
        const rewardId = String(item.reward_id);

        if (!rewardItemMap[rewardId]) {
          rewardItemMap[rewardId] = [];
        }

        rewardItemMap[rewardId].push(item);
      });

      const itemUsageMap: Record<string, number> = {};

      projectRewardItems.forEach((item: any) => {
        const itemName = String(item.item_name || "").trim();

        if (!itemName) return;

        if (!itemUsageMap[itemName]) {
          itemUsageMap[itemName] = 0;
        }
      });

      projectOrders.forEach((order: any) => {
        const rewardId = String(order.reward_id);
        const items = rewardItemMap[rewardId] || [];

        items.forEach((item: any) => {
          const itemName = String(item.item_name || "").trim();

          if (!itemName) return;

          itemUsageMap[itemName] +=
            Number(order.qty || 0) * Number(item.qty || 0);
        });
      });

      const itemSummary = Object.entries(itemUsageMap)
        .map(([name, qty]) => ({
          name,
          item_name: name,
          qty,
          total_qty: qty,
        }))
        .sort((a, b) => Number(b.qty || 0) - Number(a.qty || 0));

      const optionSummary = buildOptionUsageSummary(
        projectRewardItems,
        projectOrders,
        userRewardItemSelections,
      );

      const sizeSummary = optionSummary.map((item: any) => ({
        item_name: item.item_name,
        option_name: item.option_name,
        sizes: item.options.map((o: any) => ({
          size: o.option_value,
          qty: o.qty,
        })),
      }));

      shop = {
        rewardSummary,
        itemSummary,
        optionSummary,
        sizeSummary,
      };
    }

    if (String(project.type) === "donation") {
      const projectDonations = donations.filter(
        (d: any) => String(d.project_id) === String(projectId),
      );

      const projectTargets = targets
        .filter((t: any) => String(t.project_id) === String(projectId))
        .sort((a: any, b: any) => Number(a.step || 0) - Number(b.step || 0));

      const projectRewards = rewards.filter(
        (r: any) => String(r.project_id) === String(projectId),
      );

      const projectUserRewards = userRewards.filter(
        (r: any) => String(r.project_id) === String(projectId),
      );

      const totalDonation = projectDonations.reduce(
        (sum: number, d: any) =>
          sum + Number(d.verified_amount || d.input_amount || 0),
        0,
      );

      const totalUsers = new Set(
        projectDonations.map((d: any) => String(d.user_id)),
      ).size;

      const totalTransactions = projectDonations.length;

      summary.totalRevenue = totalDonation;
      summary.totalUsers = totalUsers;
      summary.totalOrders = totalTransactions;

      const rewardSummaryMap: Record<string, any> = {};

      projectRewards.forEach((r: any) => {
        const rewardId = String(r.id || r.docId);

        rewardSummaryMap[rewardId] = {
          reward_id: rewardId,
          title: r.title || "",
          qty: 0,
          total_qty: 0,
          image_url: r.image_url || "",
          price: Number(r.min_amount || 0),
          min_amount: Number(r.min_amount || 0),
          description: r.description || "",
        };
      });

      projectUserRewards.forEach((r: any) => {
        const rewardId = String(r.reward_id);

        if (!rewardSummaryMap[rewardId]) return;

        rewardSummaryMap[rewardId].qty += Number(r.qty || 0);
        rewardSummaryMap[rewardId].total_qty += Number(r.qty || 0);
      });

      const reward_summary = Object.values(rewardSummaryMap).sort(
        (a: any, b: any) =>
          Number(a.min_amount || 0) - Number(b.min_amount || 0),
      );

      const rewardIds = projectRewards.map((r: any) => String(r.id || r.docId));

      const projectRewardItems = rewardItems.filter((item: any) =>
        rewardIds.includes(String(item.reward_id)),
      );

      const rewardItemMap: Record<string, any[]> = {};

      projectRewardItems.forEach((item: any) => {
        const rewardId = String(item.reward_id);

        if (!rewardItemMap[rewardId]) {
          rewardItemMap[rewardId] = [];
        }

        rewardItemMap[rewardId].push(item);
      });

      const itemUsageMap: Record<string, number> = {};

      projectRewardItems.forEach((item: any) => {
        const itemName = String(item.item_name || "").trim();

        if (!itemName) return;

        if (!itemUsageMap[itemName]) {
          itemUsageMap[itemName] = 0;
        }
      });

      projectUserRewards.forEach((r: any) => {
        const rewardId = String(r.reward_id);
        const items = rewardItemMap[rewardId] || [];

        items.forEach((item: any) => {
          const itemName = String(item.item_name || "").trim();

          if (!itemName) return;

          itemUsageMap[itemName] += Number(item.qty || 0) * Number(r.qty || 0);
        });
      });

      const item_usage_summary = Object.entries(itemUsageMap)
        .map(([item_name, total_qty]) => ({
          item_name,
          name: item_name,
          total_qty,
          qty: total_qty,
        }))
        .sort((a, b) => Number(b.total_qty || 0) - Number(a.total_qty || 0));

      const option_usage_summary = buildOptionUsageSummary(
        projectRewardItems,
        projectUserRewards,
        userRewardItemSelections,
      );

      const size_usage_summary = option_usage_summary.map((item: any) => ({
        item_name: item.item_name,
        option_name: item.option_name,
        sizes: item.options.map((o: any) => ({
          size: o.option_value,
          total_qty: o.qty,
          qty: o.qty,
        })),
      }));

      donation = {
        targets: projectTargets,
        reward_summary,
        item_usage_summary,
        option_usage_summary,
        size_usage_summary,
        totalDonation,
        totalUsers,
        totalTransactions,
      };
    }

    return NextResponse.json({
      success: true,
      data: {
        project,
        summary,
        shop,
        donation,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: err?.message || "Get admin project detail failed",
      },
      { status: 500 },
    );
  }
}
