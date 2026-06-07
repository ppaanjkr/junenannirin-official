import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { getBearerToken, verifyAccessToken } from "@/lib/auth/jwt";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function requireAdmin(req: NextRequest) {
  const token = getBearerToken(req);

  const auth = await verifyAccessToken(token);

  if (
    !auth?.uuid ||
    Number(auth.active || 0) !== 1 ||
    auth.team !== "admin"
  ) {
    return null;
  }

  return auth;
}

export async function GET(
  req: NextRequest,
) {
  try {
    const auth =
      await requireAdmin(req);

    if (!auth) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const [teamsSnap, teamPollSnap] =
      await Promise.all([
        adminDb
          .collection("teams")
          .get(),

        adminDb
          .collection("team_poll")
          .get(),
      ]);

    const teamPollMap: Record<string,any> = {};

    teamPollSnap.docs.forEach(
      (doc) => {
        const data = doc.data();

        const team = String(data.team || "").trim();

        if (!team) return;

        teamPollMap[team] = data;
      },
    );

    const teams =
      teamsSnap.docs.map(
        (doc) => {
          const data = doc.data();

          const value = String(data.value || "").trim();

          const poll = teamPollMap[value] || {};

          return {
            docId: doc.id,
            id: data.id || doc.id,
            value,
            label: data.label || "",
            image_url: data.image_url || "",
            show_in_register: Boolean(data.show_in_register),
            active: Number(data.active ?? 1),
            member_count: Number(poll.count || 0),
            active_member_count: Number(poll.active_count || 0),
            created_at: data.created_at || null,
            updated_at: data.updated_at || null
          };
        },
      );

    teams.sort(
      (a, b) => String(a.label).localeCompare(String(b.label))
    );

    return NextResponse.json({
      success: true,
      data: teams,
    });
  } catch (err: any) {
    console.error(
      "get team list error:",
      err,
    );

    return NextResponse.json(
      {
        success: false,
        message: err?.message || "Get team list failed",
      },
      {
        status: 500,
      },
    );
  }
}