import { driveThumb } from "@/lib/workUtils";

type Theme = {
  secondary: string;
  accent: string;
};

export default function SectionPaymentMethod({
  theme,
  total,
  data,
}: {
  theme: Theme;
  total: number;
  data: any;
}) {
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
          {data?.bank_short_name?.toUpperCase() || ""}
        </div>
        <div className="flex-1">
          <p
            className="text-xs"
            style={{
              color: `${theme.secondary}`,
            }}
          >
            {data?.account_name || ""}
            <br />
            {data?.account_name_en || ""}
          </p>
          <p className="font-bold">{data?.account_no || ""}</p>
        </div>
        <button
          className="border px-3 py-1 rounded text-xs"
          style={{
            borderColor: `${theme.secondary}`,
            color: `${theme.secondary}`,
          }}
        >
          COPY
        </button>
      </div>

      <div
        className="flex flex-col items-center border border-dashed rounded-lg p-4"
        style={{
          borderColor: `${theme.accent}30`,
        }}
      >
        <img src={driveThumb(data?.qrcode)} className="w-40 h-40 " />
        <p className="text-xs mt-2">scan to pay</p>
        <p
          id="paymentAmount"
          className="text-secondary font-bold text-xl"
          style={{
            color: `${theme.secondary}`,
          }}
        >
          ฿ {total}
        </p>
      </div>
    </section>
  );
}
