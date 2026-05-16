export default function LoadingOverlay({
  block = true,
}: {
  block?: boolean;
}) {
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black/30 z-[9999] ${
        block ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      <div className="px-4 py-2 rounded-lg">
        <img src="/loading.svg" alt="loading" />
      </div>
    </div>
  );
}