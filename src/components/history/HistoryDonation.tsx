import { HistoryDonation } from "@/lib/api/types";
import ImagePreviewModal from "../ImagePreviewModal";
import { driveThumb } from "@/lib/workUtils";
import { formatTHB } from "@/lib/formatTHB";
import { formatThaiDateWithTime } from "@/lib/formatThaiDate";
import { Heart } from "lucide-react";

type Props = {
  className?: string;
  data: HistoryDonation[] | null;
};

export default function SectionHistoryDonation({
  className = "",
  data,
}: Props) {

  return (
    <section>
      {/* <h2 className="text-sm text-textsub mb-2 font-semibold">Last Donate</h2> */} 
      <div className="grid grid-cols-12 gap-2">
        {data &&
          data.length > 0 ?
          data.map((item) => (
            <div
              key={item.donation_id}
              className="col-span-12 md:col-span-6 bg-white border border-pinkAccent rounded-xl shadow-sm p-3 flex items-center gap-3"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg bg-pinkAccent flex items-center justify-center overflow-hidden">
                {item.project?.image_url && (
                  <ImagePreviewModal src={driveThumb(item.project?.image_url)} alt={item.project?.name} className="w-full h-full object-cover"/>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-md truncate">
                  {item.project?.name}
                </p>
                  <div className="flex gap-1 text-sm text-textSub">
                    <Heart className="w-4 h-4" />
                    <span>{formatTHB(item.amount || 0)} THB</span> • <span>{formatThaiDateWithTime(item.created_at)}</span>
                  </div>
              </div>
            </div>
          )) : (
            <div className="col-span-12 bg-white border border-pinkAccent rounded-xl shadow-sm p-3 flex justify-center items-center h-[200px] text-sm">No Data</div>
          )}
      </div>
    </section>
  );
}
