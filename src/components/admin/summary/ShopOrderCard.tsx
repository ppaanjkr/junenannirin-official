"use client";

import { formatTHB } from "@/lib/formatTHB";
import { House, Phone, UserRound } from "lucide-react";

type Props = {
  item: any;
  editedRows: any;
  handleChange: (shipmentId: string, field: string, value: string) => void;
  handleSave: (item: any) => void;
};

function formatOptionName(optionName: string) {
  const value = String(optionName || "").trim();

  if (!value) return "";

  return value.charAt(0).toUpperCase() + value.slice(1);
}

function buildItemSummary(orders: any[] = []) {
  const summaryMap: Record<
    string,
    {
      item_name: string;
      option_name: string;
      selected_option: string;
      qty: number;
    }
  > = {};

  orders.forEach((order) => {
    const items = Array.isArray(order.items) ? order.items : [];

    items.forEach((item: any) => {
      const details = Array.isArray(item.details) ? item.details : [];

      details.forEach((detail: any) => {
        const itemName = String(detail.item_name || "").trim();

        const optionName = String(
          detail.option_name || (detail.selected_size ? "size" : ""),
        ).trim();

        const selectedOption = String(
          detail.selected_option || detail.selected_size || "",
        )
          .trim()
          .toUpperCase();

        if (!itemName) return;

        const key = [
          itemName,
          optionName || "no_option",
          selectedOption || "no_value",
        ].join("_");

        if (!summaryMap[key]) {
          summaryMap[key] = {
            item_name: itemName,
            option_name: optionName,
            selected_option: selectedOption,
            qty: 0,
          };
        }

        summaryMap[key].qty += Number(detail.qty || 0);
      });
    });
  });

  const optionOrder = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];

  return Object.values(summaryMap).sort((a, b) => {
    const nameCompare = a.item_name.localeCompare(b.item_name);
    if (nameCompare !== 0) return nameCompare;

    const optionNameCompare = a.option_name.localeCompare(b.option_name);
    if (optionNameCompare !== 0) return optionNameCompare;

    const aIndex = optionOrder.indexOf(a.selected_option);
    const bIndex = optionOrder.indexOf(b.selected_option);

    if (aIndex === -1 && bIndex === -1) {
      return a.selected_option.localeCompare(b.selected_option);
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
    <div className="mt-2 border-t border-pinkAccent/40 pt-2 text-sm">
      <div className="font-semibold mb-1 text-pinkSecondary">Summary</div>

      <div className="flex flex-col gap-1">
        {summary.map((detail, index) => {
          const hasOption =
            detail.option_name.trim() !== "" &&
            detail.selected_option.trim() !== "";

          return (
            <div
              key={`${detail.item_name}_${detail.option_name || "option"}_${detail.selected_option || "value"}_${index}`}
              className="flex justify-between gap-2 rounded-md bg-pinkAccent/20 px-2 py-1"
            >
              <span className="break-words">
                {detail.item_name}
                {hasOption && (
                  <>
                    {" "}
                    ({formatOptionName(detail.option_name)}{" "}
                    {String(detail.selected_option).toUpperCase()})
                  </>
                )}
              </span>

              <span className="font-semibold whitespace-nowrap">
                x{Number(detail.qty || 0)}
              </span>
            </div>
          );
        })}
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
  const shipmentId = String(item.shipment?.id || "");
  const edited = editedRows[shipmentId] || {};
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
        {/* <div className="font-semibold text-sm mb-2">Orders</div> */}

        <div className="flex flex-col gap-3">
          {/* SUMMARY */}
          <ItemSummary orders={orders} />
          {orders.map((order: any) => (
            <div
              key={order.order_id}
              className="rounded-lg border border-pinkAccent/40 p-3 text-sm"
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold">{order.order_id}</span>

                <span className="font-semibold">
                  ฿ {formatTHB(order.transaction_amount || 0)}
                </span>
              </div>

              <div className="text-xs text-textSub mt-1">
                Ref : {order.trans_ref || "-"}
              </div>

              <div className="mt-2 flex flex-col gap-1">
                {(order.items || []).map((item: any) => (
                  <div
                    key={`${order.order_id}_${item.reward_id}`}
                    className="flex justify-between text-sm"
                  >
                    <span>{item.title}</span>
                    <span className="font-medium">x{item.qty}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TOTAL */}
      <div className="mt-4 flex justify-between items-center">
        <span className="text-md font-semibold">Total</span>

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
              handleChange(shipmentId, "tracking_no", e.target.value)
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
              handleChange(shipmentId, "carrier", e.target.value)
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
