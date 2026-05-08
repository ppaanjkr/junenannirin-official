"use client";

import { Pencil } from "lucide-react";

import ActiveToggle from "./ActiveToggle";

export default function MemberCardList({
  users,
  onEdit,
}: {
  users: any[];
  onEdit: (user: any) => void;
}) {
  return (
    <section className="md:hidden grid grid-cols-12 gap-3">
      {users.map((item) => (
        <div
          key={item.uuid}
          className="col-span-12 bg-white rounded-2xl border border-pinkAccent shadow-sm p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h4 className="font-semibold truncate">
                {item.name}
              </h4>

              <p className="text-sm text-textSub">
                @{item.username}
              </p>

              <p className="text-sm text-textSub">
                {item.phone}
              </p>

              <div className="mt-2">
                <span className="px-2 py-1 rounded-full bg-pinkAccent/30 text-pinkSecondary text-xs">
                  {item.team || "-"}
                </span>
              </div>
            </div>

            <ActiveToggle active={item.active} />
          </div>

          <div className="mt-4 flex justify-end">
            <button onClick={() => onEdit(item)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-pinkAccent/40 hover:bg-pinkAccent/60 text-pinkSecondary text-xs font-semibold">
              <Pencil size={14} />
              Edit
            </button>
          </div>
        </div>
      ))}
    </section>
  );
}