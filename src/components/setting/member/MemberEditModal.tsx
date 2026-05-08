"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  open: boolean;
  user: any;
  onClose: () => void;
};

export default function MemberEditModal({
  open,
  user,
  onClose,
}: Props) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (!user) return;

    setForm({
      name: user.name || "",
      phone: user.phone || "",
      address: user.address || "",
    });
  }, [user]);

  if (!open || !user) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* modal */}
      <div className="absolute left-1/2 top-1/2 w-[92%] max-w-md -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl border border-pinkAccent shadow-xl p-5">
        {/* header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg">
            Edit Member
          </h2>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-pinkAccent/20 flex items-center justify-center"
          >
            <X size={16} />
          </button>
        </div>

        {/* form */}
        <div className="space-y-3">
          {/* name */}
          <div>
            <label className="text-sm font-medium">
              Name
            </label>

            <input
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
              className="mt-1 w-full px-3 py-2.5 rounded-xl border border-pinkAccent bg-pinkAccent/10 text-sm"
            />
          </div>

          {/* phone */}
          <div>
            <label className="text-sm font-medium">
              Phone
            </label>

            <input
              value={form.phone}
              onChange={(e) =>
                setForm({
                  ...form,
                  phone: e.target.value,
                })
              }
              className="mt-1 w-full px-3 py-2.5 rounded-xl border border-pinkAccent bg-pinkAccent/10 text-sm"
            />
          </div>

          {/* address */}
          <div>
            <label className="text-sm font-medium">
              Address
            </label>

            <textarea
              rows={3}
              value={form.address}
              onChange={(e) =>
                setForm({
                  ...form,
                  address: e.target.value,
                })
              }
              className="mt-1 w-full px-3 py-2.5 rounded-xl border border-pinkAccent bg-pinkAccent/10 text-sm"
            />
          </div>
        </div>

        {/* actions */}
        <div className="grid grid-cols-12 gap-2 mt-5">
          <button
            onClick={onClose}
            className="col-span-6 py-2.5 rounded-xl border border-pinkAccent text-sm"
          >
            Cancel
          </button>

          <button
            className="col-span-6 py-2.5 rounded-xl bg-pinkSecondary text-white text-sm font-medium"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}