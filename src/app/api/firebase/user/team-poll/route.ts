import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const snap = await adminDb.collection("users").get();

    const users = snap.docs.map((doc) => doc.data());

    const activeUsers = users.filter(
      (u: any) =>
        Number(u.active || 0) === 1 &&
        String(u.team || "").trim() !== "" &&
        String(u.team || "").toLowerCase() !== "admin",
    );

    const total = activeUsers.length;

    const teamMap: Record<string, number> = {};

    activeUsers.forEach((user: any) => {
      const team = String(user.team || "").trim();

      if (!teamMap[team]) {
        teamMap[team] = 0;
      }

      teamMap[team]++;
    });

    const data = Object.entries(teamMap)
      .map(([team, count]) => ({
        team,
        count,
        percent:
          total > 0
            ? Number(((count / total) * 100).toFixed(2))
            : 0,
      }))
      .sort((a, b) => b.count - a.count);

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