"use client";

import { formatTHB } from "@/lib/formatTHB";
import { House, Phone, Save, UserRound } from "lucide-react";

type Props = {
  data: any[];
  editedRows: any;
  handleChange: any;
  handleSave: any;
};

export default function ShopOrderTable({
  data,
  editedRows,
  handleChange,
  handleSave,
}: Props) {
  return (
    <div className="hidden md:block overflow-x-auto rounded-xl border border-pinkAccent bg-white">
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
            const edited = editedRows[item.shipment.id] || {};

            return (
              <tr key={item.user.uuid} className="border-t">
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
                <td className="p-2 align-top w-[180px]">
                  <div className="flex flex-col gap-1">
                    {item.orders.map((o: any) => (
                      <div
                        key={o.reward_id}
                        className=" flex justify-between gap-2 "
                      >
                        <span className=" break-words ">{o.title}</span>
                        <span className=" shrink-0 ">x{o.qty}</span>
                      </div>
                    ))}
                  </div>
                </td>

                {/* TOTAL */}
                <td className=" p-2 align-top font-semibold text-pinkSecondary whitespace-nowrap w-[100px] ">
                  ฿ {formatTHB(item.total_amount)}
                </td>

                {/* SHIPPING */}
                <td className="p-2 align-top w-[260px]">
                  <div className=" flex flex-col gap-2 ">
                    <input
                      disabled
                      type="text"
                      placeholder="Tracking No"
                      className=" border border-pinkAccent rounded-lg px-3 py-2 outline-none w-full "
                      value={
                        edited.tracking_no ?? item.shipment.tracking_no ?? ""
                      }
                      onChange={(e) =>
                        handleChange(
                          item.shipment.id,
                          "tracking_no",
                          e.target.value,
                        )
                      }
                    />

                    <div className=" flex gap-2 ">
                      <input
                        disabled
                        type="text"
                        placeholder="Carrier"
                        className=" border border-pinkAccent rounded-lg px-3 py-2 outline-none flex-1 min-w-0 "
                        value={edited.carrier ?? item.shipment.carrier ?? ""}
                        onChange={(e) =>
                          handleChange(
                            item.shipment.id,
                            "carrier",
                            e.target.value,
                          )
                        }
                      />
                      <button
                        disabled
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
