"use client";

import { formatTHB } from "@/lib/formatTHB";
import { House, Phone, UserRound } from "lucide-react";

type Props = {
  item: any;
  editedRows: any;
  handleChange: (shipmentId: string, field: string, value: string) => void;
  handleSave: (item: any) => void;
};

export default function ShopOrderCard({
  item,
  editedRows,
  handleChange,
  handleSave,
}: Props) {
  const edited = editedRows[item.shipment.id] || {};

  return (
    <div
      className={` rounded-xl border bg-white p-4 shadow-sm ${item.shipment?.tracking_no ? "border-gray-200" : "border-pinkAccent"} `}
    >
      <div className="flex justify-between items-start gap-3">
        <span className="font-semibold text-lg">{item.user.username}</span>
      </div>
      <div className="mt-2 text-sm flex flex-col gap-1">
        <span className="flex gap-2 items-center">
          <UserRound className="w-4 h-4" />
          {item.user.name || "-"}
        </span>
        <span className="flex gap-2 items-center">
          <Phone className="w-4 h-4" />
          {item.user.phone || "-"}
        </span>
        <span className="flex gap-2 items-center">
          <House className="w-4 h-4" />
          {item.user.address || "-"}
        </span>
      </div>

      {/* ORDERS */}
      <div className="mt-4">
        <div className="font-semibold text-sm mb-2">Orders</div>

        <div className="flex flex-col gap-1">
          {item.orders.map((o: any) => (
            <div
              key={o.reward_id}
              className=" flex justify-between text-sm rounded-lg bg-pinkAccent/30 px-3 py-2 "
            >
              <span>{o.title}</span>
              <span className="font-semibold">x{o.qty}</span>
            </div>
          ))}
        </div>
      </div>

      {/* TOTAL */}
      <div className="mt-4 flex justify-between items-center">
        <span className="text-sm font-semibold">Total</span>

        <span className="font-bold text-pinkSecondary text-lg">
          ฿ {formatTHB(item.total_amount)}
        </span>
      </div>

      {/* SHIPPING */}
      <div className="mt-4 grid grid-cols-12 gap-2">
        <div className="col-span-12">
          <input
            disabled
            type="text"
            placeholder="Tracking No."
            className=" w-full border border-pinkAccent rounded-lg px-3 py-2 outline-none "
            value={edited.tracking_no ?? item.shipment.tracking_no ?? ""}
            onChange={(e) =>
              handleChange(item.shipment.id, "tracking_no", e.target.value)
            }
          />
        </div>

        <div className="col-span-12">
          <input
            disabled
            type="text"
            placeholder="Carrier"
            className=" w-full border border-pinkAccent rounded-lg px-3 py-2 outline-none "
            value={edited.carrier ?? item.shipment.carrier ?? ""}
            onChange={(e) =>
              handleChange(item.shipment.id, "carrier", e.target.value)
            }
          />
        </div>

        <div className="col-span-12">
          <button
            disabled
            className=" w-full rounded-lg bg-pinkSecondary text-white py-2 font-medium "
            onClick={() => handleSave(item)}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
