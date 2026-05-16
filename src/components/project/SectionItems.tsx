"use client";

import { useState } from "react";
import { Reward } from "@/lib/api/types";
import { driveThumb } from "@/lib/workUtils";
import ImagePreviewModal from "@/components/ImagePreviewModal";

type Theme = {
  secondary: string;
  accent: string;
};

type CartSelection = {
  reward_item_id: string;
  item_name: string;
  selected_size: string;
};

type CartLine = {
  reward_id: string;
  title: string;
  price: number;
  img: string;
  qty: number;
  selections: CartSelection[];
};

type Props = {
  data: Reward[];
  theme: Theme;
  user: any;
  cart: Record<string, CartLine>;
  inc: (reward: Reward, selections: CartSelection[]) => void;
  dec: (reward: Reward, selections: CartSelection[]) => void;
  canPlaceOrder: boolean;
};

function buildCartKey(rewardId: string, selections: CartSelection[]) {
  const sizePart = selections
    .map((s) => `${s.reward_item_id}:${s.selected_size}`)
    .sort()
    .join("|");

  return sizePart ? `${rewardId}|${sizePart}` : rewardId;
}

export default function SectionItems({
  data,
  theme,
  user,
  cart,
  inc,
  dec,
  canPlaceOrder,
}: Props) {
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>(
    {},
  );

  const [sizeErrors, setSizeErrors] = useState<Record<string, boolean>>({});

  const itemCount = Object.values(cart).reduce(
    (sum, line) => sum + line.qty,
    0,
  );

  function getSelections(item: Reward): CartSelection[] {
    return (item.items || [])
      .filter((ri: any) => Number(ri.has_size) === 1)
      .map((ri: any) => {
        const key = `${item.id}_${ri.id}`;
        const selected = selectedSizes[key] ?? "";

        return {
          reward_item_id: String(ri.id),
          item_name: ri.item_name,
          selected_size: selected,
        };
      });
  }

  function getQty(item: Reward) {
    const selections = getSelections(item);
    const key = buildCartKey(String(item.id), selections);

    return cart[key]?.qty || 0;
  }

  function handleAdd(item: Reward) {
    const sizeItems = (item.items || []).filter(
      (ri: any) => Number(ri.has_size) === 1,
    );

    const errors: Record<string, boolean> = {};
    let hasError = false;

    sizeItems.forEach((ri: any) => {
      const key = `${item.id}_${ri.id}`;
      const selected = selectedSizes[key] ?? "";

      if (!selected) {
        errors[key] = true;
        hasError = true;
      }
    });

    if (hasError) {
      setSizeErrors((prev) => ({
        ...prev,
        ...errors,
      }));

      return;
    }

    const selections = getSelections(item);

    inc(item, selections);
  }

  return (
    <section>
      <div className="flex justify-between items-center mt-6">
        <span className="text-xl font-semibold">Items</span>

        {canPlaceOrder && (
          <span className="text-sm text-text-sub">{itemCount} items</span>
        )}
      </div>

      {data && data.length > 0 && (
        <div className="grid grid-cols-12 gap-3 md:gap-4 items-stretch">
          {data.map((item) => {
            const qty = getQty(item);
            const selections = getSelections(item);

            return (
              <div key={String(item.id)} className="col-span-6 lg:col-span-4">
                <div
                  className="bg-white border rounded-lg overflow-hidden shadow-sm flex flex-col h-full"
                  style={{ borderColor: `${theme.secondary}33` }}
                >
                  <ImagePreviewModal
                    src={driveThumb(item.image_url)}
                    className="w-full h-56 md:h-80 object-cover"
                  />

                  <div className="py-3 px-2 flex flex-col gap-2 flex-1">
                    <h3
                      className="font-semibold text-base md:text-lg"
                      style={{ color: theme.secondary }}
                    >
                      {item.title}
                    </h3>

                    <p className="text-textSub text-sm">{item.description}</p>

                    {/* SIZE SELECTORS */}
                    {user &&
                      canPlaceOrder &&
                      (item.items || [])
                        .filter((ri: any) => Number(ri.has_size) === 1)
                        .map((ri: any) => {
                          const key = `${item.id}_${ri.id}`;
                          const value = selectedSizes[key] ?? "";

                          return (
                            <div key={String(ri.id)} className="mt-2">
                              <label className="text-xs text-textSub">
                                {ri.item_name} size
                              </label>

                              <div className="mt-1 flex flex-wrap gap-1">
                                {(ri.sizes || []).map((s: any) => {
                                  const sizeValue = String(s.size || "");
                                  const isActive =
                                    String(value).toLowerCase() ===
                                    sizeValue.toLowerCase();

                                  return (
                                    <button
                                      key={String(s.id || s.size)}
                                      type="button"
                                      onClick={() => {
                                        setSelectedSizes((prev) => ({
                                          ...prev,
                                          [key]: sizeValue,
                                        }));

                                        setSizeErrors((prev) => ({
                                          ...prev,
                                          [key]: false,
                                        }));
                                      }}
                                      className="w-8 h-8 md:w-10 md:h-10 rounded-lg border text-sm font-semibold transition disabled:opacity-40"
                                      style={{
                                        borderColor: sizeErrors[key]
                                          ? "#ef4444"
                                          : isActive
                                            ? theme.secondary
                                            : `${theme.secondary}55`,
                                        backgroundColor: isActive
                                          ? theme.secondary
                                          : "white",
                                        color: isActive
                                          ? "white"
                                          : theme.secondary,
                                      }}
                                    >
                                      {sizeValue.toUpperCase()}
                                    </button>
                                  );
                                })}
                              </div>

                              {sizeErrors[key] && (
                                <div className="text-xs text-red-500 mt-1">
                                  Please select size
                                </div>
                              )}
                            </div>
                          );
                        })}

                    <div className="flex justify-between items-center mt-auto">
                      <div
                        className="text-base md:text-lg font-semibold"
                        style={{ color: theme.secondary }}
                      >
                        ฿ {Number(item.min_amount || 0).toLocaleString()}
                      </div>

                      {user && canPlaceOrder && (
                        <div
                          className="mt-1 flex items-center rounded-full px-1 text-sm"
                          style={{ backgroundColor: `${theme.accent}80` }}
                        >
                          <button
                            onClick={() => dec(item, selections)}
                            disabled={qty === 0 || !canPlaceOrder}
                            className="w-6 h-6 rounded-full text-white flex justify-center items-center disabled:opacity-30"
                            style={{ backgroundColor: `${theme.secondary}80` }}
                          >
                            −
                          </button>

                          <span className="px-2 font-semibold text-textMain">
                            {qty}
                          </span>

                          <button
                            onClick={() => handleAdd(item)}
                            disabled={!canPlaceOrder}
                            className="w-6 h-6 rounded-full text-white flex justify-center items-center disabled:opacity-30"
                            style={{ backgroundColor: theme.secondary }}
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
