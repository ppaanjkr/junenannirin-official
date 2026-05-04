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
    <section>
      <h2 className="text-sm text-textsub mb-2 font-semibold">
        Last Order
      </h2>

      <div className="grid grid-cols-12 gap-2">
        {data &&
          data.length > 0 ?
          data.map((order) => (
            <div
              key={order.order_id}
              className="col-span-12 md:col-span-6 bg-white border border-pinkAccent rounded-xl shadow-sm p-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-pinkAccent overflow-hidden">
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
                  <p className="text-xs text-textSub">
                    {formatTHB(order.amount || 0)} THB •{" "}
                    {formatThaiDateWithTime(order.created_at)}
                  </p>
                </div>
              </div>

              <div className="mt-3 space-y-1 text-xs">
                {order.items
                  .slice()
                  .sort((a, b) => a.price - b.price)
                  .map((item, i) => (
                    <div key={i} className="text-textSub flex justify-between">
                      <div className=" w-4/5 flex flex-col">
                        <span className="">{item.title} x {item.qty} </span>
                      </div>
                      <span>{item.total} THB</span>
                    </div>
                  ))}
              </div>
            </div>
          )) : (
            <div className="col-span-12 bg-white border border-pinkAccent rounded-xl shadow-sm p-3 flex justify-center items-center h-[200px] text-sm">No Data</div>
          )}
      </div>
    </section>
  );
}
