import { ProjectFormState } from "@/lib/admin-project/projectFormDefault";

type Props = {
  form: ProjectFormState;
  banks: any[];
  updateForm: <K extends keyof ProjectFormState>(
    key: K,
    value: ProjectFormState[K],
  ) => void;
};

export default function ProjectBankSection({ form, updateForm, banks }: Props) {
  return (
    <section className="bg-white rounded-xl shadow-sm border border-pinkAccent p-5">
      <h2 className="text-sm font-semibold text-textMain mb-3 flex items-center gap-2">
        <span className="w-1.5 h-4 bg-pinkSecondary rounded-full"></span>
        Bank Account
      </h2>

      <select
        value={form.bank_id}
        onChange={(e) => updateForm("bank_id", e.target.value)}
        className="w-full rounded-lg border border-pinkAccent bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-pinkAccent"
      >
        <option value="">Select bank account</option>

        {banks.map((bank: any) => (
          <option key={bank.id} value={bank.id}>
            {bank.bank_name}: {bank.account_no}: {bank.account_name} 
          </option>
        ))}
      </select>
    </section>
  );
}