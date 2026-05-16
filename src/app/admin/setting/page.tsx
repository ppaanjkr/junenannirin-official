"use client";

import { ChevronRight, CreditCard, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  function handleGoToPage(page: string) {
    const path = page.startsWith("/") ? page : `/${page}`;

    setTimeout(() => {
      router.push(path);
    }, 50);
  }
  return (
    <main className="max-w-5xl mx-auto px-6 py-4 md:max-w-3xl lg:max-w-6xl">
      <div className="grid grid-cols-12 gap-4">
        <button
          onClick={() => handleGoToPage("admin/setting/member")}
          className="col-span-12 md:col-span-6 bg-white border border-pinkAccent rounded-xl shadow-sm p-3 cursor-pointer hover:shadow-md transition active:scale-[0.98] flex gap-4 px-4 py-3 items-center"
        >
          <div className="w-10 h-10 rounded-md bg-pinkAccent/50 flex items-center justify-center p-1">
            <UserRound className="w-6 h-6 text-pinkSecondary" />
          </div>
          <div className="flex justify-between items-center w-full">
            <span>Setting Members</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </button>
        <button
          onClick={() => handleGoToPage("admin/setting/bank")}
          className="col-span-12 md:col-span-6 bg-white border border-pinkAccent rounded-xl shadow-sm p-3 cursor-pointer hover:shadow-md transition active:scale-[0.98] flex gap-4 px-4 py-3 items-center"
        >
          <div className="w-10 h-10 rounded-md bg-pinkAccent/50 flex items-center justify-center p-1">
            <CreditCard className="w-6 h-6 text-pinkSecondary" />
          </div>
          <div className="flex justify-between items-center w-full">
            <span>Setting Banks</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </button>
      </div>
    </main>
  );
}
