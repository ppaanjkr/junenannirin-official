"use client";

import { updateUserProfile } from "@/lib/api/user";
import { useEffect, useState } from "react";

type Props = {
  user: any;
  setUser: (user: any) => void;
  className?: string;
  setLoading: (loading: boolean) => void;
  setPopup: (popup: any) => void;
};

export default function SectionEditProfile({
  user,
  setUser,
  className = "",
  setLoading,
  setPopup,
}: Props) {
  const [phone, setPhone] = useState(user?.phone || "");

  const [form, setForm] = useState({
    action: "updateUser",
    user_id: user?.uuid || "",
    phone: user?.phone || "",
    name: user?.name || "",
    address: user?.address || "",
  });

  useEffect(() => {
    if (!user) return;

    setPhone(user?.phone || "");

    setForm({
      action: "updateUser",
      user_id: user?.uuid || "",
      phone: user?.phone || "",
      name: user?.name || "",
      address: user?.address || "",
    });
  }, [user]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);

    setPhone(value);

    setForm((prev) => ({
      ...prev,
      phone: value,
    }));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (
      ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key)
    ) {
      return;
    }

    if (!/^\d$/.test(e.key)) {
      e.preventDefault();
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const paste = e.clipboardData.getData("text");

    if (!/^\d{1,10}$/.test(paste)) {
      e.preventDefault();
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    if (form.phone[0] !== "0" || form.phone.length !== 10) {
      setPopup({ open: true, message: "Invalid phone number", type: "error" });
      setLoading(false);
      return;
    }

    try {
      const data = await updateUserProfile(form);

      if (!data.success) {
        setPopup({
          open: true,
          type: "error",
          message: data.message || "Update profile failed",
        });
        return;
      }

      const updatedUser = {
        ...user,
        name: form.name,
        phone: form.phone,
        address: form.address,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      setPopup({
        open: true,
        type: "success",
        message: "Profile updated successfully",
      });
    } catch (err) {
      console.error(err);

      setPopup({
        open: true,
        type: "error",
        message: "Update profile failed",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-white rounded-lg border p-4 shadow-sm mt-4">
      <h2 className="font-semibold mb-4 flex items-center gap-2">
        <span className="w-1.5 h-4 bg-pinkSecondary rounded-full"></span>
        User Profile
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-6">
            <div>
              <span className="font-semibold">Shipping Name</span>
              <span className="text-red-500">*</span>
            </div>
            <input
              type="text"
              id="name"
              className="w-full px-4 py-2 rounded-lg outline-none border border-pinkSecondary/40 mt-1"
              maxLength={50}
              autoComplete="off"
              required
              value={form.name || ""}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
            />
          </div>

          <div className="col-span-12 md:col-span-6">
            <div>
              <span className="font-semibold">Phonenumber</span>
              <span className="text-red-500">*</span>
            </div>
            <input
              type="text"
              id="phone"
              className="w-full px-4 py-2 rounded-lg outline-none border border-pinkSecondary/40 mt-1"
              maxLength={10}
              autoComplete="off"
              required
              value={phone}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              inputMode="numeric"
            />
          </div>

          <div className="col-span-12">
            <div>
              <span className="font-semibold">Address</span>
              <span className="text-red-500">*</span>
            </div>
            <textarea
              id="address"
              rows={3}
              required
              className="w-full px-4 py-2 rounded-lg outline-none border border-pinkSecondary/40 mt-1"
              autoComplete="off"
              value={form.address || ""}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  address: e.target.value,
                }))
              }
            />
          </div>

          <div className="col-span-12">
            <button
              type="submit"
              className="px-4 py-2 bg-pinkSecondary/80 text-white rounded-lg w-full mt-5"
            >
              Edit
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}