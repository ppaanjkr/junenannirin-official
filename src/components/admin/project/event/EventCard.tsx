"use client";

import { formatFirestoreTimestamp } from "@/lib/workUtils";
import { UserRound } from "lucide-react";

type Props = {
  item: any;
  onCheckIn: (participant: any) => void;
};

export default function EventCard({ item, onCheckIn }: Props) {
  return (
    <div
      className={` rounded-xl border bg-white p-4 shadow-sm ${
        item.shipment?.tracking_no ? "border-gray-200" : "border-pinkAccent"
      } `}
    >
      <div className="flex justify-between items-start gap-3">
        <span className="font-semibold text-xl bg-pinkAccent py-2 px-4 rounded-md text-pinkSecondary">
          {item.queue}
        </span>
        {item.checked_in && (
          <span className="py-1 px-3 text-xs bg-green-100 rounded-full text-green-600">
            Checked-in
          </span>
        )}
      </div>

      <div className="mt-2 text-sm flex flex-col gap-1">
        <div className="flex gap-2 items-center mt-1">
          Name:
          <span className="font-semibold">{item.full_name || "-"}</span>
        </div>
        <div className="flex gap-2 items-center">
          Username:
          <span className="font-semibold">{item.username || "-"}</span>
        </div>
        <div className="flex gap-2 items-center">
          Phone:
          <span className="font-semibold">
            {item.phone || item.app_phone || "-"}
          </span>
        </div>
        <div className="flex gap-2 items-center">
          X:
          <span className="font-semibold">{item.twitter || "-"}</span>
        </div>

        {!item.checked_in ? (
          <button
            onClick={() => onCheckIn(item)}
            className="mt-1 px-4 py-2 bg-pinkSecondary text-white rounded-lg"
          >
            Check-in
          </button>
        ) : (
          <div className="flex gap-2 items-center">
            Checked-in:
            <span className="font-semibold">
              {formatFirestoreTimestamp(item.checked_in_at)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
