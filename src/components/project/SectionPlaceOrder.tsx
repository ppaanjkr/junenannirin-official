type Theme = {
  secondary: string;
  accent: string;
};

type CartSelection = {
  reward_item_id: string;
  item_name: string;
  option_name: string;
  selected_option: string;
  qty: number;
};

type CartLine = {
  reward_id: string;
  title: string;
  price: number;
  img: string;
  qty: number;
  selections: CartSelection[];
};

export default function SectionPlaceOrder({
  theme,
  total,
  count,
  cart,
  onCheckout,
  previewMode = false,
}: {
  theme: Theme;
  total: number;
  count: number;
  cart: Record<string, CartLine>;
  onCheckout: () => void;
  previewMode?: boolean;
}) {
  return (
    <div
      style={{
        borderColor: `${theme.secondary}20`,
      }}
      className="fixed bottom-0 left-0 w-full bg-white border-t shadow-lg px-4 py-3 z-[60]"
    >
      <div className="max-w-5xl mx-auto flex items-center gap-3 md:max-w-3xl ">
        <div className="flex-1">
          <div className="text-md text-text-sub">Total</div>

          <div>
            <span
              id="totalValue"
              className="font-semibold text-lg"
              style={{
                color: `${theme.secondary}`,
              }}
            >
              ฿ {(total || 0).toLocaleString()}
            </span>
          </div>

          {count > 0 && (
            <div className="text-xs text-text-sub mt-0.5">
              {count} item{count > 1 ? "s" : ""}
            </div>
          )}

          {previewMode && (
            <div className="text-xs text-text-sub mt-0.5">Preview only</div>
          )}
        </div>

        <button
          className="text-white px-5 py-2 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          id="orderBtn"
          style={{
            backgroundColor: `${theme.secondary}`,
          }}
          disabled={previewMode || total === 0}
          onClick={() => {
            if (previewMode) return;
            onCheckout();
          }}
        >
          {previewMode ? "Preview Only" : "Place Order"}
        </button>
      </div>
    </div>
  );
}