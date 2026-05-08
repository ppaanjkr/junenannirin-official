import { formatThaiDateWithTime } from "@/lib/formatThaiDate";
import type { ActiveProjectData } from "@/lib/api/types";
import { driveThumb } from "@/lib/workUtils";
import { formatTHB } from "@/lib/formatTHB";
import ImagePreviewModal from "@/components/ImagePreviewModal";

type Theme = {
  secondary: string;
  accent: string;
};
interface Props {
  project: ActiveProjectData;
  theme: Theme;
}
export default function SectionProject({
  data,
  theme,
}: {
  data: ActiveProjectData;
  theme: Theme;
}) {
  const { project, totalDonors } = data;

  // money
  const current = Number(project.current_amount || 0);
  const target = Number(project.target_amount || 0);
  const percent = target > 0 ? Math.min((current / target) * 100, 100) : 0;

  // date
  const startStr = formatThaiDateWithTime(project.start_date);
  const endStr = formatThaiDateWithTime(project.end_date);

  // days left
  const end = new Date(project.end_date);
  const today = new Date();
  const daysLeft = Math.max(
    Math.ceil((Number(end) - Number(today)) / (1000 * 60 * 60 * 24)),
    0,
  );

  // image
  let imageUrl = project.image_url || "";
  // if (imageUrl) imageUrl = driveThumb(imageUrl);

  // desc
  const desc = (project.description || "")
    .replace(/\n/g, "<br>")
    .replace(/\r/g, "");

  return (
    <section className="mt-4">
      <div
        className="rounded-lg overflow-hidden shadow-sm border"
        style={{
          backgroundColor: `${theme.accent}30`,
          borderColor: `${theme.secondary}33`,
        }}
      >
        {/* IMAGE */}
        <div className="relative">
          <ImagePreviewModal src={driveThumb(imageUrl)} alt={project.name} className="w-full min-h-24 max-h-56 md:max-h-80 object-center"/>

          {/* days left */}
          <span
            className="absolute top-1 left-1 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold shadow flex items-center gap-1"
            style={{ color: theme.secondary }}
          >
            <span className="relative flex w-2 h-2">
              <span
                className="absolute inline-flex h-full w-full rounded-full animate-ping"
                style={{ backgroundColor: theme.secondary, opacity: 0.6 }}
              ></span>
              <span
                className="relative inline-flex rounded-full w-2 h-2"
                style={{ backgroundColor: theme.secondary }}
              ></span>
            </span>
            {daysLeft <= 0 ? "Expired" : `${daysLeft} day left`}
          </span>
        </div>

        {/* CONTENT */}
        <div className="p-4 md:p-6 space-y-3">
          {project.type === "shop" && (
            <span
              className="inline-bloc text-xs font-semibold px-3 py-1 rounded-full mb-2"
              style={{
                color: theme.accent,
                backgroundColor: theme.secondary,
              }}
            >
              Pre-Order
            </span>
          )}

          {/* title */}
          <h2
            className="text-lg md:text-2xl font-semibold"
            style={{ color: theme.secondary }}
          >
            {project.name}
          </h2>

          {/* desc */}
          <p
            className="text-sm text-textSub leading-relaxed"
            dangerouslySetInnerHTML={{ __html: desc }}
          />

          {/* date */}
          <div className="flex items-center gap-2 text-sm text-textSub">
            <span>📅</span>
            <span>
              {startStr} - {endStr}
            </span>
          </div>

          {/* more img */}
          <div>
            <ImagePreviewModal src={driveThumb(project.img_more)} alt={project.name} className="w-full object-center"/>
            {/* <ImagePreviewModal src={`test.jpg`} alt={project.name} className="w-full object-center"/> */}
          </div>

          {/* progress */}
          {project.type === "donation" && (
            <div className="pt-2">
              {/* meta */}
              <div className="flex justify-between text-sm mb-1">
                <span
                  className="text-lg font-semibold"
                  style={{ color: theme.secondary }}
                >
                  ฿ {formatTHB(current)}
                </span>
                <span>฿ {formatTHB(target)}</span>
              </div>

              {/* bar */}
              <div
                className="h-3 rounded-full overflow-hidden"
                style={{ backgroundColor: theme.accent }}
              >
                <div
                  className="h-full transition-all duration-700"
                  style={{
                    width: `${percent}%`,
                    backgroundColor: theme.secondary,
                  }}
                />
              </div>

              {/* footer */}
              <div className="flex justify-between text-xs mt-1 text-textSub">
                <span>{percent.toFixed(0)}%</span>
                <span>{totalDonors || 0} loves</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
