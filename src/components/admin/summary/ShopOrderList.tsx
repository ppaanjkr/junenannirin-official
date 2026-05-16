"use client";

import LoadingOverlay from "@/components/LoadingOverlay";
import { useEffect, useMemo, useState } from "react";
import ShopOrderCard from "./ShopOrderCard";
import ShopOrderTable from "./ShopOrderTable";
import Pagination from "@/components/Pagination";
import Popup from "@/components/ModalPopup";

type Props = {
  projectId: string;
  orders: any;
};

export default function ShopOrderList({ projectId, orders }: Props) {
  const [orderRows, setOrderRows] = useState<any[]>(orders || []);

  useEffect(() => {
    setOrderRows(orders || []);
  }, [orders]);

  const [isLoading, setLoading] = useState(false);

  const [popup, setPopup] = useState({
    open: false,
    type: "",
    message: "",
    onClose: undefined as (() => void) | undefined,
  });

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [editedRows, setEditedRows] = useState<any>({});
  const [limit, setLimit] = useState(10);

  // =====================================================
  // update เฉพาะ shipment ใน state ไม่ reload ทั้งหน้า
  // =====================================================
  function updateOrderShipmentState(shipments: any[]) {
    setOrderRows((prev) =>
      prev.map((row: any) => {
        const updated = shipments.find(
          (s: any) => String(s.shipment_id) === String(row.shipment.id),
        );

        if (!updated) return row;

        return {
          ...row,
          shipment: {
            ...row.shipment,
            tracking_no: updated.tracking_no,
            carrier: updated.carrier,
            status: updated.status ?? row.shipment.status,
          },
        };
      }),
    );
  }

  // =====================================================
  // search
  // ใช้ orderRows แทน orders
  // =====================================================
  const filtered = useMemo(() => {
    if (!orderRows) return [];

    return orderRows.filter((item: any) => {
      const keyword = search.toLowerCase();

      const username = String(item.user.username || "").toLowerCase();
      const name = String(item.user.name || "").toLowerCase();
      const phone = String(item.user.phone || "").toLowerCase();
      const tracking = String(item.shipment?.tracking_no || "").toLowerCase();
      const carrier = String(item.shipment?.carrier || "").toLowerCase();

      return (
        username.includes(keyword) ||
        name.includes(keyword) ||
        phone.includes(keyword) ||
        tracking.includes(keyword) ||
        carrier.includes(keyword)
      );
    });
  }, [orderRows, search]);

  // =====================================================
  // paging
  // =====================================================
  const totalPages = limit === -1 ? 1 : Math.ceil(filtered.length / limit);

  const paginated =
    limit === -1 ? filtered : filtered.slice((page - 1) * limit, page * limit);

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

    setLoading(true);

    try {
      const shipments = [
        {
          shipment_id: item.shipment.id,
          tracking_no: edited.tracking_no ?? item.shipment.tracking_no ?? "",
          carrier: edited.carrier ?? item.shipment.carrier ?? "",
        },
      ];

      const res = await fetch("/api/gas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "updateShipments",
          shipments,
        }),
      });

      const json = await res.json();

      if (!json.success) {
        throw new Error(json.error || "Save failed");
      }

      // update เฉพาะแถวนี้ใน state
      updateOrderShipmentState(shipments);

      // clear edited row
      setEditedRows((prev: any) => {
        const copy = { ...prev };
        delete copy[item.shipment.id];
        return copy;
      });

      setLoading(false);

      setPopup({
        open: true,
        type: "success",
        message: "Save completed",
        onClose: undefined,
      });
    } catch (err) {
      setLoading(false);

      console.error(err);

      setPopup({
        open: true,
        type: "error",
        message: "Save failed",
        onClose: undefined,
      });
    }
  }

  async function handleSaveAll() {
    const shipments = Object.entries(editedRows).map(
      ([shipment_id, value]: any) => {
        const current = orderRows?.find(
          (o: any) => String(o.shipment.id) === String(shipment_id),
        );

        return {
          shipment_id,
          tracking_no: value.tracking_no ?? current?.shipment?.tracking_no ?? "",
          carrier: value.carrier ?? current?.shipment?.carrier ?? "",
        };
      },
    );

    if (shipments.length === 0) return;

    setLoading(true);

    try {
      const res = await fetch("/api/gas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "updateShipments",
          shipments,
        }),
      });

      const json = await res.json();

      if (!json.success) {
        throw new Error(json.error || "Save failed");
      }

      // update หลายแถวใน state
      updateOrderShipmentState(shipments);

      // clear edited rows
      setEditedRows({});

      setLoading(false);

      setPopup({
        open: true,
        type: "success",
        message: "Save completed",
        onClose: undefined,
      });
    } catch (err) {
      setLoading(false);

      console.error(err);

      setPopup({
        open: true,
        type: "error",
        message: "Save failed",
        onClose: undefined,
      });
    }
  }

  function handleExport() {
    localStorage.setItem("print_labels", JSON.stringify(filtered));

    window.open(`/admin/project/${projectId}/print`, "_blank");
  }

  return (
    <section className="mt-4">
      {isLoading && <LoadingOverlay />}

      <Popup
        open={popup.open}
        type={popup.type}
        message={popup.message}
        onClose={() => {
          setPopup({
            ...popup,
            open: false,
          });

          popup.onClose?.();
        }}
      />

      <div className="bg-white rounded-lg p-4 shadow-soft border border-pinkAccent">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <h2 className="font-semibold flex items-center gap-2">
            <span className="w-1.5 h-4 bg-pinkSecondary rounded-full"></span>
            Orders
          </h2>

          <div className="flex items-center gap-2 w-full md:w-auto">
            {/* search */}
            <input
              type="text"
              placeholder="Search..."
              className="text-sm flex-1 md:w-[280px] border border-pinkAccent rounded-lg px-4 py-2 outline-none"
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
            />

            {/* limit */}
            <select
              value={limit}
              onChange={(e) => {
                setPage(1);
                setLimit(Number(e.target.value));
              }}
              className="text-sm border border-pinkAccent rounded-lg px-3 py-2 outline-none bg-white min-w-[80px]"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={-1}>All</option>
            </select>
          </div>
        </div>

        {/* export */}
        {filtered.length > 0 && (
          <div className="mt-2 flex justify-end gap-2">
            <button
              onClick={handleExport}
              className="px-4 py-2 border border-pinkSecondary text-pinkSecondary rounded-lg text-sm"
            >
              Print Labels
            </button>

            <button
              onClick={handleSaveAll}
              disabled={Object.keys(editedRows).length === 0}
              className="px-4 py-2 bg-pinkSecondary text-white rounded-lg text-sm disabled:opacity-40"
            >
              Save All
            </button>
          </div>
        )}

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
        {filtered.length === 0 && (
          <div className="h-[200px] flex justify-center items-center text-sm text-textSub">
            No Orders
          </div>
        )}

        <Pagination page={page} totalPages={totalPages} setPage={setPage} />
      </div>
    </section>
  );
}