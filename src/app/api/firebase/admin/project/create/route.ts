import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import { uploadImageToDrive } from "@/lib/google/drive";

function getYear() {
  return new Date().getFullYear();
}

function isBlobUrl(value?: string) {
  return String(value || "").startsWith("blob:");
}

function cleanUrl(value?: string) {
  return isBlobUrl(value) ? "" : value || "";
}

async function generateProjectId() {
  const year = getYear();
  const prefix = `PROJ_${year}`;

  const snap = await adminDb
    .collection("projects")
    .where("id", ">=", `${prefix}001`)
    .where("id", "<=", `${prefix}999`)
    .orderBy("id", "desc")
    .limit(1)
    .get();

  if (snap.empty) return `${prefix}001`;

  const lastId = snap.docs[0].data().id || "";
  const lastNo = Number(String(lastId).replace(prefix, "")) || 0;

  return `${prefix}${String(lastNo + 1).padStart(3, "0")}`;
}

async function uploadFileIfExists(file: any, fileName: string) {
  if (!file?.base64) return "";

  const uploaded = await uploadImageToDrive({
    base64: file.base64,
    fileName: file.fileName || fileName,
  });

  return uploaded.url;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const project = body.project;

    if (!project) {
      return NextResponse.json(
        { success: false, message: "Project payload is required" },
        { status: 400 },
      );
    }

    if (!String(project.name || "").trim()) {
      return NextResponse.json(
        { success: false, message: "Project name is required" },
        { status: 400 },
      );
    }

    const projectId = await generateProjectId();
    const now = FieldValue.serverTimestamp();

    let imageUrl = cleanUrl(project.image_url);

    if (project.image_file?.base64) {
      imageUrl = await uploadFileIfExists(
        project.image_file,
        `${projectId}_cover.webp`,
      );
    }

    let imgMore: string[] = [];

    if (Array.isArray(project.img_more)) {
      imgMore = project.img_more.map(cleanUrl).filter(Boolean);
    } else if (project.img_more) {
      imgMore = String(project.img_more)
        .split(",")
        .map((x) => cleanUrl(x.trim()))
        .filter(Boolean);
    }

    if (Array.isArray(project.img_more_files)) {
      for (let i = 0; i < project.img_more_files.length; i++) {
        const file = project.img_more_files[i];

        if (!file?.base64) continue;

        const uploadedUrl = await uploadFileIfExists(
          file,
          `${projectId}_more_${i + 1}.webp`,
        );

        if (uploadedUrl) imgMore.push(uploadedUrl);
      }
    }

    const batch = adminDb.batch();

    const projectRef = adminDb.collection("projects").doc(projectId);

    batch.set(projectRef, {
      id: projectId,
      name: project.name || "",
      description: project.description || "",
      image_url: imageUrl,
      img_more: imgMore.join(","),
      start_date: project.start_date || "",
      end_date: project.end_date || "",
      target_amount: Number(project.target_amount || 0),
      current_amount: Number(project.current_amount || 0),
      status: project.status || "draft",
      type: project.type || "",
      sub_status: project.sub_status || "",
      theme_color: project.theme_color || "",
      bank_id: project.bank_id || "",
      created_at: now,
      created_by: project.created_by || "",
      updated_at: now,
      updated_by: project.updated_by || "",
      closed_at: "",
    });

    const targets = Array.isArray(project.targets) ? project.targets : [];

    for (let index = 0; index < targets.length; index++) {
      const target = targets[index];
      const targetId = `${projectId}_T${String(index + 1).padStart(3, "0")}`;

      let targetImageUrl = cleanUrl(target.image_url);

      if (target.image_file?.base64) {
        targetImageUrl = await uploadFileIfExists(
          target.image_file,
          `${projectId}_target_${index + 1}.webp`,
        );
      }

      batch.set(adminDb.collection("targets").doc(targetId), {
        id: targetId,
        project_id: projectId,
        step: Number(target.step || index + 1),
        amount: Number(target.amount || target.amout || 0),
        title: target.title || "",
        description: target.description || "",
        image_url: targetImageUrl,
        created_at: now,
      });
    }

    const rewards = Array.isArray(project.rewards) ? project.rewards : [];

    for (let rewardIndex = 0; rewardIndex < rewards.length; rewardIndex++) {
      const reward = rewards[rewardIndex];

      const rewardId = `${projectId}_R${String(rewardIndex + 1).padStart(
        3,
        "0",
      )}`;

      let rewardImageUrl = cleanUrl(reward.image_url);

      if (reward.image_file?.base64) {
        rewardImageUrl = await uploadFileIfExists(
          reward.image_file,
          `${projectId}_reward_${rewardIndex + 1}.webp`,
        );
      }

      batch.set(adminDb.collection("rewards").doc(rewardId), {
        id: rewardId,
        project_id: projectId,
        min_amount: Number(reward.min_amount || reward.price || 0),
        price: Number(reward.price || reward.min_amount || 0),
        title: reward.title || "",
        description: reward.description || "",
        image_url: rewardImageUrl,
        created_at: now,
      });

      const items = Array.isArray(reward.items) ? reward.items : [];

      for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
        const item = items[itemIndex];

        const itemId = `${rewardId}_I${String(itemIndex + 1).padStart(3, "0")}`;

        batch.set(adminDb.collection("rewarditems").doc(itemId), {
          id: itemId,
          reward_id: rewardId,
          item_name: item.item_name || "",
          qty: Number(item.qty || 1),
          has_option: Number(item.has_option ? 1 : 0),
          option_name: item.option_name || "",
          active: item.active === undefined ? 1 : Number(item.active ? 1 : 0),
        });

        const options = Array.isArray(item.options) ? item.options : [];

        for (let optionIndex = 0; optionIndex < options.length; optionIndex++) {
          const option = options[optionIndex];

          const optionId = `${itemId}_O${String(optionIndex + 1).padStart(
            3,
            "0",
          )}`;

          batch.set(adminDb.collection("rewarditemoptions").doc(optionId), {
            id: optionId,
            reward_item_id: itemId,
            option_name: option.option_name || item.option_name || "",
            option_value: option.option_value || "",
            sort_order: Number(option.sort_order || optionIndex + 1),
            active:
              option.active === undefined ? 1 : Number(option.active ? 1 : 0),
          });
        }
      }
    }

    await batch.commit();

    return NextResponse.json({
      success: true,
      message: "Project created successfully",
      project_id: projectId,
      id: projectId,
    });
  } catch (err: any) {
    console.error("create firebase project error:", err);

    return NextResponse.json(
      {
        success: false,
        message: err?.message || "Create project failed",
      },
      { status: 500 },
    );
  }
}