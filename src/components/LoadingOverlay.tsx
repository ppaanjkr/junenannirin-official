export default function LoadingOverlay(){
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
      <div className="px-4 py-2 rounded-lg">
        <img src={`/loading.svg`} alt="loading" />
      </div>
    </div>
  );
}