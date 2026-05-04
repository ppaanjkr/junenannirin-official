import { UserDonationSummery } from "@/lib/api/types";
import { formatTHB } from "@/lib/formatTHB";
import { useRef, useState } from "react";

type Theme = {
  secondary: string;
  accent: string;
};

export default function SectionDonationSummary({
  data,
  theme,
  user,
}: {
  data: UserDonationSummery | null;
  theme: Theme;
  user: any;
}) {
  console.log(data);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  // open file
  function triggerFile() {
    if (file) return;
    fileRef.current?.click();
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;

    // validate type
    if (!f.type.startsWith("image/")) {
      alert("Please select image file");
      return;
    }

    // validate size (5MB)
    if (f.size > 5 * 1024 * 1024) {
      alert("File size over 5MB");
      return;
    }

    setFile(f);

    // preview
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreview(ev.target?.result as string);
    };
    reader.readAsDataURL(f);
  }

  // remove file
  function removeFile(e: React.MouseEvent) {
    e.stopPropagation();

    setFile(null);
    setPreview("");

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  }
  return (
    <section className="col-span-12 md:col-span-6">
      <div className="flex justify-between items-center mt-6">
        <span className="text-xl font-semibold">Your Supports</span>
      </div>
      <div>
        <div
          className="grid grid-cols-12 gap-4 bg-white rounded-md p-4 shadow-sm border mt-1"
          style={{
            borderColor: `${theme.accent}`,
          }}
        >
          <div className="col-span-12 md:col-span-6">
            <div className="mb-2 font-semibold">
              <span>Hello, </span>
              <span>{user.name}</span>
            </div>
            <div
              className="rounded-lg p-3 border"
              style={{
                backgroundColor: `${theme.accent}40`,
                color: `${theme.secondary}`,
                borderColor: `${theme.accent}`,
              }}
            >
              <span className="text-sm">Your Total Contribution</span>
              <div className="text-2xl flex gap-3 font-semibold">
                <span>฿</span>
                <span>{formatTHB(data?.total_amount || 0)}</span>
              </div>
            </div>
            {data?.rewards && data?.rewards.length > 0 && (
              <div className="mt-1">
                <span className="text-sm">Your Rewards</span>
                <div className="text-sm flex flex-col">
                  {data.rewards.map((reward) => (
                    <span key={reward.reward_id}>• {reward.title} x {reward.qty}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="col-span-12 md:col-span-6">
            <div
              onClick={triggerFile}
              className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition"
              style={{
                borderColor: `${theme.secondary}40`,
                backgroundColor: `${theme.accent}20`,
              }}
            >
              {/* EMPTY */}
              {!file && (
                <div>
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto"
                    style={{ backgroundColor: `${theme.secondary}10` }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 3v12" />
                      <path d="m17 8-5-5-5 5" />
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    </svg>
                  </div>

                  <p className="font-semibold mt-3">Upload slip</p>
                  <p className="text-xs" style={{ color: theme.secondary }}>
                    JPG / PNG (max 5MB)
                  </p>
                </div>
              )}

              {/* FILLED */}
              {file && (
                <div className="flex items-center gap-3 text-left">
                  <img
                    src={preview}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">
                      {file.name}
                    </p>
                    <p className="text-xs" style={{ color: theme.secondary }}>
                      {(file.size / 1024).toFixed(1)} KB • uploaded
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={removeFile}
                    className="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0"
                    style={{ backgroundColor: `${theme.secondary}10` }}
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* INPUT */}
              <input
                disabled={loading}
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFile}
              />
            </div>
            <button
              id="confirmPayBtn"
              className="mt-2 w-full text-white py-3 rounded-xl font-bold disabled:opacity-50"
              style={{
                backgroundColor: `${theme.secondary}`,
              }}
              disabled={!file || loading}
              // onClick={handleSubmitOrder}
            >
              Confirm Payment
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
