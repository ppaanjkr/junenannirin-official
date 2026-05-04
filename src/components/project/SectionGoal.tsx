import { formatThaiDateWithTime } from "@/lib/formatThaiDate";
import type { ActiveProjectData } from "@/lib/api/types";
import { driveThumb } from "@/lib/workUtils";
import { formatTHB } from "@/lib/formatTHB";
import { Check } from "lucide-react";

type Theme = {
  secondary: string;
  accent: string;
};
export default function SectionGoal({
  data,
  theme,
}: {
  data: ActiveProjectData;
  theme: Theme;
}) {
  const { project, targets } = data;

  return (
    <section className="mt-4">
      <div className="flex justify-between items-center mt-6">
        <span className="text-xl font-semibold">Donate Goal</span>
      </div>
      {targets && targets.length > 0 && (
        <div className="grid grid-cols-12 gap-2 mt-2">
          {targets.map((target, index) => {
            const amount = Number(target.amout || 0);
            const isDone = project.current_amount >= amount;

            return (
              <div
                key={target.step}
                className="col-span-12 md:col-span-6 bg-white rounded-md p-5 shadow-sm border"
                style={{
                  borderColor: `${theme.accent}`,
                }}
              >
                <div className="flex items-start gap-3">
                  {isDone ? (
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm"
                      style={{
                        backgroundColor: `${theme.secondary}`,
                      }}
                    >
                      <Check
                        className="w-6 h-6 stroke-12"
                        style={{
                          color: `${theme.accent}`,
                        }}
                      />
                    </div>
                  ) : (
                    <div
                      className="w-10 h-10 rounded-xl text-textSub font-semibold flex items-center justify-center"
                      style={{
                        backgroundColor: `${theme.accent}`,
                      }}
                    >
                      {index + 1}
                    </div>
                  )}

                  <div className="flex-1">
                    <div
                      className="font-semibold text-xl"
                      style={{
                        color: `${theme.secondary}`,
                      }}
                    >
                      {formatTHB(amount)} THB
                    </div>
                    <div className="font-semibold">
                      {target.title}
                    </div>
                    <p className="text-sm text-textSub mt-1 line-clamp-3">
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
