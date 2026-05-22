import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import { uploadImageToDrive } from "@/lib/google/drive";

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

async function generateBankId() {
  const snap = await adminDb.collection("banks").get();

  let maxNo = 0;

  snap.docs.forEach((doc) => {
    const id = String(doc.data().id || doc.id || "");

    if (!id.startsWith("B")) return;

    const no = Number(id.replace("B", ""));

    if (!isNaN(no) && no > maxNo) {
      maxNo = no;
    }
  });

  return `B${String(maxNo + 1).padStart(3, "0")}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const bank = body.bank || body;

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

    const duplicateSnap = await adminDb
      .collection("banks")
      .where("account_no", "==", String(bank.account_no).trim())
      .limit(1)
      .get();

    if (!duplicateSnap.empty) {
      return NextResponse.json({
        success: false,
        message: "Account number already exists",
      });
    }

    const bankId = await generateBankId();

    let qrcodeUrl = cleanUrl(bank.qrcode);

    if (bank.qrcode_file?.base64) {
      qrcodeUrl = await uploadFileIfExists(
        bank.qrcode_file,
        `${bankId}_bank_qr.webp`,
      );
    }

    const data = {
      id: bankId,
      bank_code: bank.bank_code || "",
      bank_name: bank.bank_name || "",
      bank_short_name: bank.bank_short_name || "",
      account_name: bank.account_name || "",
      account_name_en: bank.account_name_en || "",
      account_no: String(bank.account_no || ""),
      qrcode: qrcodeUrl,
      active: bank.active === false ? 0 : 1,
      created_at: FieldValue.serverTimestamp(),
      updated_at: FieldValue.serverTimestamp(),
    };

    await adminDb.collection("banks").doc(bankId).set(data);

    return NextResponse.json({
      success: true,
      message: "Bank created successfully",
      data,
    });
  } catch (err: any) {
    console.error("create bank error:", err);

    return NextResponse.json(
      {
        success: false,
        message: err?.message || "Create bank failed",
      },
      { status: 500 },
    );
  }
}