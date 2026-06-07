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
  disabled?: boolean;
};

export default function ButtonTeam({
  name,
  options,
  value,
  onChange,
  disabled = false,
}: Props) {
  return (
    <div className="flex flex-wrap gap-1 mt-1">
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
              disabled={disabled}
            />

            {/* chip UI */}
            <span
              className={`px-3 py-2 rounded-full text-xs font-semibold transition text-center
              ${
                isActive
                  ? "bg-pinkSecondary/80 text-white shadow-sm"
                  : "bg-pinkAccent text-gray-500"
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