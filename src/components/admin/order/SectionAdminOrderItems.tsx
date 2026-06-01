"use client";

import ImagePreviewModal from "@/components/ImagePreviewModal";
import { driveThumb } from "@/lib/workUtils";

type CartSelection = {
  reward_item_id: string;
  item_name: string;
  option_name: string;
  selected_option: string;
  qty: number;
};

type Props = {
  rewards: any[];

  cart: Record<string, any>;

  addReward: (
    reward: any,
    selections: CartSelection[],
  ) => void;

  removeReward: (
    reward: any,
    selections: CartSelection[],
  ) => void;
};

function buildCartKey(
  rewardId: string,
  selections: CartSelection[],
) {
  const optionPart = selections
    .map(
      (s) =>
        `${s.reward_item_id}:${s.option_name}:${s.selected_option}`,
    )
    .sort()
    .join("|");

  return optionPart
    ? `${rewardId}|${optionPart}`
    : rewardId;
}

export default function SectionAdminOrderItems({
  rewards,
  cart,
  addReward,
  removeReward,
}: Props) {
  const selectedOptions: Record<
    string,
    string
  > = {};

  function getOptionItems(
    reward: any,
  ) {
    return (
      reward?.items?.filter(
        (x: any) =>
          Number(
            x.has_option,
          ) === 1,
      ) || []
    );
  }

  function getSelections(
    reward: any,
  ): CartSelection[] {
    return getOptionItems(
      reward,
    ).map((item: any) => ({
      reward_item_id:
        String(item.id),

      item_name: String(
        item.item_name ||
          "",
      ),

      option_name: String(
        item.option_name ||
          "option",
      ),

      selected_option:
        selectedOptions[
          `${reward.id}_${item.id}`
        ] || "",

      qty: Number(
        item.qty || 1,
      ),
    }));
  }

  function getQty(
    reward: any,
  ) {
    const selections =
      getSelections(reward);

    const key =
      buildCartKey(
        reward.id,
        selections,
      );

    return (
      cart[key]?.qty || 0
    );
  }

  return (
    <section className="space-y-4">
      <div className="font-semibold text-lg">
        Select Items
      </div>

      <div className="grid grid-cols-12 gap-4">
        {rewards.map(
          (reward: any) => {
            const qty = getQty(reward);

            const selections = getSelections(reward);

            return (
              <div
                key={reward.id}
                className="col-span-6 md:col-span-6 lg:col-span-4"
              >
                <div className="bg-white border rounded-lg overflow-hidden shadow-sm h-full flex flex-col">
                  <ImagePreviewModal
                    src={driveThumb(reward.image_url)}
                    alt={reward.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-4 flex flex-col flex-1">
                    <div className="font-semibold text-lg">
                      {reward.title}
                    </div>

                    {!!reward.description && (
                      <div className="text-sm text-gray-500 mt-1">
                        {reward.description}
                      </div>
                    )}

                    {!!reward.items
                      ?.length && (
                      <div className="text-xs text-gray-500 mt-2">
                        {reward.items.map((x: any) =>x.item_name).join(", ")}
                      </div>
                    )}

                    <div className="mt-4 text-xl font-bold">
                      ฿ {Number(reward.price || reward.min_amount || 0).toLocaleString()}
                    </div>

                    <div className="mt-auto pt-4 flex justify-center items-center gap-4">
                      <button
                        type="button"
                        onClick={() => removeReward(reward, selections)}
                        disabled={qty === 0}
                        className="w-8 h-8 rounded-full border border-pinkSecondary disabled:opacity-40
                        "
                      >
                        −
                      </button>

                      <div className="w-8 text-center font-semibold">
                        {qty}
                      </div>

                      <button
                        type="button"
                        onClick={() => addReward(reward, selections)}
                        className="w-8 h-8 rounded-full bg-pinkSecondary text-white"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          },
        )}
      </div>
    </section>
  );
}