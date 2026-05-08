"use client";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type Props = {
  page: number;
  totalPages: number;
  setPage: React.Dispatch<
    React.SetStateAction<number>
  >;
};

export default function MemberPagination({
  page,
  totalPages,
  setPage,
}: Props) {
  return (
    <section className="flex justify-center items-center gap-2 mt-5">
      <button
        disabled={page === 1}
        onClick={() => setPage((p) => p - 1)}
        className="w-9 h-9 rounded-xl border border-pinkAccent bg-white disabled:opacity-40 flex items-center justify-center"
      >
        <ChevronLeft size={16} />
      </button>

      <div className="text-sm text-textSub">
        Page {page} / {totalPages || 1}
      </div>

      <button
        disabled={page >= totalPages}
        onClick={() => setPage((p) => p + 1)}
        className="w-9 h-9 rounded-xl border border-pinkAccent bg-white disabled:opacity-40 flex items-center justify-center"
      >
        <ChevronRight size={16} />
      </button>
    </section>
  );
}