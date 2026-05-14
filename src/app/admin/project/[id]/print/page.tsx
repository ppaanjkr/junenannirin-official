"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem("print_labels");

    if (raw) {
      setOrders(JSON.parse(raw));
    }
  }, []);

  useEffect(() => {
    if (orders.length === 0) return;

    const timer = setTimeout(() => {
      window.print();
    }, 500);
    return () => clearTimeout(timer);
  }, [orders]);

  return (
    <main className="p-4 bg-white min-h-screen">
      <div className="grid grid-cols-2">
        {orders.map((item) => (
          <div
            key={item.user.uuid}
            className=" border p-3 min-h-[150px] break-words flex flex-col justify-start "
          >
            <div className="text-base">Name: {item.user.name ?? "-"}</div>

            <div className=" mt-1 text-base">Tel: {item.user.phone ?? "-"}</div>

            <div className="mt-1 whitespace-pre-wrap text-base leading-7 ">
              Address: {item.user.address ?? "-"}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
