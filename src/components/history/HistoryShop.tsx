import { HistoryShop } from "@/lib/api/types";
import ImagePreviewModal from "../ImagePreviewModal";
import { driveThumb } from "@/lib/workUtils";
import { formatThaiDateWithTime } from "@/lib/formatThaiDate";
import { formatTHB } from "@/lib/formatTHB";

type Props = {
  className?: string;
  data: HistoryShop[] | null;
};

export default function SectionHistoryShop({ className = "", data }: Props) {
  return (
    <section className={className}>
      <h2 className="text-sm text-textsub mb-2 font-semibold">Last Order</h2>

      <div className="grid grid-cols-12 gap-2">
        {data && data.length > 0 ? (
          data.map((order) => {
            const orderItems = order.items ?? [];

            return (
              <div
                key={order.order_id}
                className="col-span-12 md:col-span-6 bg-white border border-pinkAccent rounded-xl shadow-sm p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-pinkAccent overflow-hidden shrink-0">
                    {order.project?.image_url && (
                      <ImagePreviewModal
                        src={driveThumb(order.project.image_url)}
                        alt={order.project.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold">{order.project?.name}</p>

                    <p className="text-[11px] text-textSub">
                      Order: {order.order_no || order.order_id}
                    </p>

                    <p className="text-xs text-textSub">
                      {formatTHB(order.amount || 0)} THB •{" "}
                      {formatThaiDateWithTime(order.created_at)}
                    </p>
                  </div>
                </div>

                <div className="mt-3 space-y-2 text-xs">
                  {orderItems.length > 0 ? (
                    orderItems
                      .slice()
                      .sort(
                        (a, b) =>
                          Number(a.price || 0) - Number(b.price || 0),
                      )
                      .map((item, i) => {
                        const details = Array.isArray(item.details)
                          ? item.details
                          : [];

                        const shouldShowDetails =
                          details.length > 0 &&
                          details.some((d: any) => {
                            const selectedOption =
                              d.selected_option || d.selected_size || "";

                            return String(selectedOption).trim() !== "";
                          });

                        return (
                          <div
                            key={`${item.reward_id}_${i}`}
                            className="text-textSub border-b border-pinkAccent/40 pb-2 last:border-b-0 last:pb-0"
                          >
                            <div className="flex justify-between gap-2">
                              <div className="w-4/5 flex flex-col min-w-0">
                                <span className="truncate">
                                  {item.title} x {Number(item.qty || 0)}
                                </span>
                              </div>

                              <span className="whitespace-nowrap">
                                {formatTHB(item.total || 0)} THB
                              </span>
                            </div>

                            {shouldShowDetails && (
                              <div className="mt-1 flex flex-col gap-1">
                                {details.map((detail: any, index: number) => {
                                  const optionName =
                                    detail.option_name ||
                                    (detail.selected_size ? "size" : "");

                                  const selectedOption =
                                    detail.selected_option ||
                                    detail.selected_size ||
                                    "";

                                  if (!selectedOption) return null;

                                  return (
                                    <div
                                      key={`${detail.reward_item_id}_${optionName}_${selectedOption}_${index}`}
                                      className="flex justify-between gap-2 text-[11px] rounded-md px-2 py-1 bg-pinkAccent/30"
                                    >
                                      <span className="truncate">
                                        {detail.item_name}
                                        {optionName && (
                                          <>
                                            :{" "}
                                            {String(optionName)
                                              .charAt(0)
                                              .toUpperCase() +
                                              String(optionName).slice(1)}{" "}
                                            {String(
                                              selectedOption,
                                            ).toUpperCase()}
                                          </>
                                        )}
                                      </span>

                                      <span className="font-semibold whitespace-nowrap">
                                        x {Number(detail.qty || 0)}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })
                  ) : (
                    <div className="text-xs text-textSub border border-pinkAccent/40 rounded-lg p-3 text-center">
                      No items
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-12 bg-white border border-pinkAccent rounded-xl shadow-sm p-3 flex justify-center items-center h-[200px] text-sm">
            No Data
          </div>
        )}
      </div>
    </section>
  );
}