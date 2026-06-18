import { ProfileSummary } from "@/lib/api/types";
import { formatAmount } from "@/lib/formatAmountK";
import { driveThumb } from "@/lib/workUtils";
import { useState } from "react";
import ImagePreviewModal from "../ImagePreviewModal";

type Props = {
  user: any;
  className?: string;
  profile?: ProfileSummary | null;
  teams?: any[];
  onClick?: () => void;
  copied?: boolean;
  setCopied?: (copied: boolean) => void;
};

export default function SectionProfile({
  user,
  className = "",
  profile,
  teams,
  onClick,
  copied,
  setCopied,
}: Props) {
  const defaultImage = "/icon/june_logo_circle.png";

  const team = teams?.find((item) => String(item.value) === String(user?.team));

  const image = driveThumb(team?.image_url || "") || defaultImage;

  return (
    <section className={className}>
      <div className="bg-white rounded-2xl border border-pink-100 shadow-sm p-5 md:p-6 h-full">
        <div className="flex flex-col items-center text-center md:text-left">
          <div className="relative">
            <div
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
              className="w-24 h-24 md:w-28 md:h-28 rounded-full ring-2 ring-pinkAccent bg-cover bg-center select-none pointer-events-none"
              style={{
                backgroundImage: `url(${image})`,
              }}
            />
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={onClick}
              className="text-lg md:text-xl font-semibold hover:text-pinkSecondary transition"
            >
              {user?.username || "-"}
            </button>

            {copied && (
              <div className="mt-1 text-xs text-pinkSecondary">
                ✓ UUID Copied
              </div>
            )}
          </div>
        </div>

        {/* Mini Stats */}
        <div className="mt-5 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl bg-pinkAccent/50 py-3">
            <div className="font-semibold text-pink-500">
              {profile?.totalProjects || "-"}
            </div>
            <div className="text-sm text-secondary">Projects</div>
          </div>

          <div className="rounded-xl bg-pink-50 py-3">
            <div className="font-semibold text-pink-500">
              {profile?.totalOrders || "-"}
            </div>
            <div className="text-sm text-secondary">Orders</div>
          </div>

          <div className="rounded-xl bg-pink-50 py-3">
            <div className="font-semibold text-pink-500">
              {profile?.totalAmount
                ? formatAmount(profile?.totalAmount || 0)
                : "-"}
            </div>
            <div className="text-sm text-secondary">Spender</div>
          </div>
        </div>
      </div>
    </section>
  );
}
