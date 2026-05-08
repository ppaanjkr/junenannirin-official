import { formatTHB } from "@/lib/formatTHB";
import { CircleDollarSign, ShoppingCart, UserRound } from "lucide-react";

type Props = {
  summary?: {
    totalRevenue?: number;
    totalOrders?: number;
    totalUsers?: number;
  };
};

export default function SummaryDetail({
  summary,
}: Props) {

  if (!summary) return null;

  return (
    <div className="grid grid-cols-12 gap-1">

      <div className="col-span-12 md:col-span-4 bg-white rounded-lg p-4 shadow-soft border border-pinkAccent">
        <div className="flex gap-2 items-center">
          <span className="w-8 h-8 rounded-full bg-pinkAccent/60 flex justify-center items-center">
            <CircleDollarSign className="w-5 h-5 text-pinkSecondary" />
          </span>

          <span className="md:text-lg">
            Total Revenue
          </span>
        </div>

        <div className="font-semibold text-pinkSecondary text-xl md:text-2xl mt-1 text-end">
          ฿ {formatTHB(summary.totalRevenue || 0)}
        </div>
      </div>

      <div className="col-span-12 md:col-span-4 bg-white rounded-lg p-4 shadow-soft border border-pinkAccent">
        <div className="flex gap-2 items-center">
          <span className="w-8 h-8 rounded-full bg-pinkAccent/60 flex justify-center items-center">
            <ShoppingCart className="w-4 h-4 text-pinkSecondary" />
          </span>

          <span className="md:text-lg">
            Total Order
          </span>
        </div>

        <div className="font-semibold text-pinkSecondary text-xl md:text-2xl mt-1 text-end">
          {summary.totalOrders || 0}
        </div>
      </div>

      <div className="col-span-12 md:col-span-4 bg-white rounded-lg p-4 shadow-soft border border-pinkAccent">
        <div className="flex gap-2 items-center">
          <span className="w-8 h-8 rounded-full bg-pinkAccent/60 flex justify-center items-center">
            <UserRound className="w-4 h-4 text-pinkSecondary" />
          </span>

          <span className="md:text-lg">
            Users
          </span>
        </div>

        <div className="font-semibold text-pinkSecondary text-xl md:text-2xl mt-1 text-end">
          {summary.totalUsers || 0}
        </div>
      </div>

    </div>
  );
}