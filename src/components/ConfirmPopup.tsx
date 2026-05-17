"use client";

import { AlertTriangle } from "lucide-react";

type Props = {
  open: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ConfirmPopup({
  open,
  title = "Confirm",
  message = "Are you sure?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
  onCancel,
  onConfirm,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-[90%] max-w-sm text-center">
        <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center rounded-full bg-red-100 text-red-400">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <h3 className="font-semibold text-lg text-textMain my-3">{title}</h3>

        {/* <p className="text-textSub mt-2 mb-5 text-sm whitespace-pre-line">
          {message}
        </p> */}

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="w-full py-2 rounded-lg border border-gray-200 text-textSub disabled:opacity-50"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="w-full py-2 rounded-lg bg-red-400 text-white disabled:opacity-50"
          >
            {loading ? "Deleting..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}