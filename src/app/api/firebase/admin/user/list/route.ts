import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { getBearerToken, verifyAccessToken } from "@/lib/auth/jwt";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

  return value;
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

    const snap = await adminDb.collection("users").get();

    const users = snap.docs.map((doc) => {
      const u = doc.data();

      return {
        uuid: u.uuid || doc.id,
        name: u.name || "",
        username: u.username || "",
        phone: u.phone || "",
        address: u.address || "",
        team: u.team || "",
        active: Number(u.active || 0),
        created_at: toIsoDate(u.created_at),
      };
    });

    users.sort(
      (a, b) =>
        new Date(b.created_at || 0).getTime() -
        new Date(a.created_at || 0).getTime(),
    );

    return NextResponse.json({
      success: true,
      data: users,
    });
  } catch (err: any) {
    console.error("get admin users error:", err);

    return NextResponse.json(
      {
        success: false,
        message: err?.message || "Get admin users failed",
      },
      { status: 500 },
    );
  }
}