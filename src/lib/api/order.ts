export async function createOrder(payload: any) {
  const res = await fetch("/api/firebase/order/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return res.json();
}