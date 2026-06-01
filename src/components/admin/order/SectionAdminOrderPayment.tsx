"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  verifySlip: boolean;
  setVerifySlip: (value: boolean) => void;
  file: File | null;
  setFile: (file: File | null) => void;
  manualTransRef: string;
  setManualTransRef: (value: string) => void;
  adminNote: string;
  setAdminNote: (value: string) => void;
  total: number;
  loading?: boolean;
  onSubmit: () => void;
};

export default function SectionAdminOrderPayment({
  verifySlip,
  setVerifySlip,
  file,
  setFile,
  manualTransRef,
  setManualTransRef,
  adminNote,
  setAdminNote,
  total,
  loading = false,
  onSubmit,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (!file) {
      setPreview("");
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  function removeFile() {
    setFile(null);
    if (fileRef.current) {
      fileRef.current.value = "";
    }
  }

  return (
    <div className="bg-white border rounded-3xl p-5">
      <div className="font-semibold text-lg mb-4">Payment Verification</div>

      <div className="space-y-3">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="radio"
            checked={verifySlip}
            onChange={() => setVerifySlip(true)}
          />

          <div>
            <div className="font-medium">Verify Slip</div>

            <div className="text-xs text-gray-500">ตรวจสอบสลิปอัตโนมัติ</div>
          </div>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="radio"
            checked={!verifySlip}
            onChange={() => setVerifySlip(false)}
          />

          <div>
            <div className="font-medium">Manual Verify</div>

            <div className="text-xs text-gray-500">
              ตรวจสอบเองจากธนาคาร
            </div>
          </div>
        </label>
      </div>

      {verifySlip && (
        <div className="mt-5">
          <div className="font-medium mb-2">Upload Slip</div>

          <div
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed rounded-2xl p-5 cursor-pointer hover:bg-gray-50 transition "
          >
            {file ? (
              <div className="flex items-center gap-3 text-left w-full">
                <img
                  src={preview}
                  className=" w-16 h-16 rounded-xl object-cover flex-shrink-0 border "
                  alt="Slip preview"
                />

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{file.name}</p>
                  <p className="text-xs text-pink-500 truncate">
                    {(file.size / 1024).toFixed(1)} KB • uploaded
                  </p>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile();
                  }}
                  className=" w-8 h-8 rounded-lg bg-pink-50 hover:bg-pink-100 flex items-center justify-center flex-shrink-0 "
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="text-center">
                <div className="font-medium">Click to upload slip</div>

                <div className="text-xs text-gray-500 mt-1">
                  PNG / JPG / WEBP
                </div>
              </div>
            )}
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const selected = e.target.files?.[0];
              if (!selected) return;
              setFile(selected);
            }}
          />
        </div>
      )}

      {!verifySlip && (
        <div className="mt-5 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Transaction Ref *
            </label>

            <input
              value={manualTransRef}
              onChange={(e) => setManualTransRef(e.target.value)}
              placeholder="รหัสอ้างอิง ดูได้จากบนสลิป"
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          {/* <div>
            <label className="block text-sm font-medium mb-2">Admin Note</label>

            <textarea
              rows={4}
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              className="w-full border rounded-xl px-4 py-3 "
              placeholder="หมายเหตุเพิ่มเติม..."
            />
          </div> */}
        </div>
      )}

      <div className="border-t mt-6 pt-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm text-gray-500">Total Amount</div>

            <div className="text-xl font-bold">
              ฿{Number(total || 0).toLocaleString()}
            </div>
          </div>
        </div>

        <button
          onClick={onSubmit}
          disabled={loading || total <= 0}
          className="w-full mt-5 py-4 rounded-2xl bg-pinkSecondary text-white disabled:opacity-50"
        >
          {loading ? "Creating Order..." : "Create Order"}
        </button>
      </div>
    </div>
  );
}
