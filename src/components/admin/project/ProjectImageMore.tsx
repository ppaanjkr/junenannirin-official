import ImagePreviewModal from "@/components/ImagePreviewModal";
import { driveThumb } from "@/lib/workUtils";

type Props = { project: any };

export default function ProjectImageMore({ project }: Props) {
  return (
    <section className="mt-4">
      <div className="bg-white rounded-lg p-4 shadow-soft border border-pinkAccent">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-pinkSecondary rounded-full"></span>
            Posters
          </h2>
        </div>

        <div className="mt-4 grid grid-cols-12 gap-2">
          <div className="col-span-12">
            <ImagePreviewModal
              src={driveThumb(project.img_more)}
              alt={project.name}
              className="w-full object-cover rounded-md border border-pinkAccent flex-shrink-0"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
