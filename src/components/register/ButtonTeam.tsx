"use client";

type Option = {
  value: string;
  label: string;
};

type Props = {
  name: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
};

export default function ButtonTeam({
  name,
  options,
  value,
  onChange,
}: Props) {
  return (
    <div className="flex flex-wrap gap-2 mt-1">
      {options.map((opt) => {
        const isActive = value === opt.value;

        return (
          <label key={opt.value} className="cursor-pointer">
            {/* hidden radio */}
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={isActive}
              onChange={() => onChange(opt.value)}
              className="hidden"
            />

            {/* chip UI */}
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold transition text-center
              ${
                isActive
                  ? "bg-pinkSecondary/80 text-white shadow-sm"
                  : "bg-pinkAccent text-textSub"
              }`}
            >
              {opt.label}
            </span>
          </label>
        );
      })}
    </div>
  );
}