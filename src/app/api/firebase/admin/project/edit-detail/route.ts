import { adminDb } from "@/lib/firebase/admin";
import { NextRequest, NextResponse } from "next/server";

function serializeDate(value: any) {
  if (!value) return "";

  if (typeof value?.toDate === "function") {
    return value.toDate().toISOString();
  }

  if (value?._seconds) {
    return new Date(value._seconds * 1000).toISOString();
  }

  return value;
}

function docData(doc: FirebaseFirestore.QueryDocumentSnapshot) {
  const data = doc.data();

  return {
    ...data,
    docId: doc.id,
    id: data.id || doc.id,
    created_at: serializeDate(data.created_at),
    updated_at: serializeDate(data.updated_at),
    start_date: serializeDate(data.start_date),
    end_date: serializeDate(data.end_date),
  };
}

function normalizeImgMore(project: any) {
  const value =
    project.img_more ??
    project.image_more ??
    project.more_images ??
    project.imgMore ??
    project.images ??
    [];

  if (Array.isArray(value)) return value.filter(Boolean);

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.filter(Boolean);
    } catch {
      return value ? [value] : [];
    }
  }

  return [];
}

function normalizeOptions(item: any) {
  if (Array.isArray(item.options)) {
    return item.options.map((option: any) => {
      if (typeof option === "string") {
        return {
          option_value: option,
        };
      }

      return {
        option_value:
          option.option_value ||
          option.value ||
          option.name ||
          option.label ||
          "",
      };
    });
  }

  if (Array.isArray(item.option_values)) {
    return item.option_values.map((option: any) => {
      if (typeof option === "string") {
        return {
          option_value: option,
        };
      }

      return {
        option_value:
          option.option_value ||
          option.value ||
          option.name ||
          option.label ||
          "",
      };
    });
  }

  return [];
}

function normalizeRewardItem(item: any, rewardId: string) {
  return {
    id: item.id || item.docId || "",
    reward_id: rewardId,
    item_name: item.item_name || item.name || item.title || "",
    qty: Number(item.qty || item.quantity || 1),
    has_option: Number(item.has_option || item.hasOption || 0),
    option_name: item.option_name || item.optionName || "",
    options: normalizeOptions(item),
  };
}

function getRewardKeys(reward: any) {
  return [reward.id, reward.docId, reward.reward_id, reward.rewardId]
    .filter(Boolean)
    .map(String);
}

function getItemRewardKeys(item: any) {
  return [item.reward_id, item.rewardId, item.reward_doc_id, item.reward_docId]
    .filter(Boolean)
    .map(String);
}

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Project id is required",
        },
        { status: 400 },
      );
    }

    const projectRef = adminDb.collection("projects").doc(id);
    const projectDoc = await projectRef.get();

    if (!projectDoc.exists) {
      return NextResponse.json(
        {
          success: false,
          message: "Project not found",
        },
        { status: 404 },
      );
    }

    const [targetsSnap, rewardsSnap] = await Promise.all([
      adminDb.collection("targets").where("project_id", "==", id).get(),
      adminDb.collection("rewards").where("project_id", "==", id).get(),
    ]);

    const targets = targetsSnap.docs
      .map(docData)
      .sort((a: any, b: any) => Number(a.step || 0) - Number(b.step || 0));

    const rewardsBase = rewardsSnap.docs
      .map(docData)
      .sort(
        (a: any, b: any) =>
          Number(a.min_amount || 0) - Number(b.min_amount || 0),
      );

    const rewardKeys = Array.from(
      new Set(rewardsBase.flatMap((reward: any) => getRewardKeys(reward))),
    );

    let rewardItems: any[] = [];

    if (rewardKeys.length > 0) {
      const rewardItemCollections = [
        "rewarditems",
        "reward_items",
        "reward_item",
      ];

      const itemSnaps = await Promise.all(
        rewardItemCollections.flatMap((collectionName) =>
          rewardKeys.flatMap((rewardId) => [
            adminDb
              .collection(collectionName)
              .where("reward_id", "==", rewardId)
              .get(),

            adminDb
              .collection(collectionName)
              .where("rewardId", "==", rewardId)
              .get(),

            adminDb
              .collection(collectionName)
              .where("reward_doc_id", "==", rewardId)
              .get(),

            adminDb
              .collection(collectionName)
              .where("reward_docId", "==", rewardId)
              .get(),
          ]),
        ),
      );

      const itemMapByDocId = new Map<string, any>();

      itemSnaps.forEach((snap) => {
        snap.docs.forEach((doc) => {
          itemMapByDocId.set(doc.id, docData(doc));
        });
      });

      rewardItems = Array.from(itemMapByDocId.values());
    }

    const itemsMap = rewardItems.reduce((acc: any, item: any) => {
      const itemRewardKeys = getItemRewardKeys(item);

      itemRewardKeys.forEach((rewardId) => {
        if (!acc[rewardId]) acc[rewardId] = [];

        const normalizedItem = normalizeRewardItem(item, rewardId);

        const isDuplicate = acc[rewardId].some(
          (existing: any) => existing.id === normalizedItem.id,
        );

        if (!isDuplicate) {
          acc[rewardId].push(normalizedItem);
        }
      });

      return acc;
    }, {});

    const rewards = rewardsBase.map((reward: any) => {
      const rewardItemKeys = getRewardKeys(reward);

      const items = rewardItemKeys
        .flatMap((key: string) => itemsMap[key] || [])
        .filter(
          (item: any, index: number, arr: any[]) =>
            arr.findIndex((x: any) => x.id === item.id) === index,
        );

      return {
        ...reward,
        title: reward.title || "",
        description: reward.description || "",
        min_amount: Number(reward.min_amount || 0),
        price: Number(reward.price || reward.min_amount || 0),
        image_url: reward.image_url || "",
        items,
      };
    });

    const projectData = projectDoc.data() || {};

    return NextResponse.json({
      success: true,
      data: {
        project: {
          ...docData(projectDoc as any),
          img_more: normalizeImgMore(projectData),
        },
        targets,
        rewards,
      },
    });
  } catch (err: any) {
    console.error("get project edit detail error:", err);

    return NextResponse.json(
      {
        success: false,
        message: err.message || "Get project edit detail failed",
      },
      { status: 500 },
    );
  }
}
