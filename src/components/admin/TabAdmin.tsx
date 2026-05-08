type Prop = {
  type: string;
  tab: string;
  setTab: (tab: string) => void;
};

export default function TabAdmin({
  type,
  tab = "summary",
  setTab,
}: Prop) {

  return (
    <div className="w-full border-b border-pinkAccent flex">

      <button
        onClick={() => setTab("summary")}
        className={`w-[120px] px-3 py-2 border border-pinkAccent rounded-t-md text-center transition ${
          tab === "summary"
            ? "bg-pinkAccent text-pinkSecondary"
            : "bg-white"
        }`}
      >
        Summary
      </button>

      <button
        onClick={() => setTab("project")}
        className={`w-[120px] px-3 py-2 border border-pinkAccent rounded-t-md text-center transition ${
          tab === "project"
            ? "bg-pinkAccent text-pinkSecondary"
            : "bg-white"
        }`}
      >
        Project
      </button>

    </div>
  );
}