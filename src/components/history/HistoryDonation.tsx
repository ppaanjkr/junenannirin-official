import { HistoryDonation } from "@/lib/api/types";
import ImagePreviewModal from "../ImagePreviewModal";
import { driveThumb } from "@/lib/workUtils";
import { formatTHB } from "@/lib/formatTHB";
import { formatThaiDateWithTime } from "@/lib/formatThaiDate";

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
      <h2 className="text-sm text-textsub mb-2 font-semibold">Last Donate</h2>
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart-icon lucide-heart"><path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/></svg>
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
