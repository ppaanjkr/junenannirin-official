import ImagePreviewModal from "@/components/ImagePreviewModal";
import { driveThumb } from "@/lib/workUtils";

type Theme = {
  secondary: string;
  accent: string;
};

type CartSelection = {
  reward_item_id: string;
  item_name: string;
  selected_size: string;
};

type OrderItem = {
  id: string;
  name: string;
  price: number;
  img: string;
  qty: number;
  selections?: CartSelection[];
};

export default function SectionPaymentSummary({
  theme,
  data,
}: {
  theme: Theme;
  data: OrderItem[];
}) {
  const total = data.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.qty || 0),
    0,
  );

  const count = data.reduce((sum, item) => sum + Number(item.qty || 0), 0);

  function getItemKey(item: OrderItem, index: number) {
    const sizeKey = (item.selections || [])
      .map((s) => `${s.reward_item_id}:${s.selected_size}`)
      .join("|");

    return `${item.id}_${sizeKey}_${index}`;
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
          1
        </span>
        Order Summary
      </h2>

      {data.map((item, index) => (
        <div
          key={getItemKey(item, index)}
          className="flex items-start gap-3 py-3 border-b"
          style={{ borderColor: `${theme.secondary}10` }}
        >
          <ImagePreviewModal
            src={driveThumb(item.img)}
            alt={item.name}
            className="w-20 h-auto rounded-lg object-cover"
          />

          <div className="flex-1 min-w-0">
            <p className="font-semibold">{item.name}</p>

            {item.selections && item.selections.length > 0 && (
              <div className="mt-1 flex flex-col gap-0.5">
                {item.selections.map((s) => (
                  <div
                    key={`${s.reward_item_id}_${s.selected_size}`}
                    className="text-xs text-textSub"
                  >
                    {s.item_name}:{" "}
                    <span className="font-semibold">
                      Size {String(s.selected_size || "-").toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <p className="mt-1" style={{ color: theme.secondary }}>
              ฿ {Number(item.price || 0).toLocaleString()} ×{" "}
              {Number(item.qty || 0)}
            </p>
          </div>

          <div className="font-bold text-md whitespace-nowrap">
            ฿{" "}
            {(
              Number(item.price || 0) * Number(item.qty || 0)
            ).toLocaleString()}
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