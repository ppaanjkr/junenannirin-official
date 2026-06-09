"use client";

import { formatThaiDateWithTime } from "@/lib/formatThaiDate";
import { formatFirestoreTimestamp } from "@/lib/workUtils";
import { CircleCheck } from "lucide-react";

type Props = {
  data: any[];
  onCheckIn: (participant: any) => void;
};

export default function EventTable({ data, onCheckIn }: Props) {
  return (
    <div className="hidden md:block overflow-x-auto rounded-lg border border-pinkAccent bg-white">
      <table className="w-full text-sm">
        <thead className="bg-pinkAccent/40">
          <tr>
            <th className="text-center p-2 w-[80px]">Queue</th>
            <th className="text-left p-2">Name</th>
            <th className="text-left p-2">Username</th>
            <th className="text-left p-2">Phone</th>
            <th className="text-left p-2">X</th>
            <th className="text-center p-2 w-[150px]">Check-in</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item, rowIndex: number) => {
            return (
              <tr
                key={`${item.id}_${item.queue}_${rowIndex}`}
                className={`border-t}`}
              >
                <td className="p-2 align-top text-center flex gap-2 justify-center">
                  {item.checked_in ? (
                    <CircleCheck className="text-green-600 w-5 h-5" />
                  ) : (
                    ""
                  )}
                  {item.queue}
                </td>
                <td className="p-2 align-top">{item.full_name}</td>
                <td className="p-2 align-top">{item.username}</td>
                <td className="p-2 align-top">
                  {item.phone || item.app_phone || "-"}
                </td>
                <td className="p-2 align-top">{item.twitter || "-"}</td>
                <td className="p-2 align-top text-center">
                  {!item.checked_in ? (
                    <button
                      onClick={() => onCheckIn(item)}
                      className="px-4 py-2 bg-pinkSecondary text-white rounded-lg"
                    >
                      Check-in
                    </button>
                  ) : (
                    <span>{formatFirestoreTimestamp(item.checked_in_at)}</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
