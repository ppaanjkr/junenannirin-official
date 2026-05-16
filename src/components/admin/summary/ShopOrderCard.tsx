"use client";

import { formatTHB } from "@/lib/formatTHB";
import { House, Phone, UserRound } from "lucide-react";

type Props = {
  item: any;
  editedRows: any;
  handleChange: (shipmentId: string, field: string, value: string) => void;
  handleSave: (item: any) => void;
};

function buildItemSummary(orders: any[] = []) {
  const summaryMap: Record<
    string,
    {
      item_name: string;
      has_size: number;
      selected_size: string;
      qty: number;
    }
  > = {};

  orders.forEach((order) => {
    const details = Array.isArray(order.details) ? order.details : [];

    details.forEach((detail: any) => {
      const itemName = String(detail.item_name || "").trim();
      const hasSize = Number(detail.has_size) === 1 ? 1 : 0;
      const selectedSize = hasSize
        ? String(detail.selected_size || "").trim().toUpperCase()
        : "";

      if (!itemName) return;

      const key = hasSize
        ? `${itemName}_${selectedSize}`
        : `${itemName}_nosize`;

      if (!summaryMap[key]) {
        summaryMap[key] = {
          item_name: itemName,
          has_size: hasSize,
          selected_size: selectedSize,
          qty: 0,
        };
      }

      summaryMap[key].qty += Number(detail.qty || 0);
    });
  });

  const sizeOrder = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];

  return Object.values(summaryMap).sort((a, b) => {
    const nameCompare = a.item_name.localeCompare(b.item_name);
    if (nameCompare !== 0) return nameCompare;

    const aIndex = sizeOrder.indexOf(a.selected_size);
    const bIndex = sizeOrder.indexOf(b.selected_size);

    if (aIndex === -1 && bIndex === -1) {
      return a.selected_size.localeCompare(b.selected_size);
    }

    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;

    return aIndex - bIndex;
  });
}

function ItemSummary({ orders }: { orders: any[] }) {
  const summary = buildItemSummary(orders);

  if (summary.length === 0) return null;

  return (
    <div className="mt-4">
      <div className="font-semibold text-sm mb-2">Summary</div>

      <div className="flex flex-col gap-1">
        {summary.map((detail, index) => (
          <div
            key={`${detail.item_name}_${detail.selected_size || "nosize"}_${index}`}
            className="flex justify-between gap-2 text-xs rounded-lg border border-pinkAccent/50 bg-white px-3 py-2"
          >
            <span className="truncate">
              {detail.item_name}
              {Number(detail.has_size) === 1 && (
                <> {String(detail.selected_size || "-").toUpperCase()}</>
              )}
            </span>

            <span className="font-semibold whitespace-nowrap">
              x{Number(detail.qty || 0)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ShopOrderCard({
  item,
  editedRows,
  handleChange,
  handleSave,
}: Props) {
  const edited = editedRows[item.shipment.id] || {};
  const orders = Array.isArray(item.orders) ? item.orders : [];

  return (
    <div
      className={` rounded-xl border bg-white p-4 shadow-sm ${
        item.shipment?.tracking_no ? "border-gray-200" : "border-pinkAccent"
      } `}
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
          {orders.map((o: any) => (
            <div
              key={o.reward_id}
              className="flex justify-between text-sm rounded-lg bg-pinkAccent/30 px-3 py-2"
            >
              <span className="truncate">{o.title}</span>
              <span className="font-semibold whitespace-nowrap">
                x{o.qty}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* SUMMARY */}
      <ItemSummary orders={orders} />

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
            type="text"
            placeholder="Tracking No."
            className="w-full border border-pinkAccent rounded-lg px-3 py-2 outline-none"
            value={edited.tracking_no ?? item.shipment.tracking_no ?? ""}
            onChange={(e) =>
              handleChange(item.shipment.id, "tracking_no", e.target.value)
            }
          />
        </div>

        <div className="col-span-12">
          <select
            name="carrier"
            id="carrier"
            className="w-full border border-pinkAccent rounded-lg px-3 py-2 outline-none"
            value={edited.carrier ?? item.shipment.carrier ?? ""}
            onChange={(e) =>
              handleChange(item.shipment.id, "carrier", e.target.value)
            }
          >
            <option value="">Select Carrier</option>
            <option value="Thailand Post">Thailand Post</option>
            <option value="Kerry">Kerry</option>
            <option value="Flash">Flash</option>
            <option value="J&T">J&T</option>
          </select>
        </div>

        <div className="col-span-12">
          <button
            className="w-full rounded-lg bg-pinkSecondary text-white py-2 font-medium"
            onClick={() => handleSave(item)}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}