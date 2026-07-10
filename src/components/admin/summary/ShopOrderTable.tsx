"use client";

import { formatTHB } from "@/lib/formatTHB";
import { House, Phone, Save, UserRound } from "lucide-react";
import { buildItemSummary } from "@/lib/buildItemSummary";

type Props = {
  data: any[];
  editedRows: any;
  handleChange: any;
  handleSave: any;
};

function ItemSummary({ orders }: { orders: any[] }) {
  const summary = buildItemSummary(orders);

  if (summary.length === 0) return null;

  return (
    <div className="mt-2 border-t border-pinkAccent/40 pt-2 text-sm">
      <div className="font-semibold mb-1 text-pinkSecondary">
        Summary
      </div>

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
                    ({detail.option_name}{" "}
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
          {data.map((item, rowIndex: number) => {
            const shipmentId = String(item.shipment?.id || "");
            const edited = editedRows[shipmentId] || {};
            const orders = Array.isArray(item.orders) ? item.orders : [];

            return (
              <tr
                key={`${shipmentId || "shipment"}_${item.user?.uuid || "user"}_${rowIndex}`}
                className={`border-t ${editedRows[shipmentId] ? "bg-yellow-50" : ""}`}
              >
                {/* USER */}
                <td className="p-2 align-top w-[220px]">
                  <div className="flex flex-col text-xs text-textSub min-w-0">
                    <div className="font-semibold text-base text-textMain break-words">
                      {item.user.username}
                    </div>

                    <div className="flex gap-1 mt-1 min-w-0">
                      <UserRound className="w-3 h-3 shrink-0 mt-[2px]" />
                      <span className="truncate">{item.user.name || "-"}</span>
                    </div>

                    <div className="flex gap-1 mt-1 min-w-0">
                      <Phone className="w-3 h-3 shrink-0 mt-[2px]" />
                      <span className="truncate">{item.user.phone || "-"}</span>
                    </div>

                    <div className="flex gap-1 mt-2 min-w-0">
                      <House className="w-3 h-3 shrink-0 mt-[2px]" />
                      <span className="break-words line-clamp-3">
                        {item.user.address || "-"}
                      </span>
                    </div>
                  </div>
                </td>

                {/* ORDERS */}
                <td className="p-2 align-top w-[240px]">
                  <ItemSummary orders={orders} />
                  <div className="flex flex-col gap-3 mt-2 text-sm">
                    {orders.map((order: any) => (
                      <div
                        key={order.order_id}
                        className="border border-pinkAccent/40 rounded-lg p-2"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">
                            {order.order_id}
                          </span>

                          <span className="font-semibold">
                            ฿ {formatTHB(order.transaction_amount || 0)}
                          </span>
                        </div>

                        <span className="text-textSub mt-1 text-xs">
                          Ref : {order.trans_ref || "-"}
                        </span>

                        <div className="mt-2 flex flex-col gap-1">
                          {(order.items || []).map((item: any) => (
                            <div
                              key={`${order.order_id}_${item.reward_id}`}
                              className="flex justify-between gap-2"
                            >
                              <span className="break-words text-sm">{item.title}</span>

                              <span className="shrink-0 font-semibold">
                                x{item.qty}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </td>

                {/* TOTAL */}
                <td className="p-2 align-top font-semibold text-pinkSecondary whitespace-nowrap w-[100px]">
                  ฿ {formatTHB(item.total_amount)}
                </td>

                {/* SHIPPING */}
                <td className="p-2 align-top w-[260px]">
                  <div className="flex flex-col gap-2">
                    <input
                      type="text"
                      placeholder="Tracking No"
                      className="border border-pinkAccent rounded-lg px-3 py-2 outline-none w-full"
                      value={
                        edited.tracking_no ?? item.shipment.tracking_no ?? ""
                      }
                      onChange={(e) =>
                        handleChange(shipmentId, "tracking_no", e.target.value)
                      }
                    />

                    <div className="flex gap-2">
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
                        className="w-10 h-10 shrink-0 rounded-lg bg-pinkSecondary text-white flex justify-center items-center hover:opacity-90 transition"
                        onClick={() => handleSave(item)}
                      >
                        <Save className="w-4 h-4" />
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
