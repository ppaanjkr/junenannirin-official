import { ProjectFormState } from "@/lib/admin-project/projectFormDefault";

type Props = {
  form: ProjectFormState;
  updateForm: <K extends keyof ProjectFormState>(
    key: K,
    value: ProjectFormState[K],
  ) => void;
};

export default function ProjectThemeSection({ form, updateForm }: Props) {
  function updateTheme(key: "secondary" | "accent", value: string) {
    updateForm("theme_color", {
      ...form.theme_color,
      [key]: value,
    });
  }

  return (
    <section className="bg-white rounded-xl shadow-sm border border-pinkAccent p-5">
      <h2 className="text-sm font-semibold text-textMain mb-3 flex items-center gap-2">
        <span className="w-1.5 h-4 bg-pinkSecondary rounded-full"></span>
        Theme Color
      </h2>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-textSub">Main Color</span>

          <input
            type="color"
            value={form.theme_color.secondary}
            onChange={(e) => updateTheme("secondary", e.target.value)}
            className="w-10 h-10 rounded cursor-pointer border border-pinkAccent"
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-textSub">Accent Color</span>

          <input
            type="color"
            value={form.theme_color.accent}
            onChange={(e) => updateTheme("accent", e.target.value)}
            className="w-10 h-10 rounded cursor-pointer border border-pinkAccent"
          />
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-pinkAccent/30 p-4 border border-pinkAccent">
        <p className="text-[10px] uppercase tracking-wide text-textSub mb-2">
          Preview
        </p>

        <h3
          className="text-base font-bold mb-2"
          style={{ color: form.theme_color.secondary }}
        >
          Preview Title
        </h3>

        <button
          type="button"
          className="w-full text-white text-xs font-medium py-2 rounded-lg"
          style={{ backgroundColor: form.theme_color.secondary }}
        >
          Preview Button
        </button>

        <div
          className="mt-3 h-2 rounded-full overflow-hidden"
          style={{ backgroundColor: form.theme_color.accent }}
        >
          <div
            className="h-full w-2/3 rounded-full"
            style={{ backgroundColor: form.theme_color.secondary }}
          />
        </div>
      </div>
    </section>
  );
}