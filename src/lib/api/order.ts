function getAccessToken() {
  if (typeof window === "undefined") return "";

  return localStorage.getItem("accessToken") || "";
}

function authHeaders() {
  const token = getAccessToken();

  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function createOrder(payload: any) {
  const res = await fetch("/api/firebase/order/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    cache: "no-store",
    body: JSON.stringify(payload),
  });

  return res.json();
}