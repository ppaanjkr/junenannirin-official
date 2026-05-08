import { useState } from "react";
import { Reward } from "@/lib/api/types";
import { driveThumb } from "@/lib/workUtils";
import ImagePreviewModal from "@/components/ImagePreviewModal";

type Theme = {
  secondary: string;
  accent: string;
};
interface Props {
  items: Reward[];
  theme: Theme;
}
export default function SectionItems({
  data,
  theme,
  user,
  cart,
  inc,
  dec,
  canPlaceOrder
}: {
  data: Reward[];
  theme: Theme;
  user: any;
  cart: Record<number, number>;
  inc: (id: number) => void;
  dec: (id: number) => void;
  canPlaceOrder: boolean;
}) {
  const itemCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  return (
    <section>
      <div className="flex justify-between items-center mt-6">
        <span className="text-xl font-semibold">Items</span>
        {canPlaceOrder && <span className="text-sm text-text-sub">{itemCount} items</span>}
        {/* <span className="text-sm text-text-sub" id="itemCount">
          {itemCount} items
        </span> */}
      </div>
      {data && data.length > 0 && (
        <div className="grid grid-cols-12 gap-3 md:gap-4 items-stretch">
          {data.map((item) => {
            const qty = cart[item.id] || 0;

            return (
              <div key={item.id} className="col-span-6 lg:col-span-4">
                <div
                  className="bg-white border rounded-lg overflow-hidden shadow-sm flex flex-col h-full"
                  style={{ borderColor: `${theme.secondary}33` }}
                >
                  {/* IMAGE */}
                  {/* <img
                    src={driveThumb(item.image_url)}
                    className="w-full h-40 md:h-56 object-cover"
                    loading="lazy"
                  /> */}
                  <ImagePreviewModal src={driveThumb(item.image_url)} className="w-full h-56 md:h-72 object-cover"/>
                  {/* <ImagePreviewModal src={`test.jpg`} className="w-full h-56 md:h-72 object-cover"/> */}

                  {/* CONTENT */}
                  <div className="py-3 px-2 flex flex-col gap-1 flex-1">
                    {/* title */}
                    <h3
                      className="font-semibold text-base md:text-lg"
                      style={{ color: theme.secondary }}
                    >
                      {item.title}
                    </h3>

                    {/* desc */}
                    <p className="text-textSub text-sm ">
                      {item.description}
                    </p>

                    {/* price + qty */}
                    <div className="flex justify-between items-center mt-auto">
                      {/* price */}
                      <div
                        className="text-base md:text-lg font-semibold"
                        style={{ color: theme.secondary }}
                      >
                        ฿ {Number(item.min_amount || 0).toLocaleString()}
                      </div>

                      {/* qty */}
                      {user && canPlaceOrder && (
                        <div
                          className="flex items-center rounded-full px-1 text-sm"
                          style={{ backgroundColor: `${theme.accent}80` }}
                        >
                          <button
                            onClick={() => dec(item.id)}
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
                            onClick={() => inc(item.id)}
                            disabled={!canPlaceOrder}
                            className="w-6 h-6 rounded-full text-white flex justify-center items-center"
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
