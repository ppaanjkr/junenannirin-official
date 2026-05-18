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

type Props = {
  data: Reward[];
  theme: Theme;
  user: any;
  cart: Record<string, CartLine>;
  inc: (reward: Reward, selections: CartSelection[]) => void;
  dec: (reward: Reward, selections: CartSelection[]) => void;
  canPlaceOrder: boolean;
  previewMode?: boolean;
};

function buildCartKey(rewardId: string, selections: CartSelection[]) {
  const optionPart = selections
    .map((s) => `${s.reward_item_id}:${s.option_name}:${s.selected_option}`)
    .sort()
    .join("|");

  return optionPart ? `${rewardId}|${optionPart}` : rewardId;
}

export default function SectionItems({
  data,
  theme,
  user,
  cart,
  inc,
  dec,
  canPlaceOrder,
  previewMode = false,
}: Props) {
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});

  const [optionErrors, setOptionErrors] = useState<Record<string, boolean>>({});

  const itemCount = Object.values(cart).reduce(
    (sum, line) => sum + line.qty,
    0,
  );

  function getOptionItems(item: Reward) {
    return (item.items || []).filter((ri: any) => Number(ri.has_option) === 1);
  }

  function getSelections(item: Reward): CartSelection[] {
    return getOptionItems(item).map((ri: any) => {
      const key = `${item.id}_${ri.id}`;
      const selected = selectedOptions[key] ?? "";

      return {
        reward_item_id: String(ri.id),
        item_name: String(ri.item_name || ""),
        option_name: String(ri.option_name || "option"),
        selected_option: selected,
        qty: Number(ri.qty || 1),
      };
    });
  }

  function getQty(item: Reward) {
    const selections = getSelections(item);
    const key = buildCartKey(String(item.id), selections);

    return cart[key]?.qty || 0;
  }

  function handleAdd(item: Reward) {
    if (previewMode) return;
    if (!canPlaceOrder) return;

    const optionItems = getOptionItems(item);

    const errors: Record<string, boolean> = {};
    let hasError = false;

    optionItems.forEach((ri: any) => {
      const key = `${item.id}_${ri.id}`;
      const selected = selectedOptions[key] ?? "";

      if (!selected) {
        errors[key] = true;
        hasError = true;
      }
    });

    if (hasError) {
      setOptionErrors((prev) => ({
        ...prev,
        ...errors,
      }));

      return;
    }

    const selections = getSelections(item);

    inc(item, selections);
  }

  const showActions = user || previewMode;

  return (
    <section>
      <div className="flex justify-between items-center mt-6">
        <span className="text-xl font-semibold">Items</span>

        {canPlaceOrder && (
          <span className="text-sm text-text-sub">{itemCount} items</span>
        )}

        {previewMode && (
          <span className="text-sm text-text-sub">Preview only</span>
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

                    {/* OPTION SELECTORS */}
                    {showActions &&
                      getOptionItems(item).map((ri: any) => {
                        const key = `${item.id}_${ri.id}`;
                        const value = selectedOptions[key] ?? "";

                        const optionName = String(ri.option_name || "option");

                        const options = Array.isArray(ri.options)
                          ? ri.options
                          : [];

                        return (
                          <div key={String(ri.id)} className="mt-2">
                            <label className="text-xs text-textSub">
                              {ri.item_name} {optionName}
                            </label>

                            <div className="mt-1 flex flex-wrap gap-1">
                              {options.map((option: any) => {
                                const optionValue = String(
                                  option.option_value || "",
                                );

                                const isActive =
                                  String(value).toLowerCase() ===
                                  optionValue.toLowerCase();

                                return (
                                  <button
                                    key={String(
                                      option.id || option.option_value,
                                    )}
                                    type="button"
                                    disabled={previewMode || !canPlaceOrder}
                                    onClick={() => {
                                      if (previewMode) return;
                                      if (!canPlaceOrder) return;

                                      setSelectedOptions((prev) => ({
                                        ...prev,
                                        [key]: optionValue,
                                      }));

                                      setOptionErrors((prev) => ({
                                        ...prev,
                                        [key]: false,
                                      }));
                                    }}
                                    className="min-w-8 h-8 md:min-w-10 md:h-10 px-2 rounded-lg border text-sm font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed"
                                    style={{
                                      borderColor: optionErrors[key]
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
                                    {optionValue.toUpperCase()}
                                  </button>
                                );
                              })}
                            </div>

                            {optionErrors[key] && (
                              <div className="text-xs text-red-500 mt-1">
                                Please select {optionName}
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

                      {showActions && (
                        <div
                          className="mt-1 flex items-center rounded-full px-1 text-sm"
                          style={{ backgroundColor: `${theme.accent}80` }}
                        >
                          <button
                            onClick={() => {
                              if (previewMode) return;
                              dec(item, selections);
                            }}
                            disabled={previewMode || qty === 0 || !canPlaceOrder}
                            className="w-6 h-6 rounded-full text-white flex justify-center items-center disabled:opacity-30 disabled:cursor-not-allowed"
                            style={{ backgroundColor: `${theme.secondary}80` }}
                          >
                            −
                          </button>

                          <span className="px-2 font-semibold text-textMain">
                            {qty}
                          </span>

                          <button
                            onClick={() => handleAdd(item)}
                            disabled={previewMode || !canPlaceOrder}
                            className="w-6 h-6 rounded-full text-white flex justify-center items-center disabled:opacity-30 disabled:cursor-not-allowed"
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