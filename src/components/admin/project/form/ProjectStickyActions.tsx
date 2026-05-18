type Props = {
  mode: "create" | "edit";
  onCancel: () => void;
  onSave: () => void;
};

export default function ProjectStickyActions({ mode, onCancel, onSave }: Props) {
  return (
    <div className="fixed bottom-0 inset-x-0 bg-white/90 backdrop-blur-md border-t border-pinkAccent z-40">
      <div className="max-w-5xl mx-auto px-6 py-3 flex items-center gap-3 justify-end md:max-w-3xl lg:max-w-6xl">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 rounded-lg text-sm font-medium text-textSub hover:bg-pinkAccent/40 transition-all"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={onSave}
          className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-pinkSecondary shadow-sm transition-all"
        >
          {mode === "create" ? "Create Project" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}