"use client";

import { bankOptions } from "@/data/bank";
import { createOrder } from "@/lib/api/order";
import { Upload } from "lucide-react";
import { useRef, useState } from "react";

type Theme = {
  secondary: string;
  accent: string;
};

export default function SectionPaymentUpload({
  theme,
  setLoading,
  setPopup,
  loading,
  data,
  total,
  user,
}: {
  theme: Theme;
  setLoading: (v: boolean) => void;
  setPopup: (v: any) => void;
  loading: boolean;
  data: any;
  total: number;
  user: any;
}) {
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  function triggerFile() {
    if (file) return;
    fileRef.current?.click();
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;

    if (!f.type.startsWith("image/")) {
      alert("Please select image file");
      return;
    }

    if (f.size > 5 * 1024 * 1024) {
      alert("File size over 5MB");
      return;
    }

    setFile(f);

    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreview(ev.target?.result as string);
    };
    reader.readAsDataURL(f);
  }

  function removeFile(e: React.MouseEvent) {
    e.stopPropagation();

    setFile(null);
    setPreview("");

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  }

  async function handleSubmitOrder() {
    setLoading(true);

    if (!file) {
      setLoading(false);
      return;
    }

    if (!user?.uuid) {
      setLoading(false);
      setPopup({
        open: true,
        type: "error",
        message: "Please login again",
      });
      return;
    }

    try {
      const slip = await verifySlip(file);

      const slipSuccessCode = ["200200", "200000"];

      if (!slip || !slipSuccessCode.includes(slip.code)) {
        setLoading(false);
        setPopup({
          open: true,
          type: "error",
          message: slip?.message || "Invalid slip",
        });
        return;
      }

      if (Number(slip.data.amount) < Number(total)) {
        setLoading(false);
        setPopup({
          open: true,
          type: "error",
          message: "Invalid amount (จำนวนเงินไม่ถูกต้อง)",
        });
        return;
      }

      const payload = getOrderPayload({
        referenceId: slip.data.referenceId,
        transRef: slip.data.transRef,
        dateTime: slip.data.dateTime,
        amount: slip.data.amount,
      });
      // const payload = getOrderPayload({
      //   referenceId: `REF${Math.floor(Math.random() * 1000000000)}`,
      //   transRef: `TR${Math.floor(Math.random() * 1000000000)}`,
      //   dateTime: new Date().toISOString(),
      //   amount: total,
      // });

      if (!payload) {
        setLoading(false);
        setPopup({
          open: true,
          type: "error",
          message: "Something went wrong",
        });
        return;
      }

      const result = await createOrder(payload);

      if (!result.success) {
        throw new Error(result.message || result.error || "error");
      }

      localStorage.removeItem("fc_order");
      localStorage.removeItem("cart");

      setPopup({
        open: true,
        type: "success",
        message: "Payment successful",
      });

      setTimeout(() => {
        window.location.href = "/project";
      }, 1200);
    } catch (err: any) {
      console.error(err);

      setPopup({
        open: true,
        type: "error",
        message: err.message || "Something error",
      });
    } finally {
      setLoading(false);
    }
  }

  function safeJsonParse(value: string | null) {
    if (!value) return null;

    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }

  function getProjectIdFromStorage() {
    const projectRaw =
      localStorage.getItem("fc_project") || localStorage.getItem("project");

    const project = safeJsonParse(projectRaw);

    if (!project) return "";

    if (typeof project === "string") {
      return project.trim();
    }

    return String(project.id || project.project?.id || "").trim();
  }

  function getOrderPayload({
    referenceId,
    transRef,
    dateTime,
    amount,
  }: {
    referenceId: string;
    transRef: string;
    dateTime: string;
    amount: number;
  }) {
    try {
      const orderRaw = localStorage.getItem("fc_order");

      if (!orderRaw) return null;

      const projectId = getProjectIdFromStorage();
      const items = safeJsonParse(orderRaw);

      if (!projectId || !Array.isArray(items)) {
        return null;
      }

      return {
        action: "createUserOrder",

        // user_id ไม่ต้องส่งแล้ว backend ใช้จาก token
        project_id: projectId,

        items: items.map((i: any) => ({
          id: i.id,
          name: i.name,
          price: Number(i.price || 0),
          qty: Number(i.qty || 0),

          selections: Array.isArray(i.selections)
            ? i.selections.map((s: any) => ({
                reward_item_id: s.reward_item_id,
                item_name: s.item_name,
                option_name: s.option_name || (s.selected_size ? "size" : ""),
                selected_option: s.selected_option || s.selected_size || "",
                qty: Number(s.qty || 0),
              }))
            : [],
        })),

        referenceId,
        transRef,
        dateTime,
        amount,
      };
    } catch (err) {
      console.error("payload error", err);
      return null;
    }
  }

  async function verifySlip(file: File) {
    const bank_code = bankOptions.find(
      (b: any) =>
        b.bank_name === data.bank.bank_name ||
        b.name === data.bank.bank_name ||
        b.bank_short_name === data.bank.bank_name,
    )?.code;

    if (!bank_code) {
      throw new Error("Invalid bank");
    }

    const account_no = data.bank.account_no?.replace(/-/g, "") ?? "";
    const account_name = data.bank.account_name;
    const account_name_en = data.bank.account_name_en;

    const formData = new FormData();

    formData.append("file", file);

    formData.append(
      "payload",
      JSON.stringify({
        checkDuplicate: true,
        checkReceiver: [
          {
            accountType: bank_code,
            accountNumber: account_no,
            accountNameTH: account_name,
            accountNameEN: account_name_en,
          },
        ],
      }),
    );

    const res = await fetch(`${process.env.NEXT_PUBLIC_SLIP2GO_API}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SLIP2GO_KEY}`,
      },
      body: formData,
    });

    return res.json();
  }

  return (
    <div>
      <section
        className="bg-white rounded-lg border p-4 shadow-sm mt-4"
        style={{ borderColor: `${theme.secondary}20` }}
      >
        <h2 className="font-bold mb-4 flex items-center gap-2 text-md">
          <span
            className="text-white px-3 py-1 rounded"
            style={{ backgroundColor: theme.secondary }}
          >
            3
          </span>
          Upload
        </h2>

        <div
          onClick={triggerFile}
          className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition"
          style={{
            borderColor: `${theme.secondary}40`,
            backgroundColor: `${theme.accent}20`,
          }}
        >
          {!file && (
            <div>
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto"
                style={{ backgroundColor: `${theme.secondary}10` }}
              >
                <Upload className="w-6 h-6" />
              </div>

              <p className="font-semibold mt-3">Upload slip</p>
              <p className="text-xs" style={{ color: theme.secondary }}>
                JPG / PNG (max 5MB)
              </p>
            </div>
          )}

          {file && (
            <div className="flex items-center gap-3 text-left w-full">
              <img
                src={preview}
                className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                alt="Slip preview"
              />

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{file.name}</p>

                <p
                  className="text-xs truncate"
                  style={{ color: theme.secondary }}
                >
                  {(file.size / 1024).toFixed(1)} KB • uploaded
                </p>
              </div>

              <button
                type="button"
                onClick={removeFile}
                className="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0"
                style={{ backgroundColor: `${theme.secondary}10` }}
              >
                ✕
              </button>
            </div>
          )}

          <input
            disabled={loading}
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
          />
        </div>
      </section>

      <section className="mt-4">
        <button
          id="confirmPayBtn"
          className="w-full text-white py-3 rounded-xl font-bold disabled:opacity-50"
          style={{
            backgroundColor: `${theme.secondary}`,
          }}
          disabled={!file || loading}
          onClick={handleSubmitOrder}
        >
          Confirm Payment
        </button>
      </section>
    </div>
  );
}
