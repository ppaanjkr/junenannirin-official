"use client";

import LoadingOverlay from "@/components/LoadingOverlay";
import Popup from "@/components/ModalPopup";
import { bankOptions } from "@/data/bank";
import { fileToBase64 } from "@/lib/admin-project/fileToBase64";
import { createAdminBank, updateAdminBank } from "@/lib/api/admin";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  open: boolean;
  bank: any;
  onClose: () => void;
  onSaved: (bank: any, mode: "create" | "update") => void;
};

export default function BankEditModal({ open, bank, onClose, onSaved }: Props) {
  const isEdit = !!bank?.id;

  const [loading, setLoading] = useState(false);
  const [qrFile, setQrFile] = useState<File | null>(null);
  const [deleteQrcodeUrl, setDeleteQrcodeUrl] = useState("");
  const [savedPayload, setSavedPayload] = useState<any>(null);
  const [savedMode, setSavedMode] = useState<"create" | "update">("create");

  const [popup, setPopup] = useState({
    open: false,
    type: "",
    message: "",
  });

  const [form, setForm] = useState({
    id: "",
    bank_code: "",
    bank_name: "",
    bank_short_name: "",
    account_name: "",
    account_name_en: "",
    account_no: "",
    qrcode: "",
    active: true,
  });

  useEffect(() => {
    if (!open) return;

    const selectedBank = bankOptions.find(
      (b) =>
        String(b.bank_name).trim() === String(bank?.bank_name || "").trim() ||
        String(b.bank_short_name).trim() ===
          String(bank?.bank_short_name || "").trim() ||
        String(b.code).trim() === String(bank?.bank_code || "").trim(),
    );

    setForm({
      id: bank?.id || "",
      bank_code: selectedBank?.code || bank?.bank_code || "",
      bank_name: selectedBank?.bank_name || bank?.bank_name || "",
      bank_short_name:
        selectedBank?.bank_short_name || bank?.bank_short_name || "",
      account_name: bank?.account_name || "",
      account_name_en: bank?.account_name_en || "",
      account_no: bank?.account_no || "",
      qrcode: bank?.qrcode || "",
      active: bank ? Number(bank.active) === 1 || bank.active === true : true,
    });

    setQrFile(null);
    setDeleteQrcodeUrl("");
    setLoading(false);
    setSavedPayload(null);
    setSavedMode(bank?.id ? "update" : "create");

    setPopup({
      open: false,
      type: "",
      message: "",
    });
  }, [open, bank]);

  if (!open) return null;

  function showError(message: string) {
    setPopup({
      open: true,
      type: "error",
      message,
    });
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleBankChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const code = e.target.value;
    const selectedBank = bankOptions.find((item) => item.code === code);

    setForm((prev) => ({
      ...prev,
      bank_code: selectedBank?.code || "",
      bank_name: selectedBank?.bank_name || "",
      bank_short_name: selectedBank?.bank_short_name || "",
    }));
  }

  function handleQrFileChange(file?: File | null) {
    if (!file) {
      setQrFile(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      showError("Please upload image file only");
      return;
    }

    if (form.qrcode) {
      setDeleteQrcodeUrl(form.qrcode);
      setForm((prev) => ({
        ...prev,
        qrcode: "",
      }));
    }

    setQrFile(file);
  }

  function handleRemoveQr() {
    if (form.qrcode) {
      setDeleteQrcodeUrl(form.qrcode);
    }

    setForm((prev) => ({
      ...prev,
      qrcode: "",
    }));

    setQrFile(null);
  }

  function validate() {
    if (!form.bank_code) {
      showError("Please select bank");
      return false;
    }

    if (!form.account_name.trim()) {
      showError("Account name is required");
      return false;
    }

    if (!form.account_no.trim()) {
      showError("Account number is required");
      return false;
    }

    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      const mode: "create" | "update" = isEdit ? "update" : "create";

      let qrcodeFile = null;

      if (qrFile) {
        qrcodeFile = await fileToBase64(qrFile);
      }

      const payload = {
        id: form.id,
        bank_code: form.bank_code,
        bank_name: form.bank_name.trim(),
        bank_short_name: form.bank_short_name.trim(),
        account_name: form.account_name.trim(),
        account_name_en: form.account_name_en.trim(),
        account_no: form.account_no.trim(),
        qrcode: form.qrcode.trim(),
        qrcode_file: qrcodeFile,
        delete_qrcode_url: deleteQrcodeUrl,
        active: form.active,
      };

      const data =
        mode === "create"
          ? await createAdminBank({ bank: payload })
          : await updateAdminBank({ bank: payload });

      if (!data.success) {
        showError(data.message || "Save bank failed");
        return;
      }

      setSavedPayload(data.data);
      setSavedMode(mode);

      setPopup({
        open: true,
        type: "success",
        message:
          mode === "create"
            ? "Bank created successfully"
            : "Bank updated successfully",
      });
    } catch (err) {
      console.error(err);
      showError("Save bank failed");
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
      onSaved(savedPayload, savedMode);
      setSavedPayload(null);
    }
  }

  function handleCloseModal() {
    setLoading(false);
    setQrFile(null);
    setDeleteQrcodeUrl("");
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
      {loading && <LoadingOverlay />}

      <Popup
        open={popup.open}
        type={popup.type}
        message={popup.message}
        onClose={handlePopupClose}
      />

      <div className="fixed inset-0 z-[1000] bg-black/40 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-pinkAccent flex justify-between items-center">
            <h2 className="font-semibold text-lg">
              {isEdit ? "Edit Bank" : "Add Bank"}
            </h2>

            <button
              type="button"
              onClick={handleCloseModal}
              className="flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-3">
            <div>
              <label className="font-medium">Bank Name</label>
              <select
                value={form.bank_code}
                onChange={handleBankChange}
                className="mt-1 w-full border border-pinkAccent rounded-lg px-3 py-2 outline-none bg-white"
              >
                <option value="">Select Bank</option>
                {bankOptions.map((bank) => (
                  <option key={bank.code} value={bank.code}>
                    {bank.bank_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-medium">Bank Name EN</label>
              <input
                value={form.bank_short_name}
                readOnly
                className="mt-1 w-full border border-pinkAccent rounded-lg px-3 py-2 outline-none bg-gray-50 text-gray-500"
              />
            </div>

            <div>
              <label className="font-medium">Account Name TH</label>
              <input
                name="account_name"
                value={form.account_name}
                onChange={handleChange}
                className="mt-1 w-full border border-pinkAccent rounded-lg px-3 py-2 outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Account Name EN</label>
              <input
                name="account_name_en"
                value={form.account_name_en}
                onChange={handleChange}
                className="mt-1 w-full border border-pinkAccent rounded-lg px-3 py-2 outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Account No.</label>
              <input
                name="account_no"
                value={form.account_no}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9-]/g, "");

                  setForm((prev) => ({
                    ...prev,
                    account_no: value,
                  }));
                }}
                inputMode="numeric"
                className="mt-1 w-full border border-pinkAccent rounded-lg px-3 py-2 outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium">QR Code</label>

              {form.qrcode && !qrFile ? (
                <div className="mt-2 relative w-32">
                  <img
                    src={form.qrcode}
                    alt="QR Code"
                    className="w-32 h-32 object-cover rounded-lg border border-pinkAccent"
                  />

                  <button
                    type="button"
                    onClick={handleRemoveQr}
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border border-pinkSecondary text-pinkSecondary flex items-center justify-center shadow"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleQrFileChange(e.target.files?.[0])}
                  className="mt-1 w-full rounded-lg border border-pinkAccent bg-white px-3 py-2 text-sm outline-none file:mr-3 file:rounded-md file:border-0 file:bg-pinkAccent file:px-3 file:py-1 file:text-pinkSecondary"
                />
              )}

              {qrFile && (
                <p className="mt-1 text-xs text-textSub">
                  Selected: {qrFile.name}
                </p>
              )}

              {/* {deleteQrcodeUrl && (
                <p className="mt-1 text-xs text-red-500">
                  Old QR will be deleted after save
                </p>
              )} */}
            </div>

            <div className="flex items-center justify-between border border-pinkAccent rounded-lg px-3 py-2">
              <div className="text-sm font-medium">Active</div>

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
