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
            <div key={item.team} className="mb-6">
              <div className="flex gap-3">
                {/* Avatar */}
                <div className="shrink-0">
                  <Image
                    src={team?.image || "/icon/june_logo_circle.png"}
                    alt={item.team}
                    className="w-12 h-12 rounded-full object-cover"
                    width={48}
                    height={48}
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-sm font-medium truncate">
                      {team?.label || item.team}
                    </div>

                    <div
                      className="text-xs font-semibold shrink-0 ml-2"
                      style={{
                        color: theme.secondary,
                      }}
                    >
                      {item.percent}%
                    </div>
                  </div>

                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
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
            </div>
          );
        })}
      </div>
    </div>
  );
}
