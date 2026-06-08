import ImagePreviewModal from "@/components/ImagePreviewModal";
import { formatThaiDate } from "@/lib/formatThaiDate";
import { driveThumb } from "@/lib/workUtils";

type Props = { project: any };
export default function ProjectBasicDetail({ project }: Props) {
  return (
    <section>
      <div className="bg-white rounded-lg p-4 shadow-soft border border-pinkAccent">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-pinkSecondary rounded-full"></span>
            Information
          </h2>
          <span className="px-4 py-1 rounded-full bg-pinkAccent text-center text-pinkSecondary text-xs">
            {project.type}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-12 gap-2">
          {project.image_url && (
            <div className="col-span-12">
            <ImagePreviewModal
              src={driveThumb(project.image_url)}
              alt={project.name}
              className="w-full object-cover rounded-md border border-pinkAccent flex-shrink-0"
            />
          </div>
          )}
          
          <div className="col-span-12 flex flex-col">
            <span>Project Name</span>
            <input
              type="text"
              className="w-full px-4 py-2 border border-pinkAccent rounded-lg outline-none"
              value={project.name}
              disabled
            />
          </div>
          <div className="col-span-12 flex flex-col">
            <span>Description</span>
            <textarea
              className="w-full px-4 py-2 border border-pinkAccent rounded-lg outline-none resize-none"
              value={project.description}
              //   onChange={(e) =>
              //     setProject({
              //       ...project,
              //       name: e.target.value,
              //     })
              //   }
              rows={5}
              disabled
            />
          </div>
          <div className="col-span-12 grid grid-cols-12 gap-2">
            <div className="col-span-6">
              <span>Start Date</span>
              <input
                type="text"
                className="w-full px-4 py-2 border border-pinkAccent rounded-lg outline-none"
                value={
                  project.start_date ? formatThaiDate(project.start_date) : ""
                }
                disabled
              />
            </div>
            <div className="col-span-6">
              <span>End Date</span>
              <input
                type="text"
                className="w-full px-4 py-2 border border-pinkAccent rounded-lg outline-none"
                value={project.end_date ? formatThaiDate(project.end_date) : ""}
                disabled
              />
            </div>
          </div>
          {project.type === "donation" && (
            <div className="col-span-12 flex flex-col">
              <span>Taget Amount</span>
              <input
                type="text"
                className="w-full px-4 py-2 border border-pinkAccent rounded-lg outline-none resize-none"
                value={project.target_amount}
                disabled
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
