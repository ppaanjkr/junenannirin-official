import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const [pollSnap, teamsSnap] = await Promise.all([
      adminDb.collection("team_poll").get(),
      adminDb.collection("teams").get(),
    ]);

    const teamMap: Record<string, any> = {};

    teamsSnap.docs.forEach((doc) => {
      const team = doc.data();

      const value = String(team.value || "").trim();

      if (!value) return;

      teamMap[value] = team;
    });

    const rows = pollSnap.docs
      .map((doc) => doc.data())
      .filter((row: any) => String(row.team || "").trim() !== "");

    const total = rows.reduce(
      (sum: number, row: any) => sum + Number(row.active_count || 0),
      0,
    );

    const data = rows.map((row: any) => {
      const teamInfo = teamMap[row.team] || {};

      return {
        team: row.team,
        label: teamInfo.label || row.team,
        image_url: teamInfo.image_url || "",
        count: Number(row.active_count || 0),
        percent:
          total > 0
            ? Number(((Number(row.active_count || 0) / total) * 100).toFixed(2))
            : 0,
      };
    });

    return NextResponse.json({
      success: true,
      total,
      data,
    });
  } catch (err: any) {
    console.error("team poll error:", err);

    return NextResponse.json(
      {
        success: false,
        message: err?.message || "Get team poll failed",
      },
      {
        status: 500,
      },
    );
  }
}
