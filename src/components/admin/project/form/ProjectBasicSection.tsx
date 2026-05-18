import { ProjectFormState } from "@/lib/admin-project/projectFormDefault";

type Props = {
  form: ProjectFormState;
  updateForm: <K extends keyof ProjectFormState>(
    key: K,
    value: ProjectFormState[K],
  ) => void;
};

export default function ProjectBasicSection({ form, updateForm }: Props) {
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
            Start Date
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
            End Date
          </label>

          <input
            type="date"
            value={form.end_date}
            onChange={(e) => updateForm("end_date", e.target.value)}
            className="w-full rounded-lg border border-pinkAccent bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-pinkAccent"
          />
        </div>
      </div>
    </section>
  );
}