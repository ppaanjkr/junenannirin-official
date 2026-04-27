import { formatThaiDateWithTime } from "@/lib/formatThaiDate";
import type { ActiveProjectData } from "../api/types";
import { driveThumb } from "@/lib/workUtils";
import { formatTHB } from "@/lib/formatTHB";

interface Props {
  project: ActiveProjectData;
}
export default function SectionReward({ data }: { data: ActiveProjectData }) {
  const { rewards } = data;

  return (
    <section className="mt-4">
      <span className="text-lg">Souvenirs for fans</span>
      {rewards && rewards.length > 0 && (
        <div className="grid grid-cols-12 gap-2 mt-2">
          {rewards.map((reward, index) => {
            return (
              <div
                key={reward.id}
                className="col-span-6 lg:col-span-3 bg-white rounded-md shadow-sm "
              >
                <div className="">
                  <div className="h-[150px] overflow-hidden bg-pinkAccent border-none">
                    {reward.image_url && reward.image_url != "" && (
                        <img
                            src={driveThumb(reward.image_url)}
                            alt=""
                            className="w-full h-full object-cover object-center block"
                        />
                    )}
                    
                  </div>
                  <div className="p-3">
                    {/* price */}
                    <div className="inline-block text-[11px] font-bold text-pinkSecondary bg-pinkAccent px-2 py-[3px] rounded-full mb-1.5">
                      min ฿ {formatTHB(reward.min_amount)}
                    </div>
                    <div className="text-sm font-medium text-gray-800">
                      {reward.title}
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
