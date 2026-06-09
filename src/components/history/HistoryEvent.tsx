import { HistoryEvent } from "@/lib/api/types";
import ImagePreviewModal from "../ImagePreviewModal";
import { driveThumb, formatFirestoreTimestamp } from "@/lib/workUtils";
import { Heart } from "lucide-react";

type Props = {
  className?: string;
  data: HistoryEvent[] | null;
};

export default function SectionHistoryEvent({
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
              key={item.event_id}
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
                  <div className="flex gap-1 text-pinkSecondary items-center font-semibold">
                    <Heart className="w-4 h-4" />
                    {item.queue}
                  </div>
                  <p className="text-xs text-textSub">{formatFirestoreTimestamp(item.checked_in_at)}</p>
              </div>
            </div>
          )) : (
            <div className="col-span-12 bg-white border border-pinkAccent rounded-xl shadow-sm p-3 flex justify-center items-center h-[200px] text-sm">No Data</div>
          )}
      </div>
    </section>
  );
}
