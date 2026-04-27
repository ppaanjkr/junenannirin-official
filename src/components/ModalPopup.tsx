"use client";

import { Check, X } from "lucide-react";

type Props = {
  open: boolean;
  type?: "success" | "error";
  message?: string;
  onClose: () => void;
};

export default function Popup({
  open,
  type = "success",
  message,
  onClose,
}: Props) {
  if (!open) return null;

  const isError = type === "error";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

      <div className="bg-white rounded-2xl shadow-lg p-6 w-[90%] max-w-sm text-center">

        <div
          className={`w-16 h-16 mx-auto mb-3 flex items-center justify-center rounded-full text-white text-2xl
            ${isError ? "bg-red-400" : "bg-pinkSecondary"}
          `}
        >
          {isError ? <X className="w-8 h-8"/> : <Check className="w-8 h-8"/>}
        </div>

        <p className="text-textMain mb-4 mt-2 text-lg">
          {message}
        </p>

        <button
          onClick={onClose}
          className={`w-full py-2 rounded-lg text-white
            ${isError ? "bg-red-400" : "bg-pinkSecondary"}
          `}
        >
          OK
        </button>
      </div>
    </div>
  );
}