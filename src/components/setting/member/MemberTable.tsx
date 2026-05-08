"use client";

import { Pencil } from "lucide-react";
import ActiveToggle from "./ActiveToggle";

export default function MemberTable({
  users,
  onEdit,
}: {
  users: any[];
  onEdit: (user: any) => void;
}) {
  return (
    <section className="hidden md:block bg-white rounded-2xl border border-pinkAccent shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-pinkAccent/20 text-textMain">
          <tr className="text-left">
            <th className="px-4 py-3 font-semibold">
              Name
            </th>

            <th className="px-4 py-3 font-semibold">
              Phone
            </th>

            <th className="px-4 py-3 font-semibold">
              Team
            </th>

            <th className="px-4 py-3 font-semibold">
              Status
            </th>

            <th className="px-4 py-3 font-semibold text-right">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {users.map((item) => (
            <tr
              key={item.uuid}
              className="border-t border-pinkAccent/30 hover:bg-pinkAccent/10 transition"
            >
              <td className="px-4 py-3">
                <div>
                  <p className="font-medium">
                    {item.name}
                  </p>

                  <p className="text-xs text-textSub">
                    @{item.username}
                  </p>
                </div>
              </td>

              <td className="px-4 py-3">
                {item.phone}
              </td>

              <td className="px-4 py-3">
                <span className="px-2 py-1 rounded-full bg-pinkAccent/30 text-pinkSecondary text-xs">
                  {item.team || "-"}
                </span>
              </td>

              <td className="px-4 py-3">
                <ActiveToggle active={item.active} />
              </td>

              <td className="px-4 py-3">
                <div className="flex justify-end">
                  <button onClick={() => onEdit(item)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-pinkAccent/40 hover:bg-pinkAccent/60 text-pinkSecondary text-xs font-semibold">
                    <Pencil size={14} />
                    Edit
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}