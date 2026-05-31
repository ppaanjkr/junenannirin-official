import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { json } from "stream/consumers";
import { driveThumb, getBankLogo } from "@/lib/workUtils";
import { format } from "path";
import { formatTHB } from "@/lib/formatTHB";
import { getBankOptionByShortName } from "@/data/bank";

type Theme = {
  secondary: string;
  accent: string;
};

export default function SectionPaymentMethod({
  theme,
  total,
  data,
  setPopup,
}: {
  theme: Theme;
  total: number;
  data: any;
  setPopup: (v: any) => void;
}) {
  const [qrImage, setQrImage] = useState<string>(
    driveThumb(data?.bank?.qrcode),
  );
  const [account_no, setAccountNo] = useState<string>("");
  const [bankLogo, setBankLogo] = useState<string>(
    "/icon/june_logo_circle.png",
  );
  useEffect(() => {
    if (!data) return;

    setQrImage(driveThumb(data?.bank?.qrcode));

    const bankOption = getBankOptionByShortName(data?.bank?.bank_short_name);
    setBankLogo(bankOption?.bank_logo || "");
  }, [data]);

  const isPromptPay =
    data?.bank?.bank_short_name?.toLowerCase() === "promptpay" ||
    data?.bank?.bank_short_name == "PromptPay";

  function getDriveFileId(url?: string) {
    if (!url) return "";

    const patterns = [/\/file\/d\/([^/]+)/, /\/d\/([^/]+)/, /id=([^&]+)/];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match?.[1]) return match[1];
    }

    return "";
  }

  function saveQrImage() {
    const fileId = getDriveFileId(data?.bank?.qrcode);

    if (!fileId) {
      setPopup({
        open: true,
        type: "error",
        message: "QR not found",
      });
      return;
    }

    const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

    const a = document.createElement("a");
    a.href = downloadUrl;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.click();
  }

  // useEffect(() => {
  //   setAccountNo(data?.account_no);
  //   if (qrImage) return;
  //   const genQR = async () => {
  //     try {
  //       const res = await generateQRPromptpay();

  //       if (res?.data?.qrCode) {
  //         const url = await QRCode.toDataURL(res.data.qrCode);
  //         setQrImage(url);
  //       }
  //     } catch (err) {
  //       console.error("QR error", err);
  //     }
  //   };

  //   if (total > 0) {
  //     genQR();
  //   }
  // }, [total, account_no]);

  async function generateQRPromptpay() {
    if (!data?.bank?.account_no) return;

    const promptpay_code = data.bank.account_no.replace(/-/g, "");
    const promptpay_type = "phone_number";
    const account_name = data.bank.account_name;

    const payload = {
      promptPayCode: promptpay_code,
      promptPayType: promptpay_type,
      accountName: account_name,
      amount: total.toFixed(2),
    };

    const res = await fetch(`${process.env.NEXT_PUBLIC_SLIP2GO_API_GENQR}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SLIP2GO_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    return result;
  }
  return (
    <section
      className="bg-white rounded-lg border p-4 shadow-sm mt-4"
      style={{
        borderColor: `${theme.secondary}20`,
      }}
    >
      <h2 className="font-bold mb-4 flex items-center gap-2 text-md">
        <span
          className="text-white px-3 py-1 rounded"
          style={{ backgroundColor: theme.secondary }}
        >
          2
        </span>
        Payment
      </h2>

      <div
        className="rounded-lg p-3 flex items-center gap-3 mb-4"
        style={{
          backgroundColor: `${theme.accent}50`,
        }}
      >
        <div
          className="bg-white rounded-lg flex items-center justify-center font-bold p-2"
          style={{
            color: `${theme.secondary}`,
          }}
        >
          <img
            src={bankLogo}
            alt="bank_logo"
            className="w-8 h-8 object-cover"
          />
        </div>
        <div className="flex-1">
          <p
            className="text-xs"
            style={{
              color: `${theme.secondary}`,
            }}
          >
            {data?.bank?.account_name || ""}
            <br />
            {data?.bank.account_name_en || ""}
          </p>
          <p className="font-bold">
            {data?.bank?.bank_short_name == "PromptPay" ||
            data?.bank?.bank_short_name?.toLowerCase() == "promptpay"
              ? "PromptPay"
              : data?.bank.bank_account_no}
          </p>
        </div>
        {isPromptPay ? (
          ""
          // <button
          //   className="border px-3 py-1 rounded text-xs"
          //   style={{
          //     borderColor: `${theme.secondary}`,
          //     color: `${theme.secondary}`,
          //   }}
          //   onClick={saveQrImage}
          // >
          //   SAVE QR
          // </button>
        ) : (
          <button
            className="border px-3 py-1 rounded text-xs"
            style={{
              borderColor: `${theme.secondary}`,
              color: `${theme.secondary}`,
            }}
            onClick={() => {
              if (!data?.bank?.account_no) return;

              const cleaned = data.bank.account_no.replace(/-/g, "");
              navigator.clipboard.writeText(cleaned);

              setPopup({
                open: true,
                type: "success",
                message: "Copied!",
              });
            }}
          >
            COPY
          </button>
        )}
      </div>

      <div
        className="flex flex-col items-center border border-dashed rounded-lg p-4"
        style={{
          borderColor: `${theme.accent}30`,
        }}
      >
        <span className="text-red-500 italic text-sm pb-2">กรุณาชำระเงินเต็มจำนวนให้ตรงกับคำสั่งซื้อ</span>
        {qrImage ? (
          <img src={qrImage} className="w-36 h-full" />
        ) : (
          <div className="w-40 h-40 flex items-center justify-center text-xs text-gray-400">
            Loading QR...
          </div>
        )}
        <p className="text-xs mt-2">scan to pay</p>
        <p
          id="paymentAmount"
          className="text-secondary font-bold text-xl"
          style={{
            color: `${theme.secondary}`,
          }}
        >
          ฿ {formatTHB(total || 0)}
        </p>
      </div>
    </section>
  );
}
