import { ActiveProjectData } from "@/lib/api/types";

type Theme = {
  secondary: string;
  accent: string;
};
export default function SectionLocation({
  data,
  theme,
}: {
  data: ActiveProjectData;
  theme: Theme;
}) {
  return (
    <section className="mt-4">
      <div
        className="rounded-lg overflow-hidden shadow-sm border"
        style={{
          backgroundColor: `${theme.accent}30`,
          borderColor: `${theme.secondary}33`,
        }}
      >
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-12 flex flex-col">
            <iframe
              src={`https://www.google.com/maps?q=${encodeURIComponent(
                data?.project?.event_location_name ?? "",
              )}&output=embed`}
              width="100%"
              height="300"
              style={{ border: 0 }}
            />
            {/* <a
              href={project.event_location_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              เปิดใน Google Maps
            </a> */}
          </div>
        </div>
      </div>
    </section>
  );
}
