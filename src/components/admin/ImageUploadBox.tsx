"use client";

import { fileToBase64 } from "@/lib/admin-project/fileToBase64";
import { ImagePlus, Trash2 } from "lucide-react";
import { useState } from "react";

type Props = {
  value?: string;
  filePrefix?: string;
  onChange: (url: string) => void;
};

export default function ImageUploadBox({
  value,
  filePrefix = "upload",
  onChange,
}: Props) {
  const [loading, setLoading] = useState(false);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload image only");
      return;
    }

    setLoading(true);

    try {
      const base64 = await fileToBase64(file);

      const res = await fetch("/api/firebase/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          base64,
          fileName: `${filePrefix}_${Date.now()}_${file.name}`,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.message || "Upload failed");
        return;
      }

      onChange(data.url);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {!value ? (
        <label className="mt-1 flex h-36 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-pinkAccent bg-pinkAccent/10 transition hover:bg-pinkAccent/20">
          <ImagePlus className="w-8 h-8 text-pinkSecondary" />

          <span className="mt-2 text-sm font-medium text-pinkSecondary">
            {loading ? "Uploading..." : "Upload Image"}
          </span>

          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
          />
        </label>
      ) : (
        <div className="mt-1 relative w-full">
          <img
            src={value}
            alt="preview"
            className="w-full max-h-[240px] object-cover rounded-xl border border-pinkAccent"
          />

          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 bg-white border border-pinkAccent rounded-full p-2 shadow"
          >
            <Trash2 className="w-4 h-4 text-pinkSecondary" />
          </button>
        </div>
      )}
    </div>
  );
}