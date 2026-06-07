"use client";

import ImagePreviewModal from "@/components/ImagePreviewModal";
import { fileToBase64 } from "@/lib/admin-project/fileToBase64";
import { driveThumb } from "@/lib/workUtils";
import { TeamFormState } from "@/types/team";
import { X } from "lucide-react";

type Props = {
  open: boolean;
  mode: "create" | "edit";
  form: TeamFormState;
  setForm: React.Dispatch<React.SetStateAction<TeamFormState>>;
  onClose: () => void;
  onSave: () => void;
  loading?: boolean;
};

export default function TeamFormModal({
  open,
  mode,
  form,
  setForm,
  onClose,
  onSave,
  loading = false,
}: Props) {
  if (!open) return null;

  async function handleImage(file: File) {
    const base64 = await fileToBase64(file);

    const previewUrl = URL.createObjectURL(file);

    setForm((prev) => ({
      ...prev,
      image_file: base64,
      image_url: previewUrl,
    }));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-pinkAccent">
          <h2 className="font-semibold text-lg">
            {mode === "create" ? "Create Team" : "Edit Team"}
          </h2>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2">
              Team Name *
            </label>

            <input
              value={form.label}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  label: e.target.value,
                }))
              }
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          <div>
            {/* <label className="block text-sm font-medium mb-2">
              Value
            </label> */}

            <input
              value={form.value}
              disabled
              className="w-full border rounded-xl px-4 py-3 bg-gray-100 hidden"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">Team Image</label>

            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-pinkAccent bg-gray-50">
                  {form.image_url ? (
                    <ImagePreviewModal
                      src={driveThumb(form.image_url)}
                      alt="team"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                      No Image
                    </div>
                  )}
                </div>

                {form.image_url && (
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        image_delete_url: prev.image_url,
                        image_url: "",
                        image_file: null,
                      }))
                    }
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border border-pinkSecondary text-pinkSecondary flex items-center justify-center shadow"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];

                  if (!file) return;

                  await handleImage(file);
                }}
                className="w-full rounded-lg border border-pinkAccent bg-white px-3 py-2 text-sm outline-none file:mr-3 file:rounded-md file:border-0 file:bg-pinkAccent file:px-3 file:py-1 file:text-pinkSecondary"
              />
            </div>
          </div>

          <div className="flex items-center justify-between border rounded-xl p-4">
            <div>
              <p className="font-medium">Show in Register</p>

              <p className="text-xs text-gray-500">
                Users can select this team during registration
              </p>
            </div>

            <input
              type="checkbox"
              checked={form.show_in_register}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  show_in_register: e.target.checked,
                }))
              }
              className="w-5 h-5"
            />
          </div>

          <div className="flex items-center justify-between border rounded-xl p-4">
            <div>
              <p className="font-medium">Active</p>
            </div>

            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  active: e.target.checked,
                }))
              }
              className="w-5 h-5"
            />
          </div>
        </div>

        <div className="border-t px-6 py-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl border"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={onSave}
            className="px-5 py-2 rounded-xl bg-pinkSecondary text-white disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
