import { ProjectFormState } from "@/lib/admin-project/projectFormDefault";

type Props = {
  form: ProjectFormState;
  updateForm: <K extends keyof ProjectFormState>(
    key: K,
    value: ProjectFormState[K],
  ) => void;
};

export default function ProjectStatusSection({ form, updateForm }: Props) {
  return (
    <section className="bg-white rounded-xl shadow-sm border border-pinkAccent p-5">
      <h2 className="text-sm font-semibold text-textMain mb-3 flex items-center gap-2">
        <span className="w-1.5 h-4 bg-pinkSecondary rounded-full"></span>
        Status
      </h2>

      <select
        value={form.status}
        onChange={(e) => updateForm("status", e.target.value as any)}
        className="w-full rounded-lg border border-pinkAccent bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-pinkAccent"
      >
        <option value="draft">Draft</option>
        <option value="open">Open</option>
        <option value="paused">Paused</option>
        <option value="closed">Closed</option>
      </select>
    </section>
  );
}