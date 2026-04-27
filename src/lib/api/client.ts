const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error: ${text}`);
  }

  return res.json();
}