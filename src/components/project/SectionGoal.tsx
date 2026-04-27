import { formatThaiDateWithTime } from "@/lib/formatThaiDate";
import type { ActiveProjectData } from "@/lib/api/types";
import { driveThumb } from "@/lib/workUtils";
import { formatTHB } from "@/lib/formatTHB";

interface Props {
  project: ActiveProjectData;
}
export default function SectionGoal({ data }: { data: ActiveProjectData }) {
  const { project, targets } = data;

  return (
    <section className="mt-4">
      <span className="text-lg">Donate Goal</span>
      {targets && targets.length > 0 && (
        <div className="grid grid-cols-12 gap-2 mt-2">
          {targets.map((target, index) => {
            const amount = Number(target.amout || 0);
            const isDone = project.current_amount >= amount;

            return (
              <div
                key={target.step}
                className="col-span-12 md:col-span-6 lg:col-span-3 bg-white rounded-md p-5 shadow-sm border border-gray-100"
              >
                <div className="flex items-start gap-3">
                  {isDone ? (
                    <div className="w-10 h-10 rounded-full bg-pinkSecondary flex items-center justify-center shadow-sm">
                      <img src="/project/check.png" className="w-5" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-pinkAccent text-gray-700 font-semibold flex items-center justify-center">
                      {index + 1}
                    </div>
                  )}

                  <div className="flex-1">
                    <div className="text-pinkSecondary font-semibold text-[16px]">
                      ฿ {formatTHB(amount)}
                    </div>
                    <div className="font-semibold text-[16px] text-gray-800">
                      {target.title}
                    </div>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-3">
                      {target.description}
                    </p>
                    {target.image_url && (
                      <div className="mt-3 rounded-md overflow-hidden">
                        <img
                          src={driveThumb(target.image_url)}
                          className="w-full h-[140px] object-cover"
                        />
                      </div>
                    )}
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
