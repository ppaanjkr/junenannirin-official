"use client";

import LoadingOverlay from "@/components/LoadingOverlay";
import SectionBack from "@/components/SectionBack";
import { useBankList } from "@/hooks/useAdmin";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { getBankLogo } from "@/lib/workUtils";

export default function Page() {
  const router = useRouter();
  const { banks, isBankLoading } = useBankList();

  return (
    <main className="max-w-5xl mx-auto px-6 py-4 md:max-w-3xl">
      {isBankLoading && <LoadingOverlay />}
      <SectionBack
        onclick={() => router.replace("/admin/setting")}
        title={"Setting Bank"}
      />
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <button disabled className="px-4 py-2 bg-pinkSecondary/80 text-white rounded-lg w-full flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> Bank Accounts
          </button>
        </div>
        {banks && banks.length > 0 ? (
          banks.map((item: any) => (
            <div
              key={item.id}
              className="col-span-12 bg-white border border-pinkAccent rounded-xl shadow-sm p-3 flex gap-3"
            >
              <div className="flex flex-col w-full">
                <div className="flex gap-4">
                  <div className="w-16 h-16 md:w-14 md:h-14 rounded-lg border-2 border-pinkAccent flex items-center justify-center overflow-hidden">
                    {getBankLogo(item.bank_short_name) ? (
                      <img
                        src={getBankLogo(item.bank_short_name ? item?.bank_short_name?.trim().toLowerCase() : "")}
                        alt={item.bank_short_name}
                        className="w-8 h-8 object-cover"
                      />
                    ) : (
                      <span className="text-xs text-pinkSecondary">
                        {item.bank_short_name}
                      </span>
                    )}
                  </div>

                  <div className="text-textSub">
                    <p className="font-semibold text-md text-textMain">
                      {item.bank_name}
                    </p>
                    <p className="text-sm">{item.account_no}</p>
                    <p className="text-sm">{item.account_name}</p>
                  </div>
                </div>
                <div className="mt-2 grid grid-cols-12 gap-2">
                  <button disabled className="col-span-6 text-sm bg-pinkAccent/50 text-pinkSecondary rounded-md w-full p-1">
                    Edit
                  </button>
                  <button disabled className="col-span-6 text-sm bg-pinkAccent/50 text-pinkSecondary rounded-md w-full p-1">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-12 bg-white border border-pinkAccent rounded-xl shadow-sm p-3 flex justify-center items-center h-[200px] text-sm">
            No Data
          </div>
        )}
      </div>
    </main>
  );
}
