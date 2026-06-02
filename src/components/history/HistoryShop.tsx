import { HistoryShop } from "@/lib/api/types";
import ImagePreviewModal from "../ImagePreviewModal";
import { driveThumb } from "@/lib/workUtils";
import { formatThaiDateWithTime } from "@/lib/formatThaiDate";
import { formatTHB } from "@/lib/formatTHB";
import { useMemo, useState } from "react";

type Props = {
  className?: string;
  data: HistoryShop[] | null;
};

export default function SectionHistoryShop({ className = "", data }: Props) {
  const groupedProjects = useMemo(() => {
    if (!data?.length) return [];

    const map = new Map();

    data.forEach((order) => {
      const projectId = order.project?.id || "unknown";

      if (!map.has(projectId)) {
        map.set(projectId, {
          project: order.project,
          orders: [],
          totalAmount: 0,
        });
      }

      const group = map.get(projectId);

      group.orders.push(order);

      group.totalAmount += Number(order.amount || 0);
    });

    return Array.from(map.values());
  }, [data]);

  const [expandedProjects, setExpandedProjects] = useState<
    Record<string, boolean>
  >({});
  function toggleProject(projectId: string) {
    setExpandedProjects((prev) => ({
      ...prev,
      [projectId]: !prev[projectId],
    }));
  }

  return (
    <section className={className}>
      {/* <h2 className="text-sm text-textsub mb-2 font-semibold">Last Order</h2> */}

      <div className="grid grid-cols-12 gap-2">
        {groupedProjects && groupedProjects.length > 0 ? (
          groupedProjects.map((group) => {
            const orderItems = group.items ?? [];
            const isExpanded = expandedProjects[group.project.id];

            return (
              <div
                key={group.project.id}
                className="col-span-12 bg-white border border-pinkAccent rounded-lg shadow-sm overflow-hidden "
              >
                <div className="py-2 px-4 border-b border-pinkAccent">
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden mt-2">
                      <ImagePreviewModal
                        src={driveThumb(group.project.image_url)}
                        alt={group.project.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <p className="font-semibold">{group.project.name}</p>

                      <p className="text-xs text-textSub">
                        Total {formatTHB(group.totalAmount)} THB
                      </p>
                      {group.orders[0]?.shipment && (
                        <div className="mt-1 text-xs text-textSub space-y-1">
                          <div>
                            Tracking :{" "}
                            {group.orders[0].shipment.tracking_no || "-"}  
                            {group.orders[0].shipment.carrier && (
                              ` (${group.orders[0].shipment.carrier})`
                            )}
                          </div>
                        </div>
                      )}
                      <div className="flex justify-end mt-3">
                        <button
                          type="button"
                          onClick={() => toggleProject(group.project.id)}
                          className="text-sm font-medium text-pink-500"
                        >
                          {isExpanded
                            ? "Hide Orders ▲ "
                            : `View Orders (${group.orders.length}) ▼ `}
                        </button>
                    </div>
                    </div>
                  </div>
                </div>
                {isExpanded && (
                  
                <div className="px-4">
                  {group.orders.map((order: any) => (
                    <div
                      key={order.order_no}
                      className="py-3 border-b border-pinkAccent last:border-b-0"
                    >
                      <div className="flex justify-between items-start text-sm">
                        <div>
                          <span>{order.order_no}</span>

                          <div className="text-xs text-textSub">
                            {formatThaiDateWithTime(order.created_at)}
                          </div>
                        </div>

                        <div className="font-semibold whitespace-nowrap">
                          {formatTHB(order.amount)} THB
                        </div>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-2">
                        {(order.items || []).map((item: any) => (
                          <span
                            key={item.user_reward_id}
                            className="px-2 py-1 rounded-full bg-pinkAccent/30 text-xs"
                          >
                            {item.title} × {item.qty}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                )}
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
