import { NextRequest, NextResponse } from "next/server";
import { json } from "stream/consumers";

export async function GET(req: NextRequest) {
  const LINE_API_TOKEN = process.env.NEXT_PUBLIC_LINE_API_TOKEN!;
  const LINE_API_CALLBACKURL = process.env.NEXT_PUBLIC_LINE_API_CALLBACKURL!;
  const LINE_CLIENT_ID = process.env.NEXT_PUBLIC_LINE_CLIENT_ID!;
  const LINE_CLIENT_SECRET = process.env.NEXT_PUBLIC_LINE_CLIENT_SECRET!;
  const API_URL = process.env.NEXT_PUBLIC_API_URL!;

  const code = req.nextUrl.searchParams.get("code");

  const tokenRes = await fetch(LINE_API_TOKEN, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code: code!,
      redirect_uri: LINE_API_CALLBACKURL,
      client_id: LINE_CLIENT_ID!,
      client_secret: LINE_CLIENT_SECRET!,
    }),
  });

  const tokenData = await tokenRes.json();

  // id_token
  const payload = JSON.parse(
    Buffer.from(tokenData.id_token.split(".")[1], "base64").toString(),
  );

  const lineUserId = payload.sub;

  // check user
  const gasRes = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: "checkUser",
      lineUserId,
    }),
    cache: "no-store",
  });

  const gasData = await gasRes.json();

  const userObj = {
    uuid: gasData.user?.uuid,
    lineUserId: payload.sub,
    username: gasData.user?.username,
    phone: gasData.user?.phone,
    team: gasData.user?.team,
    name: gasData.user?.name,
    address: gasData.user?.address,
    status: gasData.status,
    active: gasData.user?.active,
    expireAt: Date.now() + 30 * 24 * 60 * 60 * 1000
  };

  const userData = encodeURIComponent(JSON.stringify(userObj));

  if (gasData.status === "EXIST" && gasData.user?.active === 0) {
    return NextResponse.redirect(new URL(`/project?error=inactive`, req.url));
  }

  const redirectPath =
    gasData.status === "NEW"
      ? `/register?user=${userData}`
      : `/project?user=${userData}`;

  return NextResponse.redirect(new URL(redirectPath, req.url));

  // return NextResponse.json(gasData);

}
