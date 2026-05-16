"use client";

import { formatTHB } from "@/lib/formatTHB";
import { House, Phone, Save, UserRound } from "lucide-react";

type Props = {
  data: any[];
  editedRows: any;
  handleChange: any;
  handleSave: any;
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
        ? String(detail.selected_size || "")
            .trim()
            .toUpperCase()
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
    <div className="mt-2 border-t border-pinkAccent/40 pt-2">
      <div className="font-semibold text-xs mb-1 text-pinkSecondary">
        Summary
      </div>

      <div className="flex flex-col gap-1">
        {summary.map((detail, index) => (
          <div
            key={`${detail.item_name}_${detail.selected_size || "nosize"}_${index}`}
            className="flex justify-between gap-2 text-[11px] rounded-md bg-pinkAccent/20 px-2 py-1"
          >
            <span className="break-words">
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

export default function ShopOrderTable({
  data,
  editedRows,
  handleChange,
  handleSave,
}: Props) {
  return (
    <div className="hidden md:block overflow-x-auto rounded-lg border border-pinkAccent bg-white">
      <table className="w-full text-sm">
        <thead className="bg-pinkAccent/40">
          <tr>
            <th className="text-left p-2">User</th>
            <th className="text-left p-2">Orders</th>
            <th className="text-left p-2">Total</th>
            <th className="text-left p-2">Shipping</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item) => {
            const shipmentId = String(item.shipment?.id || "");
            const edited = editedRows[shipmentId] || {};
            const orders = Array.isArray(item.orders) ? item.orders : [];

            return (
              <tr
                key={item.user.uuid}
                className={`border-t ${editedRows[shipmentId] ? "bg-yellow-50" : ""}`}
              >
                {/* USER */}
                <td className="p-2 align-top w-[220px]">
                  <div className="flex flex-col text-xs text-textSub min-w-0">
                    <div className="font-semibold text-base text-textMain break-words">
                      {item.user.username}
                    </div>
                    <div className="flex gap-1 mt-1 min-w-0">
                      <UserRound className=" w-3 h-3 shrink-0 mt-[2px]" />
                      <span className=" truncate ">
                        {item.user.name || "-"}
                      </span>
                    </div>
                    <div className=" flex gap-1 mt-1  min-w-0 ">
                      <Phone className=" w-3 h-3 shrink-0 mt-[2px] " />
                      <span className=" truncate ">
                        {item.user.phone || "-"}
                      </span>
                    </div>
                    <div className=" flex gap-1 mt-2 min-w-0 ">
                      <House className=" w-3 h-3 shrink-0 mt-[2px] " />
                      <span className=" break-words line-clamp-3 ">
                        {item.user.address || "-"}
                      </span>
                    </div>
                  </div>
                </td>

                {/* ORDERS */}
                <td className="p-2 align-top w-[240px]">
                  <div className="flex flex-col gap-1">
                    {orders.map((o: any) => (
                      <div
                        key={o.reward_id}
                        className="flex justify-between gap-2"
                      >
                        <span className="break-words">{o.title}</span>
                        <span className="shrink-0 font-semibold">x{o.qty}</span>
                      </div>
                    ))}
                  </div>

                  <ItemSummary orders={orders} />
                </td>

                {/* TOTAL */}
                <td className=" p-2 align-top font-semibold text-pinkSecondary whitespace-nowrap w-[100px] ">
                  ฿ {formatTHB(item.total_amount)}
                </td>

                {/* SHIPPING */}
                <td className="p-2 align-top w-[260px]">
                  <div className=" flex flex-col gap-2 ">
                    <input
                      type="text"
                      placeholder="Tracking No"
                      className=" border border-pinkAccent rounded-lg px-3 py-2 outline-none w-full "
                      value={
                        edited.tracking_no ?? item.shipment.tracking_no ?? ""
                      }
                      onChange={(e) =>
                        handleChange(shipmentId, "tracking_no", e.target.value)
                      }
                    />

                    <div className=" flex gap-2 ">
                      <select
                        name="carrier"
                        id="carrier"
                        className="w-full border border-pinkAccent rounded-lg px-3 py-2 outline-none"
                        value={edited.carrier ?? item.shipment.carrier ?? ""}
                        onChange={(e) =>
                          handleChange(shipmentId, "carrier", e.target.value)
                        }
                      >
                        <option value="">Select Carrier</option>
                        <option value="Thailand Post">Thailand Post</option>
                        <option value="Kerry">Kerry</option>
                        <option value="Flash">Flash</option>
                        <option value="J&T">J&T</option>
                      </select>
                      <button
                        className=" w-10 h-10 shrink-0 rounded-lg bg-pinkSecondary text-white flex justify-center items-center hover:opacity-90 transition "
                        onClick={() => handleSave(item)}
                      >
                        <Save className=" w-4 h-4 " />
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
