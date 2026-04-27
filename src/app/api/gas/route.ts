export async function POST(req: Request) {
  const body = await req.json();

  const res = await fetch(process.env.NEXT_PUBLIC_API_URL!, {
    method: "POST",
    body: JSON.stringify(body),
  });

  const data = await res.json();

  return Response.json(data);
}