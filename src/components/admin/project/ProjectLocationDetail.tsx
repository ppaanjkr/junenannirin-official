type Props = { project: any };
export default function ProjectLocationDetail({ project }: Props) {
  return (
    <section>
      <div className="mt-4 bg-white rounded-lg p-4 shadow-soft border border-pinkAccent">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-pinkSecondary rounded-full"></span>
            Event Location
          </h2>
        </div>

        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-12 flex flex-col">
            <span>Location Name</span>
            <input
              type="text"
              className="w-full px-4 py-2 border border-pinkAccent rounded-lg outline-none"
              value={project.event_location_name}
              disabled
            />
          </div>
          <div className="col-span-12 flex flex-col">
            <iframe
              src={`https://www.google.com/maps?q=${encodeURIComponent(
                project.event_location_name,
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
