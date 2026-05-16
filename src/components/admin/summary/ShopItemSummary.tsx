import ImagePreviewModal from "@/components/ImagePreviewModal";
import { formatTHB } from "@/lib/formatTHB";
import { driveThumb } from "@/lib/workUtils";
import { format } from "path";

type Props = {
  shop: any;
};
export default function ShopItemSummary({ shop }: Props) {
  return (
    <section className="mt-4">
      {/* item set */}
      <div className="bg-white rounded-lg p-4 shadow-soft border border-pinkAccent">
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <span className="w-1.5 h-4 bg-pinkSecondary rounded-full"></span>
          Product Summary
        </h2>
        <div className="mt-4 grid grid-cols-12 gap-4">
          {shop &&
            shop.rewardSummary &&
            shop.rewardSummary.map((item: any) => (
              <div
                key={item.reward_id}
                className="col-span-12 flex justify-between gap-3"
              >
                {/* left */}
                <div className="flex gap-3 min-w-0">
                  <ImagePreviewModal
                    src={driveThumb(item.image_url)}
                    alt={item.title}
                    className="w-24 h-full md:w-32 object-cover rounded-md border border-pinkAccent flex-shrink-0"
                  />
                  {/* <img
                    src="/test.jpg"
                    alt=""
                    className="w-24 h-24 object-cover rounded-md border border-pinkAccent flex-shrink-0"
                  /> */}

                  <div className="flex flex-col min-w-0">
                    <span className="break-words">{item.title}</span>

                    <span className="text-sm text-textSub">
                      ฿ {formatTHB(item.price || 0)} / set
                    </span>
                  </div>
                </div>

                {/* right */}
                <span className="font-semibold text-pinkSecondary whitespace-nowrap">
                  {item.qty} orders
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* items */}
      <div className="bg-white rounded-lg p-4 shadow-soft border border-pinkAccent mt-4">
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <span className="w-1.5 h-4 bg-pinkSecondary rounded-full"></span>
          Items Usage
        </h2>
        <div className="mt-4 grid grid-cols-12 gap-2">
          {shop &&
            shop.itemSummary &&
            shop.itemSummary.map((item: any) => (
              <div
                key={item.name}
                className="col-span-6 md:col-span-4 flex flex-col justify-center items-center rounded-md border border-pinkAccent p-2"
              >
                <span className="font-semibold text-pinkSecondary text-lg">
                  {item.qty}
                </span>
                <span className="text-sm">{item.name}</span>
              </div>
            ))}
        </div>
      </div>

      {/* items by size */}
      {shop?.sizeSummary && shop.sizeSummary.length > 0 && (
        <div className="bg-white rounded-lg p-4 shadow-soft border border-pinkAccent mt-4">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-pinkSecondary rounded-full"></span>
            Items Usage by Size
          </h2>

          <div className="mt-4 grid grid-cols-12 gap-2">
            {shop.sizeSummary.flatMap((item: any) =>
              (item.sizes || []).map((size: any) => (
                <div
                  key={`${item.item_name}_${size.size}`}
                  className="col-span-6 md:col-span-4 flex flex-col justify-center items-center rounded-md border border-pinkAccent p-2"
                >
                  <span className="font-semibold text-pinkSecondary text-lg">
                    {size.qty}
                  </span>

                  <span className="text-sm text-center">
                    {item.item_name} - {String(size.size).toUpperCase()}
                  </span>
                </div>
              )),
            )}
          </div>
        </div>
      )}
    </section>
  );
}
