import ImagePreviewModal from "@/components/ImagePreviewModal";
import { driveThumb } from "@/lib/workUtils";

type Props = { project: any };
export default function ProjectBasicDetail({ project }: Props) {
  console.log(project);
  return (
    <section>
      <div className="bg-white rounded-lg p-4 shadow-soft border border-pinkAccent">
        <div className="flex justify-between items-center">
          <span className="border-l-4 border-pinkSecondary w-full pl-4 font-semibold">
            Project Information
          </span>
          <span className="px-4 py-1 rounded-full bg-pinkAccent text-center text-pinkSecondary text-xs">
            {project.type}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-12 gap-2">
          <div className="col-span-12">
            <ImagePreviewModal
              src={driveThumb(project.image_url)}
              alt={project.name}
              className="w-full object-cover rounded-md border border-pinkAccent flex-shrink-0"
            />
            {/* upload file when edit mode */}
          </div>
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
                type="date"
                className="w-full px-4 py-2 border border-pinkAccent rounded-lg outline-none"
                value={
                  project.start_date ? project.start_date.split("T")[0] : ""
                }
                disabled
              />
            </div>
            <div className="col-span-6">
              <span>End Date</span>
              <input
                type="date"
                className="w-full px-4 py-2 border border-pinkAccent rounded-lg outline-none"
                value={project.end_date ? project.end_date.split("T")[0] : ""}
                disabled
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
