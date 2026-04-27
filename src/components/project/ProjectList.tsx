import { driveThumb } from "@/lib/workUtils";
import type { Project } from "@/lib/api/types";
import { formatTHB } from "@/lib/formatTHB";
import { formatThaiDateWithTime } from "@/lib/formatThaiDate";
import { CalendarHeart } from "lucide-react";

export default function ProjectList({ projects }: { projects: Project[] }) {

  return (
    <div className="grid grid-cols-12 gap-4">
      {projects.map((p) => {
        const startStr = formatThaiDateWithTime(p.start_date);
        const endStr = formatThaiDateWithTime(p.end_date);

        return (
          <div
            key={p.id}
            className="col-span-12 bg-white rounded-md shadow-sm flex overflow-hidden h-[150px]"
          >
            {/* IMAGE */}
            <div className="w-[140px] h-full bg-pinkAccent flex-shrink-0">
              {p.image_url && (
                <img
                  src={driveThumb(p.image_url)}
                  alt={p.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            <div className="px-4 py-2 flex flex-col justify-between overflow-hidden">
              <div className="mt-1">
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-pinkSecondary bg-pinkSecondary/10 px-3 py-1 rounded-full">
                  {formatTHB(p.target_amount)}
                </span>
              </div>
              <span className="font-semibold text-pinkSecondary truncate text-lg">
                {p.name}
              </span>
              <p className="text-xs text-textSub line-clamp-2">
                {p.description}
              </p>
              <div className="text-sm text-textSub mt-1 flex items-center gap-1">
                <CalendarHeart size={14} /> {startStr} - {endStr}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
