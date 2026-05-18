type Props = {
  onClose?: () => void;
  onEdit?: () => void;
};

export default function ProjectDetailFooter({ onClose, onEdit }: Props) {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t shadow-lg px-4 py-3 z-40">
      <div className="max-w-5xl mx-auto flex justify-end items-center gap-3 md:max-w-3xl lg:max-w-6xl">
        <button
          type="button"
          onClick={onClose}
          className="text-pinkSecondary px-5 py-2 rounded-xl font-semibold border border-pinkSecondary text-sm"
        >
          Close
        </button>

        <button
          type="button"
          onClick={onEdit}
          className="text-white bg-pinkSecondary px-5 py-2 rounded-xl font-semibold border border-pinkSecondary text-sm"
        >
          Edit
        </button>
      </div>
    </div>
  );
}