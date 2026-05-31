"use client";

import Image from "next/image";
import { useTeamPoll } from "@/hooks/useProfile";
import { teamOptions } from "@/data/teams";
import ImagePreviewModal from "../ImagePreviewModal";

export default function SectionUserSummary({
  theme,
}: {
  theme: {
    secondary: string;
    accent: string;
  };
}) {
  const { teams, total, isLoading } = useTeamPoll();
  console.log(teams);

  function getTeamInfo(teamName: string) {
    return teamOptions.find(
      (t) => t.value === teamName || t.label === teamName,
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-4 shadow-sm mt-4">Loading...</div>
    );
  }

  if (!teams.length) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm mt-4">
      <div className="mb-5">
        <div className="font-bold text-lg">Team</div>

        {/* <div className="text-sm text-gray-500">สมาชิกทั้งหมด {total} คน</div> */}
      </div>

      <div className="space-y-6">
        {teams.map((item) => {
          const team = getTeamInfo(item.team);

          return (
            <div key={item.team} className="flex items-center gap-5">
              {/* Team */}
              <div className="w-16 shrink-0 flex flex-col items-center">
                <div className="w-14">
                  <ImagePreviewModal
                    src={team?.image || "/icon/june_logo_circle.png"}
                    alt={item.team}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                </div>

                <div className="text-[11px] mt-2 text-center leading-tight">
                  {team?.label || item.team}
                </div>
              </div>

              {/* Progress */}
              <div className="flex-1">
                <div className="flex justify-end mb-1">
                  <span
                    className="text-xs font-semibold"
                    style={{
                      color: theme.secondary,
                    }}
                  >
                    {item.percent}%
                  </span>
                </div>

                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${item.percent}%`,
                      background: theme.secondary,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
