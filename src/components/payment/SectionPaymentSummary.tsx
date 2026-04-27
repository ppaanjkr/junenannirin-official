import ImagePreviewModal from "@/components/ImagePreviewModal";
import { driveThumb } from "@/lib/workUtils";

type Theme = {
  secondary: string;
  accent: string;
};

export default function SectionPaymentSummary({
  theme,
  data,
}: {
  theme: Theme;
  data: any[];
}) {
  const total = data.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const count = data.reduce((sum, item) => sum + item.qty, 0);

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
          1
        </span>
        Order Summary
      </h2>

      {data.map((item: any) => (
        <div
          key={item.id}
          className="flex items-center gap-3 py-2 border-b"
          style={{ borderColor: `${theme.secondary}10` }}
        >
          <ImagePreviewModal src={driveThumb(item.img)} alt={item.name} className="w-16 h-16 rounded-lg "/>

          <div className="flex-1">
            <p className="font-semibold">{item.name}</p>

            <p style={{ color: theme.secondary }}>
              ฿ {item.price.toLocaleString()} × {item.qty}
            </p>
          </div>

          <div className="font-bold text-md">
            ฿ {(item.price * item.qty).toLocaleString()}
          </div>
        </div>
      ))}

      <div className="pt-3 space-y-1 text-sm">
        <div
          className="flex justify-between"
          style={{ color: theme.secondary }}
        >
          <span>Items</span>
          <span>{count}</span>
        </div>

        <div
          className="flex justify-between"
          style={{ color: theme.secondary }}
        >
          <span>Shipping</span>
          <span>FREE</span>
        </div>

        <div className="flex justify-between font-bold text-lg pt-2 border-t border-dashed">
          <span>Total</span>
          <span style={{ color: theme.secondary }}>
            ฿ {total.toLocaleString()}
          </span>
        </div>
      </div>
    </section>
  );
}