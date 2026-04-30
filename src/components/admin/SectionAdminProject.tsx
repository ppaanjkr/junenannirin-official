import { ChevronDown, ListFilterPlus, Search } from "lucide-react";
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

  const formatTHB = (n: number) => "฿" + Number(n || 0).toLocaleString("en-US");

  const formatDate = (d: string) => new Date(d).toLocaleDateString("th-TH");

  const goTo = (id: string) => {
    router.push(`/project/${id}`);
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
            <select onChange={(e) => setType(e.target.value)} className="px-3 py-2 rounded-lg border border-pinkAccent outline-none">
              <option value="">All type</option>
              <option value="donation">Donation</option>
              <option value="shop">Shop</option>
            </select>

            <select onChange={(e) => setStatus(e.target.value)} className="px-3 py-2 rounded-lg border border-pinkAccent outline-none">
              <option value="">All Status</option>
              <option value="active">Active</option>
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
              <option value="active">Active</option>
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
            className="col-span-12 sm:col-span-6 bg-white rounded-xl border shadow-sm p-3 cursor-pointer hover:shadow-md transition active:scale-[0.98]"
          >
            <div className="flex gap-3">
              {/* image */}
              <img
                src={p.image_url}
                className="w-24 h-24 rounded-xl object-cover"
              />

              <div className="flex-1 min-w-0 flex flex-col">
                {/* title */}
                <div className="flex justify-between gap-2">
                  <h3 className="font-bold line-clamp-2">{p.name}</h3>

                  <span className="text-xs px-2 py-1 rounded bg-pink-100 text-pink-600">
                    {p.type}
                  </span>
                </div>

                {/* date */}
                <p className="text-xs text-gray-500 mt-1">
                  {formatDate(p.start_date)} - {formatDate(p.end_date)}
                </p>

                {/* bottom */}
                <div className="mt-auto flex justify-between items-end">
                  <div>
                    <p className="text-xs text-gray-400">ยอดรวม</p>
                    <p className="font-bold text-pink-600">
                      {formatTHB(p.current_amount)}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-600">
                      {p.type === "shop" ? p.sub_status : p.status}
                    </span>

                    {p.closed_at && (
                      <p className="text-xs text-gray-400">
                        ปิด {formatDate(p.closed_at)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* empty */}
      {filtered.length === 0 && (
        <div className="text-center py-10 text-gray-400">ไม่พบโปรเจกต์</div>
      )}
    </section>
  );
}
