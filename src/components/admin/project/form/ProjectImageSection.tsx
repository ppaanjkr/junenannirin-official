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

export default function ProjectImageSection({ form, updateForm }: Props) {
  async function handleCoverFile(file?: File) {
    if (!file) return;

    const imageFile = await fileToBase64(file);

    updateForm("image_file", imageFile);
    updateForm("image_url", URL.createObjectURL(file));
  }

  async function handleMoreFile(index: number, file?: File) {
    if (!file) return;

    const imageFile = await fileToBase64(file);

    const nextFiles = [...(form.img_more_files || [])];
    const nextPreview = [...(form.img_more || [])];

    nextFiles[index] = imageFile;
    nextPreview[index] = URL.createObjectURL(file);

    updateForm("img_more_files", nextFiles);
    updateForm("img_more", nextPreview);
  }

  function addMoreImage() {
    if (form.img_more.length >= 2) return;

    updateForm("img_more", [...form.img_more, ""]);
    updateForm("img_more_files", [...(form.img_more_files || []), null as any]);
  }

  function removeMoreImage(index: number) {
    updateForm(
      "img_more",
      form.img_more.filter((_, i) => i !== index),
    );

    updateForm(
      "img_more_files",
      (form.img_more_files || []).filter((_, i) => i !== index),
    );
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
        Images
      </h2>

      <div>
        <label className="block text-xs font-medium text-textSub mb-1.5">
          Cover Image
        </label>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleCoverFile(e.target.files?.[0])}
          className="w-full rounded-lg border border-pinkAccent bg-white px-4 py-2.5 text-sm outline-none file:mr-3 file:rounded-md file:border-0 file:bg-pinkAccent file:px-3 file:py-1.5 file:text-pinkSecondary"
        />

        {coverPreview && (
          <div className="mt-3 rounded-xl overflow-hidden border border-pinkAccent">
            <ImagePreviewModal
              src={coverPreview}
              alt={form.name || "cover"}
              className="w-full h-56 object-cover"
            />
          </div>
        )}
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-xs font-medium text-textSub">
            More Images
          </label>

          <button
            type="button"
            onClick={addMoreImage}
            disabled={form.img_more.length >= 2}
            className="text-xs px-3 py-1 rounded-full bg-pinkAccent text-pinkSecondary disabled:opacity-40"
          >
            Add
          </button>
        </div>

        <div className="space-y-3">
          {form.img_more.map((url, index) => {
            const preview =
              form.img_more_files?.[index] && url ? url : url ? driveThumb(url) : "";

            return (
              <div
                key={`more_image_${index}`}
                className="rounded-lg border border-pinkAccent p-3"
              >
                <div className="flex gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleMoreFile(index, e.target.files?.[0])}
                    className="flex-1 rounded-lg border border-pinkAccent bg-white px-3 py-2 text-sm outline-none file:mr-3 file:rounded-md file:border-0 file:bg-pinkAccent file:px-3 file:py-1 file:text-pinkSecondary"
                  />

                  <button
                    type="button"
                    onClick={() => removeMoreImage(index)}
                    className="w-10 rounded-lg bg-red-50 text-red-400 flex items-center justify-center"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {preview && (
                  <ImagePreviewModal
                    src={preview}
                    alt={`more image ${index + 1}`}
                    className="mt-3 w-full h-40 object-cover rounded-lg border border-pinkAccent"
                  />
                )}
              </div>
            );
          })}

          {form.img_more.length === 0 && (
            <p className="text-xs text-textSub">No more images</p>
          )}
        </div>
      </div>
    </section>
  );
}