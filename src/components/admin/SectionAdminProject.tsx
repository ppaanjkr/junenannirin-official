import { formatThaiDate } from "@/lib/formatThaiDate";
import { formatTHB } from "@/lib/formatTHB";
import { driveThumb } from "@/lib/workUtils";
import { CircleDollarSign, Heart, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export default function SectionAdminProject({
  projects = [],
}: {
  projects: any[];
}) {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase()))
        return false;

      if (type && p.type !== type) return false;

      if (status) {
        const isClosed =
          p.type === "donation"
            ? p.status === "closed"
            : p.sub_status === "closed";

        if (status === "closed" && !isClosed) return false;
        if (status === "active" && isClosed) return false;
      }

      return true;
    });
  }, [projects, search, type, status]);

  const goTo = (id: string) => {
    router.push(`/admin/project/${id}`);
  };

  return (
    <section className="mt-1">
      <div className="mt-5 bg-white rounded-xl p-3 sm:p-4 shadow-soft border border-pinkAccent">
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-12 lg:col-span-6 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-textSub" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="search..."
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-pinkAccent outline-none"
            />
          </div>

          {/* desktop */}
          <div className="hidden lg:flex col-span-6 gap-2 justify-end">
            <select
              onChange={(e) => setType(e.target.value)}
              className="px-3 py-2 rounded-lg border border-pinkAccent outline-none"
            >
              <option value="">All type</option>
              <option value="donation">Donation</option>
              <option value="shop">Shop</option>
            </select>

            <select
              onChange={(e) => setStatus(e.target.value)}
              className="px-3 py-2 rounded-lg border border-pinkAccent outline-none"
            >
              <option value="">All Status</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {/* mobile */}
          <div className="col-span-12 lg:hidden grid grid-cols-2 gap-2">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="px-3 py-2 rounded-lg border border-pinkAccent outline-none"
            >
              <option value="">All Type</option>
              <option value="donation">Donation</option>
              <option value="shop">Shop</option>
            </select>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-3 py-2 rounded-lg border border-pinkAccent outline-none"
            >
              <option value="">All Status</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-12 gap-3">
        {filtered.map((p) => (
          <div
            key={p.id}
            onClick={() => goTo(p.id)}
            className="col-span-12 bg-white border border-pinkAccent rounded-xl shadow-sm p-3 cursor-pointer hover:shadow-md transition active:scale-[0.98]"
          >
            <div className="flex gap-3">
              <img
                src={driveThumb(p.image_url)}
                className="w-24 h-24 md:w-32 md:h-32 rounded-lg object-cover"
              />

              <div className="flex-1 min-w-0 flex flex-col">
                <div className="flex justify-between">
                  <div className="flex gap-1">
                    <span className="text-xs px-2 py-1 rounded bg-pinkAccent text-pinkSecondary">
                      {p.type}
                    </span>
                    {p.sub_status != "" && (
                      <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-600">
                        {p.sub_status}
                      </span>
                    )}
                  </div>
                  <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-600">
                    {p.status}
                  </span>
                </div>
                <h3 className="font-bold line-clamp-2 mt-1">{p.name}</h3>

                <span className="text-xs text-gray-500 mt-1">
                  {formatThaiDate(p.start_date)} - {formatThaiDate(p.end_date)}
                </span>

                <div className="mt-auto flex justify-between items-end">
                  <div>
                    <div className="font-bold text-pinkSecondary flex items-center gap-1">
                      <CircleDollarSign className="w-4 h-4 inline-block" />
                      {formatTHB(p.current_amount)}
                      {p.type === "donation" ? (
                        <span> / {formatTHB(p.target_amount)} THB</span>
                      ) : " THB"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* empty */}
      {filtered.length === 0 && (
        <div className="col-span-12 bg-white border border-pinkAccent rounded-xl shadow-sm p-3 flex justify-center items-center h-[200px] text-sm">
          No Data
        </div>
      )}
    </section>
  );
}
