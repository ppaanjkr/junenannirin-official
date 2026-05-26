import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import { uploadImageToDrive } from "@/lib/google/drive";
import { getBearerToken, verifyAccessToken } from "@/lib/auth/jwt";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function cleanUrl(value?: string) {
  if (!value) return "";
  if (String(value).startsWith("blob:")) return "";
  return String(value).trim();
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
    const bank = body.bank || body;

    const bankCode = String(bank?.bank_code || "").trim();
    const bankName = String(bank?.bank_name || "").trim();
    const bankShortName = String(bank?.bank_short_name || "").trim();
    const accountName = String(bank?.account_name || "").trim();
    const accountNameEn = String(bank?.account_name_en || "").trim();
    const accountNo = String(bank?.account_no || "").trim();

    if (!bankCode) {
      return NextResponse.json(
        { success: false, message: "bank_code is required" },
        { status: 400 },
      );
    }

    if (!accountName) {
      return NextResponse.json(
        { success: false, message: "account_name is required" },
        { status: 400 },
      );
    }

    if (!accountNo) {
      return NextResponse.json(
        { success: false, message: "account_no is required" },
        { status: 400 },
      );
    }

    const duplicateSnap = await adminDb
      .collection("banks")
      .where("account_no", "==", accountNo)
      .limit(1)
      .get();

    if (!duplicateSnap.empty) {
      return NextResponse.json(
        {
          success: false,
          message: "Account number already exists",
        },
        { status: 409 },
      );
    }

    const bankId = await generateBankId();

    let qrcodeUrl = cleanUrl(bank.qrcode);

    if (bank.qrcode_file?.base64) {
      qrcodeUrl = await uploadFileIfExists(
        bank.qrcode_file,
        `${bankId}_bank_qr.webp`,
      );
    }

    const now = FieldValue.serverTimestamp();

    const data = {
      id: bankId,
      bank_code: bankCode,
      bank_name: bankName,
      bank_short_name: bankShortName,
      account_name: accountName,
      account_name_en: accountNameEn,
      account_no: accountNo,
      qrcode: qrcodeUrl,
      active: bank.active === false || Number(bank.active) === 0 ? 0 : 1,
      created_at: now,
      created_by: auth.uuid,
      updated_at: now,
      updated_by: auth.uuid,
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