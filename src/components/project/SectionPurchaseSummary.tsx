import { UserPurchaseSummery } from "@/lib/api/types";
import { formatTHB } from "@/lib/formatTHB";
import { ShoppingCart, Truck } from "lucide-react";

type Theme = {
  secondary: string;
  accent: string;
};

export default function SectionPurchaseSummary({
  data,
  theme,
  user,
}: {
  data: UserPurchaseSummery | null;
  theme: Theme;
  user: any;
}) {
  return (
    <section className="mt-4">
      <div className="flex justify-between items-center mt-6">
        <span className="text-xl font-semibold">Your Purchase</span>
      </div>

      <div
        className="grid grid-cols-12 gap-4 bg-white rounded-md p-4 shadow-sm border mt-1 md:items-stretch"
        style={{
          borderColor: `${theme.accent}`,
        }}
      >
        <div className="col-span-12 md:col-span-6">
          <div className="mb-2 font-semibold">
            <span>Hello, </span>
            <span
              style={{
                color: `${theme.secondary}`,
              }}
            >
              {user.username}
            </span>
          </div>

          <div
            className="rounded-lg p-3 border"
            style={{
              backgroundColor: `${theme.accent}40`,
              color: `${theme.secondary}`,
              borderColor: `${theme.accent}`,
            }}
          >
            <span className="text-sm">Your Total Spending</span>

            <div className="text-2xl flex gap-3 font-semibold">
              <span>฿</span>
              <span>{formatTHB(data?.total_amount || 0)}</span>
            </div>
          </div>

          <div className="mt-2">
            <div className="flex gap-2 items-center">
              <Truck size={16} /> <span>Shipment </span>
            </div>

            <div
              className="rounded-lg border p-3 flex flex-col gap-1"
              style={{
                borderColor: `${theme.accent}`,
              }}
            >
              <span>Tracking No : {data?.shipment.tracking_no || "-"}</span>
              <span>Carrier : {data?.shipment.carrier || "-"}</span>
            </div>
          </div>
        </div>

        <div className="col-span-12 md:col-span-6 flex flex-col">
          <div className="flex gap-2 items-center">
            <ShoppingCart size={16} /> <span>Purchased Items </span>
          </div>

          {data?.items && data.items.length > 0 ? (
            <div className="flex flex-col gap-2 mt-1">
              {data.items.map((item: any) => {
                const details = Array.isArray(item.details)
                  ? item.details
                  : [];

                const shouldShowDetails =
                  details.length > 0 &&
                  details.some(
                    (d: any) =>
                      Number(d.has_option) === 1 ||
                      Boolean(d.selected_option),
                  );

                return (
                  <div
                    key={item.reward_id}
                    className="border rounded-lg py-2 px-3"
                    style={{
                      borderColor: theme.accent,
                    }}
                  >
                    <div className="flex justify-between gap-3">
                      <span className="font-medium">{item.title}</span>
                      <span className="font-semibold whitespace-nowrap">
                        x {item.qty}
                      </span>
                    </div>

                    {shouldShowDetails && (
                      <div className="mt-1 flex flex-col gap-1">
                        {details
                          .filter(
                            (detail: any) =>
                              Number(detail.has_option) === 1 ||
                              Boolean(detail.selected_option),
                          )
                          .map((detail: any, index: number) => {
                            const optionName = String(
                              detail.option_name || "Option",
                            );

                            const selectedOption = String(
                              detail.selected_option || "-",
                            );

                            return (
                              <div
                                key={`${detail.reward_item_id}_${selectedOption}_${index}`}
                                className="flex justify-between gap-2 text-xs rounded-md px-2 py-1"
                                style={{
                                  backgroundColor: `${theme.accent}40`,
                                  color: theme.secondary,
                                }}
                              >
                                <span className="truncate">
                                  {detail.item_name}: {optionName}{" "}
                                  {selectedOption.toUpperCase()}
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
              })}
            </div>
          ) : (
            <div
              className="mt-1 h-[150px] md:h-auto md:flex-1 flex justify-center items-center border rounded-lg text-sm"
              style={{
                borderColor: `${theme.accent}`,
              }}
            >
              You haven't supported this project yet
            </div>
          )}
        </div>
      </div>
    </section>
  );
}