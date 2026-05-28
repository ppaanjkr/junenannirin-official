import { NextRequest, NextResponse } from "next/server";
import { checkUser } from "@/lib/firebase/user";
import { signAccessToken } from "@/lib/auth/jwt";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function decodeJwtPayload(idToken: string) {
  const base64 = idToken.split(".")[1];

  return JSON.parse(Buffer.from(base64, "base64").toString());
}

export async function GET(req: NextRequest) {
  try {
    const LINE_API_TOKEN = process.env.NEXT_PUBLIC_LINE_API_TOKEN!;
    const LINE_API_CALLBACKURL = process.env.NEXT_PUBLIC_LINE_API_CALLBACKURL!;
    const LINE_CLIENT_ID = process.env.NEXT_PUBLIC_LINE_CLIENT_ID!;
    const LINE_CLIENT_SECRET = process.env.LINE_CLIENT_SECRET!;

    const code = req.nextUrl.searchParams.get("code");

    if (!code) {
      return NextResponse.redirect(
        new URL(`/project?error=line_code`, req.url),
      );
    }

    const tokenRes = await fetch(LINE_API_TOKEN, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: LINE_API_CALLBACKURL,
        client_id: LINE_CLIENT_ID,
        client_secret: LINE_CLIENT_SECRET,
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok || !tokenData.id_token) {
      console.error("LINE token error:", tokenData);

      return NextResponse.redirect(
        new URL(`/project?error=line_token`, req.url),
      );
    }

    const payload = decodeJwtPayload(tokenData.id_token);
    const lineUserId = payload.sub;

    return NextResponse.json({
      success: true,
      step: "decoded_line_user",
      payload,
      lineUserId,
    });

    // if (!lineUserId) {
    //   return NextResponse.redirect(
    //     new URL(`/project?error=line_user`, req.url),
    //   );
    // }

    // const userDataFromDb = await checkUser(lineUserId);

    // const userObj = {
    //   uuid: userDataFromDb.user?.uuid || "",
    //   lineUserId,
    //   username: userDataFromDb.user?.username || "",
    //   phone: userDataFromDb.user?.phone || "",
    //   team: userDataFromDb.user?.team || "",
    //   name: userDataFromDb.user?.name || "",
    //   address: userDataFromDb.user?.address || "",
    //   status: userDataFromDb.status,
    //   active: Number(userDataFromDb.user?.active || 0),
    //   expireAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
    // };

    // if (userDataFromDb.status === "EXIST" && userObj.active === 0) {
    //   return NextResponse.redirect(
    //     new URL(`/project?error=inactive`, req.url),
    //   );
    // }

    // let redirectPath = "";

    // if (userDataFromDb.status === "NEW") {
    //   const userData = encodeURIComponent(JSON.stringify(userObj));
    //   redirectPath = `/register?user=${userData}`;
    // } else {
    //   const accessToken = await signAccessToken({
    //     uuid: userObj.uuid,
    //     lineUserId: userObj.lineUserId,
    //     username: userObj.username,
    //     team: userObj.team,
    //     active: userObj.active,
    //   });

    //   const userData = encodeURIComponent(JSON.stringify(userObj));
    //   const tokenDataEncoded = encodeURIComponent(accessToken);

    //   redirectPath = `/project?user=${userData}&token=${tokenDataEncoded}`;
    // }

    // return NextResponse.redirect(new URL(redirectPath, req.url));
  } catch (err: any) {
    console.error("LINE callback error:", err);

    return NextResponse.json(
      {
        success: false,
        message: err?.message || "LINE callback failed",
        stack: err?.stack,
      },
      { status: 500 },
    );

    // return NextResponse.redirect(
    //   new URL(`/project?error=line_callback`, req.url),
    // );
  }
}
