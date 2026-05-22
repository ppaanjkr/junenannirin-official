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

export default function ProjectImageSection({ form, updateForm }: Props) {
  async function handleMoreFile(index: number, file?: File) {
    if (!file) return;

    const imageFile = await fileToBase64(file);
    const oldUrl = form.img_more[index] || "";

    const nextFiles = [...(form.img_more_files || [])];
    const nextPreview = [...(form.img_more || [])];
    const nextDeleteUrls = [...(form.img_more_delete_urls || [])];

    nextFiles[index] = imageFile;
    nextPreview[index] = URL.createObjectURL(file);

    const deleteUrl = markDeleteImageUrl(oldUrl);
    if (deleteUrl) nextDeleteUrls.push(deleteUrl);

    updateForm("img_more_files", nextFiles);
    updateForm("img_more", nextPreview);
    updateForm("img_more_delete_urls", nextDeleteUrls);
  }

  function addMoreImage() {
    if (form.img_more.length >= 2) return;

    updateForm("img_more", [...form.img_more, ""]);
    updateForm("img_more_files", [...(form.img_more_files || []), null]);
  }

  function removeMoreImage(index: number) {
    const oldUrl = form.img_more[index] || "";
    const deleteUrl = markDeleteImageUrl(oldUrl);

    if (deleteUrl) {
      updateForm("img_more_delete_urls", [
        ...(form.img_more_delete_urls || []),
        deleteUrl,
      ]);
    }

    updateForm(
      "img_more",
      form.img_more.filter((_, i) => i !== index),
    );

    updateForm(
      "img_more_files",
      (form.img_more_files || []).filter((_, i) => i !== index),
    );
  }

  return (
    <section className="bg-white rounded-xl shadow-sm border border-pinkAccent p-5">
      <h2 className="text-sm font-semibold text-textMain mb-4 flex items-center gap-2">
        <span className="w-1.5 h-4 bg-pinkSecondary rounded-full"></span>
        More Images
      </h2>

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
              {preview ? (
                <div className="relative w-full">
                  <ImagePreviewModal
                    src={preview}
                    alt={`more image ${index + 1}`}
                    className="w-full h-40 object-cover rounded-lg border border-pinkAccent"
                  />

                  <button
                    type="button"
                    onClick={() => removeMoreImage(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border border-pinkSecondary text-pinkSecondary flex items-center justify-center shadow"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleMoreFile(index, e.target.files?.[0])}
                  className="w-full rounded-lg border border-pinkAccent bg-white px-3 py-2 text-sm outline-none file:mr-3 file:rounded-md file:border-0 file:bg-pinkAccent file:px-3 file:py-1 file:text-pinkSecondary"
                />
              )}
            </div>
          );
        })}

        {form.img_more.length === 0 && (
          <p className="text-xs text-textSub">No more images</p>
        )}
      </div>
    </section>
  );
}