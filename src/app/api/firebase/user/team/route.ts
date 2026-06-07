import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const snap = await adminDb
      .collection("teams")
      .where("active", "==", 1)
      .where("show_in_register", "==", true)
      .get();

    const data = snap.docs
      .map((doc) => {
        const team = doc.data();

        return {
          value: team.value || "",
          label: team.label || "",
          image_url: team.image_url || "",
        };
      })
      .sort((a, b) => String(a.label).localeCompare(String(b.label)));

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (err: any) {
    console.error("team list error", err);

    return NextResponse.json(
      {
        success: false,
        message: err?.message || "Get teams failed",
      },
      {
        status: 500,
      },
    );
  }
}
