import { ProjectFormState } from "@/lib/admin-project/projectFormDefault";

type Props = {
  form: ProjectFormState;
  updateForm: <K extends keyof ProjectFormState>(
    key: K,
    value: ProjectFormState[K],
  ) => void;
};
export default function ProjectLocationSection({ form, updateForm }: Props) {
    return (
        <section className="bg-white rounded-xl shadow-sm border border-pinkAccent p-5">
      <h2 className="text-sm font-semibold text-textMain mb-4 flex items-center gap-2">
        <span className="w-1.5 h-4 bg-pinkSecondary rounded-full"></span>
        Location
      </h2>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <label className="block text-xs font-medium text-textSub mb-1.5">
            Event location name <span className="text-pinkSecondary">*</span>
          </label>

          <input
            type="text"
            value={form.event_location_name}
            onChange={(e) => updateForm("event_location_name", e.target.value)}
            placeholder="location name"
            className="w-full rounded-lg border border-pinkAccent bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-pinkAccent"
          />
        </div>
        <div className="col-span-12">
          <label className="block text-xs font-medium text-textSub mb-1.5">
            Event location url <span className="text-pinkSecondary">*</span>
          </label>

          <input
            type="text"
            value={form.event_location_url}
            onChange={(e) => updateForm("event_location_url", e.target.value)}
            placeholder="google map share link"
            className="w-full rounded-lg border border-pinkAccent bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-pinkAccent"
          />
        </div>
      </div>
    </section>
    );
}