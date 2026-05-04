import { formatThaiDateWithTime } from "@/lib/formatThaiDate";
import type { ActiveProjectData } from "@/lib/api/types";
import { driveThumb } from "@/lib/workUtils";
import { formatTHB } from "@/lib/formatTHB";

type Theme = {
  secondary: string;
  accent: string;
};
export default function SectionReward({
  data,
  theme,
}: {
  data: ActiveProjectData;
  theme: Theme;
}) {
  const { rewards } = data;

  return (
    <section className="mt-4">
      <div className="flex justify-between items-center mt-6">
        <span className="text-xl font-semibold">Souvenirs for fans</span>
      </div>
      {rewards && rewards.length > 0 && (
        <div className="grid grid-cols-12 gap-2 mt-2">
          {rewards.map((reward, index) => {
            return (
              <div
                key={reward.id}
                className="col-span-6 lg:col-span-3 bg-white rounded-md shadow-sm "
              >
                <div className="">
                  <div
                    className="h-[150px] overflow-hidde border-none"
                    style={{
                      backgroundColor: `${theme.accent}`,
                    }}
                  >
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
                    <div
                      className="inline-block text-[11px] font-bold px-2 py-1 rounded-full mb-1.5"
                      style={{
                        backgroundColor: `${theme.accent}`,
                        color: `${theme.secondary}`,
                      }}
                    >
                      min {formatTHB(reward.min_amount)} THB
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">{reward.title}</span>
                      <span className="text-xs text-textSub">
                        {reward.description}
                      </span>
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
