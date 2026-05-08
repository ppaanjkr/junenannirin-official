import ImagePreviewModal from "@/components/ImagePreviewModal";
import { formatTHB } from "@/lib/formatTHB";
import { driveThumb } from "@/lib/workUtils";

type Props = {
  items?: any | null;
};
export default function ProjectShopItem({ items }: Props) {
  return (
    <section className="mt-4">
      <div className="bg-white rounded-lg p-4 shadow-soft border border-pinkAccent">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-pinkSecondary rounded-full"></span>
            Items
          </h2>
        </div>

        <div className="mt-4 grid grid-cols-12 gap-2">
          {items &&
            items.map((item: any) => (
              <div key={item.reward_id} className="col-span-12 flex gap-3">
                <ImagePreviewModal
                  src={driveThumb(item.image_url)}
                  alt={item.title}
                  className="w-24 h-24 object-cover rounded-md border border-pinkAccent flex-shrink-0"
                />
                <div className="flex flex-col justify-between min-w-0">
                  <div className="flex flex-col">
                    <span className="break-words font-semibold">
                      {item.title}
                    </span>
                    <span className="break-words text-sm text-textSub">
                      {item.description}
                    </span>
                  </div>

                  <span className="">฿ {formatTHB(item.price || 0)} / set</span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
