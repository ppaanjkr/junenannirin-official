import { NextRequest, NextResponse } from "next/server";
import { checkUser } from "@/lib/firebase/user";

export async function GET(req: NextRequest) {
  const LINE_API_TOKEN = process.env.NEXT_PUBLIC_LINE_API_TOKEN!;
  const LINE_API_CALLBACKURL = process.env.NEXT_PUBLIC_LINE_API_CALLBACKURL!;
  const LINE_CLIENT_ID = process.env.NEXT_PUBLIC_LINE_CLIENT_ID!;
  const LINE_CLIENT_SECRET = process.env.LINE_CLIENT_SECRET!;

  const code = req.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL(`/project?error=line_code`, req.url));
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
    return NextResponse.redirect(new URL(`/project?error=line_token`, req.url));
  }

  const payload = JSON.parse(
    Buffer.from(tokenData.id_token.split(".")[1], "base64").toString(),
  );

  const lineUserId = payload.sub;

  const userDataFromDb = await checkUser(lineUserId);

  const userObj = {
    uuid: userDataFromDb.user?.uuid,
    lineUserId: payload.sub,
    username: userDataFromDb.user?.username,
    phone: userDataFromDb.user?.phone,
    team: userDataFromDb.user?.team,
    name: userDataFromDb.user?.name,
    address: userDataFromDb.user?.address,
    status: userDataFromDb.status,
    active: userDataFromDb.user?.active,
    expireAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
  };

  const userData = encodeURIComponent(JSON.stringify(userObj));

  if (userDataFromDb.status === "EXIST" && userDataFromDb.user?.active === 0) {
    return NextResponse.redirect(new URL(`/project?error=inactive`, req.url));
  }

  const redirectPath =
    userDataFromDb.status === "NEW"
      ? `/register?user=${userData}`
      : `/project?user=${userData}`;

  return NextResponse.redirect(new URL(redirectPath, req.url));
}