import { adminDb } from "@/lib/firebase/admin";
import {
  deleteFileFromDriveByUrl,
  uploadImageToDrive,
} from "@/lib/google/drive";
import { FieldValue } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";
import { getBearerToken, verifyAccessToken } from "@/lib/auth/jwt";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function cleanUrl(url?: string) {
  if (!url || String(url).startsWith("blob:")) return "";
  return String(url).trim();
}

async function requireAdmin(req: NextRequest) {
  const token = getBearerToken(req);
  const auth = await verifyAccessToken(token);

  if (!auth?.uuid || Number(auth.active || 0) !== 1 || auth.team !== "admin") {
    return null;
  }

  return auth;
}

async function uploadFileIfExists(file: any, fileName: string) {
  if (!file?.base64) return "";

  const uploaded = await uploadImageToDrive({
    base64: file.base64,
    fileName,
  });

  return uploaded.url;
}

async function deleteDriveUrlIfExists(url?: string) {
  if (!url || String(url).startsWith("blob:")) return;

  try {
    await deleteFileFromDriveByUrl(url);
  } catch (err) {
    console.error("delete drive file failed:", err);
  }
}

export async function POST(req: NextRequest) {
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

    const body = await req.json();
    const project = body.project;

    if (!project?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Project id is required",
        },
        { status: 400 },
      );
    }

    const projectId = String(project.id).trim();

    const projectRef = adminDb.collection("projects").doc(projectId);
    const projectSnap = await projectRef.get();

    if (!projectSnap.exists) {
      return NextResponse.json(
        {
          success: false,
          message: "Project not found",
        },
        { status: 404 },
      );
    }

    let projectImageUrl = cleanUrl(project.image_url);

    if (project.image_file?.base64) {
      await deleteDriveUrlIfExists(project.image_delete_url);

      projectImageUrl = await uploadFileIfExists(
        project.image_file,
        `${projectId}_cover.webp`,
      );
    }

    if (!project.image_url && project.image_delete_url) {
      await deleteDriveUrlIfExists(project.image_delete_url);
      projectImageUrl = "";
    }

    const imgMoreUrls: string[] = [];

    for (let i = 0; i < (project.img_more || []).length; i++) {
      const currentUrl = cleanUrl(project.img_more[i]);
      const file = project.img_more_files?.[i];

      if (file?.base64) {
        const uploadedUrl = await uploadFileIfExists(
          file,
          `${projectId}_more_${i + 1}.webp`,
        );

        if (uploadedUrl) {
          imgMoreUrls.push(uploadedUrl);
        }
      } else if (currentUrl) {
        imgMoreUrls.push(currentUrl);
      }
    }

    for (const deleteUrl of project.img_more_delete_urls || []) {
      await deleteDriveUrlIfExists(deleteUrl);
    }

    const batch = adminDb.batch();

    batch.set(
      projectRef,
      {
        id: projectId,
        name: project.name || "",
        description: project.description || "",
        image_url: projectImageUrl,
        img_more: imgMoreUrls,
        start_date: project.start_date || "",
        end_date: project.end_date || "",
        target_amount: Number(project.target_amount || 0),
        current_amount: Number(project.current_amount || 0),
        status: project.status || "draft",
        type: project.type || "donation",
        theme_color: project.theme_color || {
          secondary: "#ff6fa3",
          accent: "#ffe4ec",
        },
        bank_id: project.bank_id || "",
        sub_status: project.sub_status || "",
        updated_at: FieldValue.serverTimestamp(),
        updated_by: auth.uuid,
        event_type: project.event_type || "",
        event_location_name: project.event_location_name || "",
        event_location_url: project.event_location_url || "",
      },
      { merge: true },
    );

    // delete old targets
    const oldTargetsSnap = await adminDb
      .collection("targets")
      .where("project_id", "==", projectId)
      .get();

    oldTargetsSnap.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    const targets = Array.isArray(project.targets) ? project.targets : [];

    for (let index = 0; index < targets.length; index++) {
      const target = targets[index];

      const targetId =
        target.id || `${projectId}_T${String(index + 1).padStart(3, "0")}`;

      let targetImageUrl = cleanUrl(target.image_url);

      if (target.image_file?.base64) {
        await deleteDriveUrlIfExists(target.image_delete_url);

        targetImageUrl = await uploadFileIfExists(
          target.image_file,
          `${projectId}_target_${index + 1}.webp`,
        );
      }

      if (!target.image_url && target.image_delete_url) {
        await deleteDriveUrlIfExists(target.image_delete_url);
        targetImageUrl = "";
      }

      const targetRef = adminDb.collection("targets").doc(targetId);

      batch.set(targetRef, {
        id: targetId,
        project_id: projectId,
        step: Number(target.step || index + 1),
        amount: Number(target.amount || 0),
        title: target.title || "",
        description: target.description || "",
        image_url: targetImageUrl,
        created_at: target.created_at || FieldValue.serverTimestamp(),
        updated_at: FieldValue.serverTimestamp(),
        updated_by: auth.uuid,
      });
    }

    // delete old rewards
    const oldRewardsSnap = await adminDb
      .collection("rewards")
      .where("project_id", "==", projectId)
      .get();

    for (const rewardDoc of oldRewardsSnap.docs) {
      const rewardId = rewardDoc.id;

      const oldItemsSnap = await adminDb
        .collection("reward_items")
        .where("reward_id", "==", rewardId)
        .get();

      oldItemsSnap.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      batch.delete(rewardDoc.ref);
    }

    const rewards = Array.isArray(project.rewards) ? project.rewards : [];

    for (let index = 0; index < rewards.length; index++) {
      const reward = rewards[index];

      const rewardId =
        reward.id || `${projectId}_R${String(index + 1).padStart(3, "0")}`;

      let rewardImageUrl = cleanUrl(reward.image_url);

      if (reward.image_file?.base64) {
        await deleteDriveUrlIfExists(reward.image_delete_url);

        rewardImageUrl = await uploadFileIfExists(
          reward.image_file,
          `${projectId}_reward_${index + 1}.webp`,
        );
      }

      if (!reward.image_url && reward.image_delete_url) {
        await deleteDriveUrlIfExists(reward.image_delete_url);
        rewardImageUrl = "";
      }

      const rewardRef = adminDb.collection("rewards").doc(rewardId);

      batch.set(rewardRef, {
        id: rewardId,
        project_id: projectId,
        title: reward.title || "",
        description: reward.description || "",
        min_amount: Number(reward.min_amount || reward.price || 0),
        price: Number(reward.price || reward.min_amount || 0),
        image_url: rewardImageUrl,
        created_at: reward.created_at || FieldValue.serverTimestamp(),
        updated_at: FieldValue.serverTimestamp(),
        updated_by: auth.uuid,
      });

      const items = Array.isArray(reward.items) ? reward.items : [];

      for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
        const item = items[itemIndex];

        const itemId =
          item.id ||
          `${rewardId}_I${String(itemIndex + 1).padStart(3, "0")}`;

        const itemRef = adminDb.collection("reward_items").doc(itemId);

        batch.set(itemRef, {
          id: itemId,
          reward_id: rewardId,
          project_id: projectId,
          item_name: item.item_name || "",
          qty: Number(item.qty || 1),
          has_option: Number(item.has_option || 0),
          option_name: item.option_name || "",
          options: Array.isArray(item.options) ? item.options : [],
          created_at: item.created_at || FieldValue.serverTimestamp(),
          updated_at: FieldValue.serverTimestamp(),
          updated_by: auth.uuid,
        });
      }
    }

    await batch.commit();

    return NextResponse.json({
      success: true,
      id: projectId,
      project_id: projectId,
    });
  } catch (err: any) {
    console.error("update project error:", err);

    return NextResponse.json(
      {
        success: false,
        message: err.message || "Update project failed",
      },
      { status: 500 },
    );
  }
}