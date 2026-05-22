import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import {
  deleteFileFromDriveByUrl,
  uploadImageToDrive,
} from "@/lib/google/drive";

function cleanUrl(value?: string) {
  if (!value) return "";
  if (String(value).startsWith("blob:")) return "";
  return value;
}

async function uploadFileIfExists(file: any, fileName: string) {
  if (!file?.base64) return "";

  const uploaded = await uploadImageToDrive({
    base64: file.base64,
    fileName: file.fileName || fileName,
  });

  return uploaded.url;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const bank = body.bank || body;

    if (!bank?.id) {
      return NextResponse.json(
        { success: false, message: "bank id is required" },
        { status: 400 },
      );
    }

    if (!bank?.bank_code) {
      return NextResponse.json(
        { success: false, message: "bank_code is required" },
        { status: 400 },
      );
    }

    if (!bank?.account_name) {
      return NextResponse.json(
        { success: false, message: "account_name is required" },
        { status: 400 },
      );
    }

    if (!bank?.account_no) {
      return NextResponse.json(
        { success: false, message: "account_no is required" },
        { status: 400 },
      );
    }

    const bankRef = adminDb.collection("banks").doc(String(bank.id));
    const oldBankSnap = await bankRef.get();

    if (!oldBankSnap.exists) {
      return NextResponse.json(
        { success: false, message: "Bank not found" },
        { status: 404 },
      );
    }

    const duplicateSnap = await adminDb
      .collection("banks")
      .where("account_no", "==", String(bank.account_no).trim())
      .get();

    const duplicate = duplicateSnap.docs.some(
      (doc) => String(doc.id) !== String(bank.id),
    );

    if (duplicate) {
      return NextResponse.json({
        success: false,
        message: "Account number already exists",
      });
    }

    let qrcodeUrl = cleanUrl(bank.qrcode);

    if (bank.qrcode_file?.base64) {
      qrcodeUrl = await uploadFileIfExists(
        bank.qrcode_file,
        `${bank.id}_bank_qr.webp`,
      );
    }

    const updateData = {
      bank_code: bank.bank_code || "",
      bank_name: bank.bank_name || "",
      bank_short_name: bank.bank_short_name || "",
      account_name: bank.account_name || "",
      account_name_en: bank.account_name_en || "",
      account_no: String(bank.account_no || ""),
      qrcode: qrcodeUrl,
      active: bank.active === false ? 0 : 1,
      updated_at: FieldValue.serverTimestamp(),
    };

    await bankRef.update(updateData);

    if (bank.delete_qrcode_url) {
      try {
        await deleteFileFromDriveByUrl(bank.delete_qrcode_url);
      } catch (deleteErr) {
        console.error("delete old qrcode failed:", deleteErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Bank updated successfully",
      data: {
        id: bank.id,
        ...updateData,
      },
    });
  } catch (err: any) {
    console.error("update bank error:", err);

    return NextResponse.json(
      {
        success: false,
        message: err?.message || "Update bank failed",
      },
      { status: 500 },
    );
  }
}