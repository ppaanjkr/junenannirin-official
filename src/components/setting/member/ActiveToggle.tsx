export default function ActiveToggle({
  active,
}: {
  active: number;
}) {
  return (
    <button
      disabled
      className={`w-12 h-6 rounded-full transition relative ${
        active
          ? "bg-pinkSecondary"
          : "bg-gray-300"
      }`}
    >
      <div
        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition ${
          active
            ? "translate-x-6"
            : "translate-x-0.5"
        }`}
      />
    </button>
  );
}