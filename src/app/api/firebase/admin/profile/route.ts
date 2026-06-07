import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { getBearerToken, verifyAccessToken } from "@/lib/auth/jwt";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// async function requireAdmin(req: NextRequest) {
//   const token = getBearerToken(req);
//   const auth = await verifyAccessToken(token);

//   if (!auth?.uuid || Number(auth.active || 0) !== 1 || auth.team !== "admin") {
//     return null;
//   }

//   return auth;
// }

export async function GET(req: NextRequest) {
  try {
    const token =
      getBearerToken(req);

    const auth =
      await verifyAccessToken(
        token,
      );

    if (
      !auth?.uuid ||
      Number(
        auth.active || 0,
      ) !== 1
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const doc = await adminDb
      .collection("settings")
      .doc("system")
      .get();

    const data = doc.exists
      ? doc.data()
      : {
          profile_edit_enabled: true,
          team_edit_enabled: false,
        };

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (err: any) {
    console.error(err);

    return NextResponse.json(
      {
        success: false,
        message:
          err?.message ||
          "Get settings failed",
      },
      {
        status: 500,
      },
    );
  }
}
