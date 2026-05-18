import { ProjectFormState } from "@/lib/admin-project/projectFormDefault";

type Props = {
  form: ProjectFormState;
  updateForm: <K extends keyof ProjectFormState>(
    key: K,
    value: ProjectFormState[K],
  ) => void;
};

export default function ProjectTypeSection({ form, updateForm }: Props) {
  return (
    <section className="bg-white rounded-xl shadow-sm border border-pinkAccent p-5">
      <h2 className="text-sm font-semibold text-textMain mb-4 flex items-center gap-2">
        <span className="w-1.5 h-4 bg-pinkSecondary rounded-full"></span>
        Project Type
      </h2>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => updateForm("type", "donation")}
          className={`rounded-xl border-2 p-4 text-left transition-all ${
            form.type === "donation"
              ? "border-pinkSecondary bg-pinkAccent/40"
              : "border-pinkAccent bg-white"
          }`}
        >
          <div className="text-2xl mb-1">💝</div>
          <div className="text-sm font-semibold">Donation</div>
          <div className="text-xs text-textSub mt-0.5">
            Fundraising project
          </div>
        </button>

        <button
          type="button"
          onClick={() => updateForm("type", "shop")}
          className={`rounded-xl border-2 p-4 text-left transition-all ${
            form.type === "shop"
              ? "border-pinkSecondary bg-pinkAccent/40"
              : "border-pinkAccent bg-white"
          }`}
        >
          <div className="text-2xl mb-1">🛍️</div>
          <div className="text-sm font-semibold">Shop</div>
          <div className="text-xs text-textSub mt-0.5">Merchandise shop</div>
        </button>
      </div>

      {form.type === "donation" && (
        <div className="mt-4">
          <label className="block text-xs font-medium text-textSub mb-1.5">
            Target Amount
          </label>

          <input
            type="number"
            min={0}
            value={form.target_amount || ""}
            onChange={(e) =>
              updateForm("target_amount", Number(e.target.value || 0))
            }
            placeholder="100000"
            className="w-full rounded-lg border border-pinkAccent bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-pinkAccent"
          />
        </div>
      )}

      {form.type === "shop" && (
        <div className="mt-4">
          <label className="block text-xs font-medium text-textSub mb-1.5">
            Shop Status
          </label>

          <select
            value={form.sub_status}
            onChange={(e) => updateForm("sub_status", e.target.value)}
            className="w-full rounded-lg border border-pinkAccent bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-pinkAccent"
          >
            <option value="pre-order">Pre-order</option>
            <option value="ready-stock">Ready stock</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      )}
    </section>
  );
}