export default function ActiveToggle({
  active,
  disabled,
  onClick,
}: {
  active: number;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`w-12 h-6 rounded-full transition relative ${
        active ? "bg-pinkSecondary" : "bg-gray-300"
      }`}
    >
      <div
        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition ${
          active ? "translate-x-6" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}
