import { fileToBase64 } from "@/lib/admin-project/fileToBase64";
import { ProjectFormState } from "@/lib/admin-project/projectFormDefault";
import { Plus, X } from "lucide-react";

type Props = {
  form: ProjectFormState;
  updateForm: <K extends keyof ProjectFormState>(
    key: K,
    value: ProjectFormState[K],
  ) => void;
};

export default function ProjectRewardSection({ form, updateForm }: Props) {
  const title = form.type === "shop" ? "Products" : "Rewards";

  function addReward() {
    updateForm("rewards", [
      ...form.rewards,
      {
        title: "",
        description: "",
        min_amount: 0,
        price: 0,
        image_url: "",
        image_file: null,
        items: [],
      },
    ]);
  }

  function updateReward(index: number, key: string, value: any) {
    const next = [...form.rewards];

    next[index] = {
      ...next[index],
      [key]: value,
    };

    updateForm("rewards", next);
  }

  async function updateRewardImage(index: number, file?: File) {
    if (!file) return;

    const imageFile = await fileToBase64(file);
    const previewUrl = URL.createObjectURL(file);

    const next = [...form.rewards];

    next[index] = {
      ...next[index],
      image_file: imageFile,
      image_url: previewUrl,
    };

    updateForm("rewards", next);
  }

  function removeReward(index: number) {
    updateForm(
      "rewards",
      form.rewards.filter((_, i) => i !== index),
    );
  }

  function addItem(rewardIndex: number) {
    const next = [...form.rewards];

    next[rewardIndex].items = [
      ...next[rewardIndex].items,
      {
        item_name: "",
        qty: 1,
        has_option: 0,
        option_name: "",
        options: [],
      },
    ];

    updateForm("rewards", next);
  }

  function updateItem(
    rewardIndex: number,
    itemIndex: number,
    key: string,
    value: any,
  ) {
    const next = [...form.rewards];

    next[rewardIndex].items[itemIndex] = {
      ...next[rewardIndex].items[itemIndex],
      [key]: value,
    };

    if (key === "has_option" && Number(value) === 0) {
      next[rewardIndex].items[itemIndex].option_name = "";
      next[rewardIndex].items[itemIndex].options = [];
    }

    if (key === "has_option" && Number(value) === 1) {
      next[rewardIndex].items[itemIndex].option_name =
        next[rewardIndex].items[itemIndex].option_name || "size";
    }

    updateForm("rewards", next);
  }

  function removeItem(rewardIndex: number, itemIndex: number) {
    const next = [...form.rewards];

    next[rewardIndex].items = next[rewardIndex].items.filter(
      (_, i) => i !== itemIndex,
    );

    updateForm("rewards", next);
  }

  function addOption(rewardIndex: number, itemIndex: number) {
    const next = [...form.rewards];

    next[rewardIndex].items[itemIndex].options = [
      ...next[rewardIndex].items[itemIndex].options,
      { option_value: "" },
    ];

    updateForm("rewards", next);
  }

  function updateOption(
    rewardIndex: number,
    itemIndex: number,
    optionIndex: number,
    value: string,
  ) {
    const next = [...form.rewards];

    next[rewardIndex].items[itemIndex].options[optionIndex] = {
      option_value: value,
    };

    updateForm("rewards", next);
  }

  function removeOption(
    rewardIndex: number,
    itemIndex: number,
    optionIndex: number,
  ) {
    const next = [...form.rewards];

    next[rewardIndex].items[itemIndex].options = next[rewardIndex].items[
      itemIndex
    ].options.filter((_, i) => i !== optionIndex);

    updateForm("rewards", next);
  }

  function updateRewardPrice(rewardIndex: number, value: number) {
    const next = [...form.rewards];

    next[rewardIndex] = {
      ...next[rewardIndex],
      price: value,
      min_amount: value,
    };

    updateForm("rewards", next);
  }

  return (
    <section className="bg-white rounded-xl shadow-sm border border-pinkAccent p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-textMain flex items-center gap-2">
          <span className="w-1.5 h-4 bg-pinkSecondary rounded-full"></span>
          {title}
        </h2>

        <button
          type="button"
          onClick={addReward}
          className="text-xs px-3 py-1.5 rounded-full bg-pinkAccent text-pinkSecondary font-medium flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          Add {form.type === "shop" ? "Product" : "Reward"}
        </button>
      </div>

      <div className="space-y-4">
        {form.rewards.map((reward, rewardIndex) => (
          <div
            key={`reward_${rewardIndex}`}
            className="rounded-2xl border border-pinkAccent bg-pinkAccent/20 p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-pinkSecondary">
                {form.type === "shop" ? "Product" : "Reward"} {rewardIndex + 1}
              </span>

              <button
                type="button"
                onClick={() => removeReward(rewardIndex)}
                className="w-8 h-8 rounded-full bg-white text-red-400 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-12 gap-2">
              <input
                type="text"
                value={reward.title}
                onChange={(e) =>
                  updateReward(rewardIndex, "title", e.target.value)
                }
                placeholder={
                  form.type === "shop" ? "Product name" : "Reward title"
                }
                className="col-span-12 rounded-lg border border-pinkAccent bg-white px-3 py-2 text-sm outline-none"
              />

              <input
                type="number"
                value={
                  form.type === "shop"
                    ? reward.price === 0
                      ? ""
                      : reward.price
                    : reward.min_amount === 0
                      ? ""
                      : reward.min_amount
                }
                onChange={(e) => {
                  const value = Number(e.target.value || 0);

                  if (form.type === "shop") {
                    updateRewardPrice(rewardIndex, value);
                  } else {
                    updateReward(rewardIndex, "min_amount", value);
                  }
                }}
                placeholder={form.type === "shop" ? "Price" : "Min amount"}
                className="col-span-12 md:col-span-6 rounded-lg border border-pinkAccent bg-white px-3 py-2 text-sm outline-none"
              />

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  updateRewardImage(rewardIndex, e.target.files?.[0])
                }
                className="col-span-12 md:col-span-6 rounded-lg border border-pinkAccent bg-white px-3 py-2 text-sm outline-none file:mr-3 file:rounded-md file:border-0 file:bg-pinkAccent file:px-3 file:py-1 file:text-pinkSecondary"
              />

              <textarea
                value={reward.description}
                onChange={(e) =>
                  updateReward(rewardIndex, "description", e.target.value)
                }
                placeholder="Description"
                rows={2}
                className="col-span-12 rounded-lg border border-pinkAccent bg-white px-3 py-2 text-sm outline-none resize-none"
              />
            </div>

            <div className="mt-4 rounded-xl bg-white border border-pinkAccent p-3">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="text-sm font-semibold text-textMain">
                    What buyers will receive
                  </p>
                  <p className="text-xs text-textSub mt-0.5">
                    Add items included in this product, เช่น Cap, T-shirt, Card
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => addItem(rewardIndex)}
                  className="shrink-0 text-xs px-3 py-1.5 rounded-full bg-pinkAccent text-pinkSecondary font-medium"
                >
                  Add Item
                </button>
              </div>

              <div className="space-y-2">
                {reward.items.map((item, itemIndex) => (
                  <div
                    key={`reward_${rewardIndex}_item_${itemIndex}`}
                    className="rounded-xl bg-pinkAccent/30 border border-pinkAccent p-3"
                  >
                    <div className="grid grid-cols-12 gap-2">
                      <input
                        type="text"
                        value={item.item_name}
                        onChange={(e) =>
                          updateItem(
                            rewardIndex,
                            itemIndex,
                            "item_name",
                            e.target.value,
                          )
                        }
                        placeholder="Item name e.g. T-shirt"
                        className={`${
                          form.type === "shop"
                            ? "col-span-10 md:col-span-6"
                            : "col-span-12 md:col-span-6"
                        } rounded-lg border border-pinkAccent bg-white px-3 py-2 text-sm outline-none`}
                      />

                      {form.type !== "shop" && (
                        <input
                          type="number"
                          min={1}
                          value={item.qty || ""}
                          onChange={(e) =>
                            updateItem(
                              rewardIndex,
                              itemIndex,
                              "qty",
                              Number(e.target.value || 1),
                            )
                          }
                          placeholder="Qty"
                          className="col-span-5 md:col-span-2 rounded-lg border border-pinkAccent bg-white px-3 py-2 text-sm outline-none"
                        />
                      )}

                      <select
                        value={item.has_option}
                        onChange={(e) =>
                          updateItem(
                            rewardIndex,
                            itemIndex,
                            "has_option",
                            Number(e.target.value),
                          )
                        }
                        className={`${
                          form.type === "shop"
                            ? "col-span-10 md:col-span-5"
                            : "col-span-5 md:col-span-3"
                        } rounded-lg border border-pinkAccent bg-white px-3 py-2 text-sm outline-none`}
                      >
                        <option value={0}>No option</option>
                        <option value={1}>Has option</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => removeItem(rewardIndex, itemIndex)}
                        className="col-span-2 md:col-span-1 rounded-lg bg-red-50 text-red-400 flex items-center justify-center"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {Number(item.has_option) === 1 && (
                      <div className="mt-3 rounded-lg bg-white p-3 border border-pinkAccent">
                        <label className="block text-xs text-textSub mb-1">
                          Option name
                        </label>

                        <input
                          type="text"
                          value={item.option_name}
                          onChange={(e) =>
                            updateItem(
                              rewardIndex,
                              itemIndex,
                              "option_name",
                              e.target.value,
                            )
                          }
                          placeholder="size / color"
                          className="w-full rounded-lg border border-pinkAccent px-3 py-2 text-sm outline-none"
                        />

                        <div className="mt-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-textSub">
                              Option values
                            </span>

                            <button
                              type="button"
                              onClick={() => addOption(rewardIndex, itemIndex)}
                              className="text-xs px-2 py-1 rounded-full bg-pinkAccent text-pinkSecondary"
                            >
                              Add Value
                            </button>
                          </div>

                          <div className="space-y-2">
                            {item.options.map((option, optionIndex) => (
                              <div
                                key={`reward_${rewardIndex}_item_${itemIndex}_option_${optionIndex}`}
                                className="flex gap-2"
                              >
                                <input
                                  type="text"
                                  value={option.option_value}
                                  onChange={(e) =>
                                    updateOption(
                                      rewardIndex,
                                      itemIndex,
                                      optionIndex,
                                      e.target.value,
                                    )
                                  }
                                  placeholder="S / M / L / White / Black"
                                  className="flex-1 rounded-lg border border-pinkAccent px-3 py-2 text-sm outline-none"
                                />

                                <button
                                  type="button"
                                  onClick={() =>
                                    removeOption(
                                      rewardIndex,
                                      itemIndex,
                                      optionIndex,
                                    )
                                  }
                                  className="w-10 rounded-lg bg-red-50 text-red-400 flex items-center justify-center"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}

                            {item.options.length === 0 && (
                              <p className="text-xs text-textSub">
                                No option values yet
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {reward.items.length === 0 && (
                  <div className="rounded-xl border border-dashed border-pinkAccent py-6 text-center">
                    <p className="text-sm font-medium text-textMain">
                      No included items yet
                    </p>
                    <p className="text-xs text-textSub mt-1">
                      Add what buyers will receive from this product
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {form.rewards.length === 0 && (
          <p className="text-xs text-textSub text-center py-6">
            No {title.toLowerCase()}
          </p>
        )}
      </div>
    </section>
  );
}
