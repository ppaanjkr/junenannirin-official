"use client";

import LoadingOverlay from "@/components/LoadingOverlay";
import Popup from "@/components/ModalPopup";
import { teamOptions } from "@/data/teams";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  open: boolean;
  user: any;
  onClose: () => void;
  onSaved?: (user: any) => void;
};

export default function MemberEditModal({
  open,
  user,
  onClose,
  onSaved,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [savedPayload, setSavedPayload] = useState<any>(null);

  const [popup, setPopup] = useState({
    open: false,
    type: "",
    message: "",
  });

  const [form, setForm] = useState({
    uuid: "",
    name: "",
    phone: "",
    address: "",
    team: "",
    active: true,
  });

  useEffect(() => {
    if (!open || !user) return;

    setForm({
      uuid: user.uuid || "",
      name: user.name || "",
      phone: String(user.phone || ""),
      address: user.address || "",
      team: user.team || "",
      active: Number(user.active) === 1 || user.active === true,
    });

    setLoading(false);
    setSavedPayload(null);
    setPopup({
      open: false,
      type: "",
      message: "",
    });
  }, [open, user]);

  if (!open) return null;

  function handleTextChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);

    setForm((prev) => ({
      ...prev,
      phone: value,
    }));
  }

  function handlePhoneKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (
      ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key)
    ) {
      return;
    }

    if (!/^\d$/.test(e.key)) {
      e.preventDefault();
    }
  }

  function handlePhonePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const paste = e.clipboardData.getData("text");

    if (!/^\d{1,10}$/.test(paste)) {
      e.preventDefault();
    }
  }

  function showError(message: string) {
    setPopup({
      open: true,
      type: "error",
      message,
    });
  }

  function validate() {
    if (!form.name.trim()) {
      showError("Name is required");
      return false;
    }

    if (form.phone[0] !== "0" || form.phone.length !== 10) {
      showError("Invalid phone number");
      return false;
    }

    if (!form.address.trim()) {
      showError("Address is required");
      return false;
    }

    if (form.team === "") {
      showError("Select team");
      return false;
    }

    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    if (!validate()) {
      setLoading(false);
      return;
    }

    try {
      const payload = {
        uuid: form.uuid,
        name: form.name.trim(),
        phone: form.phone,
        address: form.address.trim(),
        team: form.team,
        active: form.active,
      };

      const res = await fetch("/api/gas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "updateMember",
          user: payload,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        showError(data.message || "Update member failed");
        return;
      }

      setSavedPayload(payload);

      setPopup({
        open: true,
        type: "success",
        message: "Member updated successfully",
      });
    } catch (err) {
      console.error(err);
      showError("Update member failed");
    } finally {
      setLoading(false);
    }
  }

  function handlePopupClose() {
    const isSuccess = popup.type === "success" && savedPayload;

    setPopup((prev) => ({
      ...prev,
      open: false,
    }));

    if (isSuccess) {
      onSaved?.(savedPayload);
      setSavedPayload(null);
    }
  }

  function handleCloseModal() {
    setLoading(false);
    setSavedPayload(null);
    setPopup({
      open: false,
      type: "",
      message: "",
    });
    onClose();
  }

  return (
    <>
      {loading && <LoadingOverlay block />}

      <Popup
        open={popup.open}
        type={popup.type}
        message={popup.message}
        onClose={handlePopupClose}
      />

      <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-pinkAccent flex justify-between items-center">
            <div>
              <h2 className="font-semibold text-lg">Edit Member</h2>
              <p className="text-xs text-textSub">
                {user?.username || user?.uuid || ""}
              </p>
            </div>

            <button
              type="button"
              onClick={handleCloseModal}
              className="flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-3">
            {/* name */}
            <div>
              <label className="text-sm font-medium">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleTextChange}
                className="mt-1 w-full border border-pinkAccent rounded-lg px-3 py-2 outline-none"
                placeholder="Name"
              />
            </div>

            {/* phone */}
            <div>
              <label className="text-sm font-medium">Phone</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handlePhoneChange}
                onKeyDown={handlePhoneKeyDown}
                onPaste={handlePhonePaste}
                inputMode="numeric"
                maxLength={10}
                className="mt-1 w-full border border-pinkAccent rounded-lg px-3 py-2 outline-none"
                placeholder="Phone"
              />
            </div>

            {/* address */}
            <div>
              <label className="text-sm font-medium">Address</label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleTextChange}
                className="mt-1 w-full border border-pinkAccent rounded-lg px-3 py-2 outline-none min-h-[90px]"
                placeholder="Address"
              />
            </div>

            {/* team */}
            <div>
              <label className="text-sm font-medium">Team</label>

              <div className="mt-2 grid grid-cols-12 gap-2">
                {teamOptions.map((team) => {
                  const active = form.team === team.value;

                  return (
                    <button
                      key={team.value}
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          team: team.value,
                        }))
                      }
                      className={`col-span-6 rounded-lg border p-2 text-sm flex flex-col items-center justify-center gap-1 ${
                        active
                          ? "border-pinkSecondary bg-pinkAccent/40 text-pinkSecondary font-semibold"
                          : "border-pinkAccent bg-white"
                      }`}
                    >
                      {team.image && (
                        <img
                          src={team.image}
                          alt={team.label}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      )}

                      <span>{team.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* active */}
            <div className="flex items-center justify-between border border-pinkAccent rounded-lg px-3 py-2">
              <div>
                <div className="text-sm font-medium">Active</div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    active: !prev.active,
                  }))
                }
                className={`w-12 h-7 rounded-full p-1 transition ${
                  form.active ? "bg-pinkSecondary" : "bg-gray-300"
                }`}
              >
                <span
                  className={`block w-5 h-5 bg-white rounded-full transition ${
                    form.active ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* actions */}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={loading}
                className="flex-1 border border-pinkSecondary text-pinkSecondary rounded-lg py-2 font-medium disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-pinkSecondary text-white rounded-lg py-2 font-medium disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}