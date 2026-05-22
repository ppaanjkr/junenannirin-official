import ImagePreviewModal from "@/components/ImagePreviewModal";
import { fileToBase64 } from "@/lib/admin-project/fileToBase64";
import { ProjectFormState } from "@/lib/admin-project/projectFormDefault";
import { driveThumb } from "@/lib/workUtils";
import { X } from "lucide-react";

type Props = {
  form: ProjectFormState;
  updateForm: <K extends keyof ProjectFormState>(
    key: K,
    value: ProjectFormState[K],
  ) => void;
};

function markDeleteImageUrl(currentUrl?: string) {
  if (!currentUrl || currentUrl.startsWith("blob:")) return "";
  return currentUrl;
}

export default function ProjectBasicSection({ form, updateForm }: Props) {
  async function updateCoverImage(file?: File) {
    if (!file) return;

    const imageFile = await fileToBase64(file);
    const previewUrl = URL.createObjectURL(file);

    updateForm("image_delete_url", markDeleteImageUrl(form.image_url));
    updateForm("image_file", imageFile);
    updateForm("image_url", previewUrl);
  }

  function removeCoverImage() {
    updateForm("image_delete_url", markDeleteImageUrl(form.image_url));
    updateForm("image_file", null);
    updateForm("image_url", "");
  }

  const coverPreview =
    form.image_file && form.image_url
      ? form.image_url
      : form.image_url
        ? driveThumb(form.image_url)
        : "";

  return (
    <section className="bg-white rounded-xl shadow-sm border border-pinkAccent p-5">
      <h2 className="text-sm font-semibold text-textMain mb-4 flex items-center gap-2">
        <span className="w-1.5 h-4 bg-pinkSecondary rounded-full"></span>
        Basic Info
      </h2>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <label className="block text-xs font-medium text-textSub mb-1.5">
            Project Name <span className="text-pinkSecondary">*</span>
          </label>

          <input
            type="text"
            value={form.name}
            onChange={(e) => updateForm("name", e.target.value)}
            placeholder="Project name"
            className="w-full rounded-lg border border-pinkAccent bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-pinkAccent"
          />
        </div>

        <div className="col-span-12">
          <label className="block text-xs font-medium text-textSub mb-1.5">
            Description
          </label>

          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => updateForm("description", e.target.value)}
            placeholder="Project description"
            className="w-full rounded-lg border border-pinkAccent bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-pinkAccent resize-none"
          />
        </div>

        <div className="col-span-6">
          <label className="block text-xs font-medium text-textSub mb-1.5">
            Start Date (MM/DD/YYYY)
          </label>

          <input
            type="date"
            value={form.start_date}
            onChange={(e) => updateForm("start_date", e.target.value)}
            className="w-full rounded-lg border border-pinkAccent bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-pinkAccent"
          />
        </div>

        <div className="col-span-6">
          <label className="block text-xs font-medium text-textSub mb-1.5">
            End Date (MM/DD/YYYY)
          </label>

          <input
            type="date"
            value={form.end_date}
            onChange={(e) => updateForm("end_date", e.target.value)}
            className="w-full rounded-lg border border-pinkAccent bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-pinkAccent"
          />
        </div>

        <div className="col-span-12">
          <label className="block text-xs font-medium text-textSub mb-1.5">
            Cover Image
          </label>

          {coverPreview ? (
            <div className="mt-2 relative w-full">
              <ImagePreviewModal
                src={coverPreview}
                alt={`cover`}
                className="w-full h-40 object-cover rounded-lg border border-pinkAccent"
              />

              <button
                type="button"
                onClick={removeCoverImage}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border border-pinkSecondary text-pinkSecondary flex items-center justify-center shadow"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <input
              type="file"
              accept="image/*"
              onChange={(e) => updateCoverImage(e.target.files?.[0])}
              className="w-full rounded-lg border border-pinkAccent bg-white px-3 py-2 text-sm outline-none file:mr-3 file:rounded-md file:border-0 file:bg-pinkAccent file:px-3 file:py-1 file:text-pinkSecondary"
            />
          )}
        </div>
      </div>
    </section>
  );
}
