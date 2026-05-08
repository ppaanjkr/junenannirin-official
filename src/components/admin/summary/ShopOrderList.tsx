"use client";

import LoadingOverlay from "@/components/LoadingOverlay";

import { useOrderList } from "@/hooks/useAdmin";

import { useMemo, useState } from "react";
import ShopOrderCard from "./ShopOrderCard";
import ShopOrderTable from "./ShopOrderTable";

type Props = {
  projectId: number;
};

export default function ShopOrderList({ projectId }: Props) {
  const { orders, isOrderLoading } = useOrderList(projectId.toString());

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);

  const [editedRows, setEditedRows] = useState<any>({});

  const limit = 2;

    //   search
  const filtered = useMemo(() => {
    if (!orders) return [];

    return orders.filter((item: any) => {
      const keyword = search.toLowerCase();

      return (
        item.user.username?.toLowerCase().includes(keyword) ||
        item.user.name?.toLowerCase().includes(keyword) ||
        item.user.phone?.toLowerCase().includes(keyword) ||
        item.shipment.tracking_no?.toLowerCase().includes(keyword)
      );
    });
  }, [orders, search]);

//   paging
  const totalPages = Math.ceil(filtered.length / limit);
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  function handleChange(shipmentId: string, field: string, value: string) {
    setEditedRows((prev: any) => ({
      ...prev,

      [shipmentId]: {
        ...prev[shipmentId],

        [field]: value,
      },
    }));
  }

  async function handleSave(item: any) {
    const edited = editedRows[item.shipment.id];

    if (!edited) return;

    console.log({
      shipment_id: item.shipment.id,

      tracking_no: edited.tracking_no,

      carrier: edited.carrier,
    });

    // TODO:
    // UPDATE API
  }

  return (
    <section className="mt-4">
      {isOrderLoading && <LoadingOverlay />}

      <div className="bg-white rounded-lg p-4 shadow-soft border border-pinkAccent">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <h2 className="font-semibold flex items-center gap-2">
            <span className="w-1.5 h-4 bg-pinkSecondary rounded-full"></span>
            Orders
          </h2>

          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search..."
            className="text-sm w-full md:w-[280px] border border-pinkAccent rounded-lg px-4 py-2 outline-none "
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
          />
        </div>

        {/* MOBILE */}
        <div className="grid grid-cols-1 gap-3 mt-4 md:hidden">
          {paginated.map((item: any) => (
            <ShopOrderCard
              key={item.user.uuid}
              item={item}
              editedRows={editedRows}
              handleChange={handleChange}
              handleSave={handleSave}
            />
          ))}
        </div>

        {/* DESKTOP */}
        <div className="hidden md:block mt-4">
          <ShopOrderTable
            data={paginated}
            editedRows={editedRows}
            handleChange={handleChange}
            handleSave={handleSave}
          />
        </div>

        {/* EMPTY */}
        {!isOrderLoading && filtered.length === 0 && (
          <div className=" h-[200px] flex justify-center items-center text-sm text-textSub " >
            No Orders
          </div>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-5 flex-wrap">
            {Array.from({
              length: totalPages,
            }).map((_, index) => (
              <button
                key={index}
                className={`
                  w-9 h-9 rounded-lg text-sm
                  ${
                    page === index + 1
                      ? "bg-pinkSecondary text-white"
                      : "bg-white border border-pinkAccent"
                  }
                `}
                onClick={() => setPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
