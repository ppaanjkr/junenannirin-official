export async function createAdminOrder(payload: any) {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken")
      : "";

  const res = await fetch(
    "/api/firebase/admin/order/create",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    },
  );

  return res.json();
}