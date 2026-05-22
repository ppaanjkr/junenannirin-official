import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function toIsoDate(value: any) {
  if (!value) return "";

  if (value?.toDate) return value.toDate().toISOString();

  if (value instanceof Date) return value.toISOString();

  return value;
}

export async function GET() {
  try {
    const snap = await adminDb.collection("projects").get();

    const data = snap.docs.map((doc) => {
      const p = doc.data();

      return {
        id: p.id || doc.id,
        name: p.name || "",
        image_url: p.image_url || "",
        start_date: toIsoDate(p.start_date),
        end_date: toIsoDate(p.end_date),
        current_amount: Number(p.current_amount || 0),
        target_amount: Number(p.target_amount || 0),
        type: p.type || "",
        status: p.status || "",
        sub_status: p.sub_status || "",
        closed_at: toIsoDate(p.closed_at),
        created_at: toIsoDate(p.created_at),
      };
    });

    data.sort(
      (a, b) =>
        new Date(b.created_at || 0).getTime() -
        new Date(a.created_at || 0).getTime(),
    );

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: err?.message || "Get admin projects failed",
      },
      { status: 500 },
    );
  }
}