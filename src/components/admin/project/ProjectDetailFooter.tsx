export default function ProjectDetailFooter() {
    return (
       <div
      className="fixed bottom-0 left-0 w-full bg-white border-t shadow-lg px-4 py-3"
    >
      <div className="max-w-5xl mx-auto flex justify-end items-center gap-3 md:max-w-3xl">
        <button
          className="text-pinkSecondary px-5 py-2 rounded-xl font-semibold border border-pinkSecondary text-sm"
        //   disabled={total === 0}
        //   onClick={onCheckout}
        >
          Close
        </button>
        <button
          className="text-pinkSecondary px-5 py-2 rounded-xl font-semibold border border-pinkSecondary text-sm"
        //   disabled={total === 0}
        //   onClick={onCheckout}
        >
          Edit
        </button>
      </div>
    </div>
    );
}