import ImagePreviewModal from "@/components/ImagePreviewModal";
import { fileToBase64 } from "@/lib/admin-project/fileToBase64";
import { ProjectFormState } from "@/lib/admin-project/projectFormDefault";
import { driveThumb } from "@/lib/workUtils";
import { Plus, X } from "lucide-react";

type Props = {
  form: ProjectFormState;
  updateForm: <K extends keyof ProjectFormState>(
    key: K,
    value: ProjectFormState[K],
  ) => void;
};

export default function ProjectTargetSection({ form, updateForm }: Props) {
  function addTarget() {
    updateForm("targets", [
      ...form.targets,
      {
        step: form.targets.length + 1,
        amount: 0,
        title: "",
        description: "",
        image_url: "",
        image_file: null,
      },
    ]);
  }

  function updateTarget(index: number, key: string, value: any) {
    const next = [...form.targets];

    next[index] = {
      ...next[index],
      [key]: value,
    };

    updateForm("targets", next);
  }

  async function updateTargetImage(index: number, file?: File) {
    if (!file) return;

    const imageFile = await fileToBase64(file);
    const previewUrl = URL.createObjectURL(file);

    const next = [...form.targets];

    next[index] = {
      ...next[index],
      image_file: imageFile,
      image_url: previewUrl,
    };

    updateForm("targets", next);
  }

  function removeTarget(index: number) {
    updateForm(
      "targets",
      form.targets
        .filter((_, i) => i !== index)
        .map((item, i) => ({
          ...item,
          step: i + 1,
        })),
    );
  }

  return (
    <section className="bg-white rounded-xl shadow-sm border border-pinkAccent p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-textMain flex items-center gap-2">
          <span className="w-1.5 h-4 bg-pinkSecondary rounded-full"></span>
          Milestones
        </h2>

        <button
          type="button"
          onClick={addTarget}
          className="text-xs px-3 py-1.5 rounded-full bg-pinkAccent text-pinkSecondary font-medium flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          Add
        </button>
      </div>

      <div className="space-y-3">
        {form.targets.map((target, index) => {
          const preview =
            target.image_file && target.image_url
              ? target.image_url
              : target.image_url
                ? driveThumb(target.image_url)
                : "";

          return (
            <div
              key={`target_${index}`}
              className="rounded-xl border border-pinkAccent bg-pinkAccent/20 p-3"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-pinkSecondary">
                  Step {index + 1}
                </span>

                <button
                  type="button"
                  onClick={() => removeTarget(index)}
                  className="w-7 h-7 rounded-full bg-white text-red-400 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-12 gap-2">
                <input
                  type="text"
                  value={target.title}
                  onChange={(e) => updateTarget(index, "title", e.target.value)}
                  placeholder="Title"
                  className="col-span-12 rounded-lg border border-pinkAccent bg-white px-3 py-2 text-sm outline-none"
                />

                <input
                  type="number"
                  value={target.amount || ""}
                  onChange={(e) =>
                    updateTarget(index, "amount", Number(e.target.value || 0))
                  }
                  placeholder="Amount"
                  className="col-span-12 md:col-span-6 rounded-lg border border-pinkAccent bg-white px-3 py-2 text-sm outline-none"
                />

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    updateTargetImage(index, e.target.files?.[0])
                  }
                  className="col-span-12 md:col-span-6 rounded-lg border border-pinkAccent bg-white px-3 py-2 text-sm outline-none file:mr-3 file:rounded-md file:border-0 file:bg-pinkAccent file:px-3 file:py-1 file:text-pinkSecondary"
                />

                {preview && (
                  <div className="col-span-12">
                    <ImagePreviewModal
                      src={preview}
                      alt={target.title || `target ${index + 1}`}
                      className="w-full h-40 object-cover rounded-lg border border-pinkAccent"
                    />
                  </div>
                )}

                <textarea
                  value={target.description}
                  onChange={(e) =>
                    updateTarget(index, "description", e.target.value)
                  }
                  placeholder="Description"
                  rows={2}
                  className="col-span-12 rounded-lg border border-pinkAccent bg-white px-3 py-2 text-sm outline-none resize-none"
                />
              </div>
            </div>
          );
        })}

        {form.targets.length === 0 && (
          <p className="text-xs text-textSub text-center py-4">
            No milestones
          </p>
        )}
      </div>
    </section>
  );
}