import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

function toIsoDate(value: any) {
  if (!value) return "";

  if (value?.toDate) return value.toDate().toISOString();

  if (value instanceof Date) return value.toISOString();

  return value;
}

export async function GET() {
  try {
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
    return NextResponse.json(
      {
        success: false,
        message: err?.message || "Get admin users failed",
      },
      { status: 500 },
    );
  }
}