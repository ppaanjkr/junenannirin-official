import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

export async function GET() {
  try {
    const projectSnap = await adminDb
      .collection("projects")
      .where("status", "==", "open")
      .get();

    if (projectSnap.empty) {
      return NextResponse.json({
        success: true,
        data: null,
      });
    }

    const openProjects = projectSnap.docs
      .map((doc) => ({
        docId: doc.id,
        ...doc.data(),
      }))
      .sort(
        (a: any, b: any) =>
          new Date(b.created_at || 0).getTime() -
          new Date(a.created_at || 0).getTime(),
      );

    const project: any = openProjects[0];
    const projectId = project.id || project.docId;

    const [bankSnap, targetsSnap, rewardsSnap] = await Promise.all([
      project.bank_id
        ? adminDb.collection("banks").doc(String(project.bank_id)).get()
        : null,

      adminDb
        .collection("targets")
        .where("project_id", "==", projectId)
        .get(),

      adminDb
        .collection("rewards")
        .where("project_id", "==", projectId)
        .get(),
    ]);

    const targets = targetsSnap.docs
      .map((doc) => doc.data())
      .sort((a: any, b: any) => Number(a.step || 0) - Number(b.step || 0));

    const rewardDocs = rewardsSnap.docs
      .map((doc) => doc.data())
      .sort(
        (a: any, b: any) =>
          Number(a.min_amount || 0) - Number(b.min_amount || 0),
      );

    const rewardIds = rewardDocs.map((r: any) => String(r.id || ""));

    let rewardItems: any[] = [];
    let rewardOptions: any[] = [];

    if (rewardIds.length > 0) {
      const itemSnap = await adminDb
        .collection("rewarditems")
        .where("active", "==", 1)
        .get();

      rewardItems = itemSnap.docs
        .map((doc) => doc.data())
        .filter((item: any) => rewardIds.includes(String(item.reward_id)));

      const itemIds = rewardItems.map((item: any) => String(item.id || ""));

      if (itemIds.length > 0) {
        const optionSnap = await adminDb
          .collection("rewarditemoptions")
          .where("active", "==", 1)
          .get();

        rewardOptions = optionSnap.docs
          .map((doc) => doc.data())
          .filter((option: any) =>
            itemIds.includes(String(option.reward_item_id)),
          );
      }
    }

    const optionsMap: Record<string, any[]> = {};

    rewardOptions.forEach((option: any) => {
      const rewardItemId = String(option.reward_item_id || "");

      if (!optionsMap[rewardItemId]) {
        optionsMap[rewardItemId] = [];
      }

      optionsMap[rewardItemId].push({
        ...option,
        sort_order: Number(option.sort_order || 0),
        active: Number(option.active || 0),
      });
    });

    Object.keys(optionsMap).forEach((key) => {
      optionsMap[key].sort(
        (a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0),
      );
    });

    const itemsMap: Record<string, any[]> = {};

    rewardItems.forEach((item: any) => {
      const rewardId = String(item.reward_id || "");
      const rewardItemId = String(item.id || "");

      if (!itemsMap[rewardId]) {
        itemsMap[rewardId] = [];
      }

      itemsMap[rewardId].push({
        ...item,
        id: rewardItemId,
        reward_id: rewardId,
        item_name: String(item.item_name || ""),
        qty: Number(item.qty || 0),
        has_option: Number(item.has_option || 0),
        option_name: String(item.option_name || ""),
        active: Number(item.active || 0),
        options: optionsMap[rewardItemId] || [],
      });
    });

    const rewards = rewardDocs.map((reward: any) => {
      const rewardId = String(reward.id || "");

      return {
        ...reward,
        id: rewardId,
        project_id: String(reward.project_id || ""),
        min_amount: Number(reward.min_amount || 0),
        items: itemsMap[rewardId] || [],
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        project: {
          ...project,
          id: projectId,
        },
        bank: bankSnap?.exists ? bankSnap.data() : null,
        targets,
        rewards,
        topSpenders: [],
        totalDonors: 0,
        recent: [],
      },
    });
  } catch (err: any) {
    console.error("GET ACTIVE PROJECT ERROR:", err);

    return NextResponse.json(
      {
        success: false,
        message: err?.message || "Get active project failed",
        code: err?.code,
      },
      { status: 500 },
    );
  }
}