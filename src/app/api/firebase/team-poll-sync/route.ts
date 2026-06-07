import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST() {
  try {
    const usersSnap = await adminDb.collection("users").get();

    const teamCounter: Record<
      string,
      {
        count: number;
        active_count: number;
      }
    > = {};

    usersSnap.docs.forEach((doc) => {
      const user = doc.data();

      const team = String(user.team || "").trim();

      const active = Number(user.active ?? 1);

      const teamLower = team.toLowerCase();

      if (!team || teamLower === "admin" || teamLower === "june") {
        return;
      }

      if (!teamCounter[team]) {
        teamCounter[team] = {
          count: 0,
          active_count: 0,
        };
      }

      teamCounter[team].count++;

      if (active === 1) {
        teamCounter[team].active_count++;
      }
    });

    const batch = adminDb.batch();

    Object.entries(teamCounter).forEach(([team, data]) => {
      const teamLower = team.toLowerCase();

      if (teamLower === "admin" || teamLower === "june") {
        return;
      }

      batch.set(adminDb.collection("team_poll").doc(team), {
        team,
        count: data.count,
        active_count: data.active_count,
        updated_at: new Date().toISOString(),
      });
    });

    await batch.commit();

    return NextResponse.json({
      success: true,
      total_team: Object.keys(teamCounter).length,
      data: teamCounter,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err?.message || "sync failed",
      },
      { status: 500 },
    );
  }
}
