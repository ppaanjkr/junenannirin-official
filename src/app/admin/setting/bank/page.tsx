"use client";

import ConfirmPopup from "@/components/ConfirmPopup";
import LoadingOverlay from "@/components/LoadingOverlay";
import Popup from "@/components/ModalPopup";
import SectionBack from "@/components/SectionBack";
import BankEditModal from "@/components/setting/bank/BankEditModal";
import { getBankOptionByShortName } from "@/data/bank";
import { useBankList } from "@/hooks/useAdmin";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const router = useRouter();

  const { banks, isBankLoading } = useBankList();

  const [bankRows, setBankRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [selectedBank, setSelectedBank] = useState<any>(null);

  const [popup, setPopup] = useState({
    open: false,
    type: "",
    message: "",
  });

  const [confirmPopup, setConfirmPopup] = useState<{
    open: boolean;
    bank: any | null;
  }>({
    open: false,
    bank: null,
  });

  useEffect(() => {
    setBankRows(banks || []);
  }, [banks]);

  function handleOpenAdd() {
    setSelectedBank(null);
    setOpenModal(true);
  }

  function handleOpenEdit(bank: any) {
    setSelectedBank(bank);
    setOpenModal(true);
  }

  function handleCloseModal() {
    setSelectedBank(null);
    setOpenModal(false);
  }

  function handleSaved(bank: any, mode: "create" | "update") {
    if (mode === "create") {
      setBankRows((prev) => [bank, ...prev]);
    }

    if (mode === "update") {
      setBankRows((prev) =>
        prev.map((item) =>
          String(item.id) === String(bank.id)
            ? {
                ...item,
                ...bank,
              }
            : item,
        ),
      );
    }

    handleCloseModal();
  }

  async function handleDelete(bank: any) {
    if (!bank?.id) return;

    setLoading(true);

    try {
      const res = await fetch("/api/gas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "deleteBank",
          bank_id: bank.id,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setPopup({
          open: true,
          type: "error",
          message: data.message || "Delete bank failed",
        });
        return;
      }

      setBankRows((prev) =>
        prev.filter((item) => String(item.id) !== String(bank.id)),
      );

      setConfirmPopup({
        open: false,
        bank: null,
      });

      setPopup({
        open: true,
        type: "success",
        message: "Bank deleted successfully",
      });
    } catch (err) {
      console.error(err);

      setPopup({
        open: true,
        type: "error",
        message: "Delete bank failed",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {(isBankLoading || loading) && <LoadingOverlay />}

      <Popup
        open={popup.open}
        type={popup.type}
        message={popup.message}
        onClose={() =>
          setPopup((prev) => ({
            ...prev,
            open: false,
          }))
        }
      />
      <ConfirmPopup
        open={confirmPopup.open}
        title="Delete Bank Account?"
        // message={`Delete bank account "${confirmPopup.bank?.bank_name || ""}"?\nThis action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        loading={loading}
        onCancel={() =>
          setConfirmPopup({
            open: false,
            bank: null,
          })
        }
        onConfirm={() => handleDelete(confirmPopup.bank)}
      />

      <BankEditModal
        open={openModal}
        bank={selectedBank}
        onClose={handleCloseModal}
        onSaved={handleSaved}
      />

      <main className="max-w-5xl mx-auto px-6 py-4 md:max-w-3xl lg:max-w-6xl">
        <SectionBack
          onclick={() => router.replace("/admin/setting")}
          title={"Setting Bank"}
        />

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-6">
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 bg-pinkSecondary/80 text-white rounded-lg w-full flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> Bank Accounts
            </button>
          </div>

          <div className="col-span-12 md:col-span-6" />

          {bankRows && bankRows.length > 0 ? (
            bankRows.map((item: any) => {
              const bankOption = getBankOptionByShortName(
                item?.bank_short_name,
              );
              const bankLogo = bankOption?.bank_logo || "";

              return (
                <div
                  key={item.id}
                  className="col-span-12 md:col-span-6 bg-white border border-pinkAccent rounded-xl shadow-sm p-3 flex gap-3"
                >
                  <div className="flex flex-col w-full">
                    <div className="flex gap-4">
                      <div className="w-16 h-16 md:w-14 md:h-14 rounded-lg border-2 border-pinkAccent flex items-center justify-center overflow-hidden">
                        {bankLogo ? (
                          <img
                            src={bankLogo}
                            alt={item.bank_short_name}
                            className="w-8 h-8 object-contain"
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

                        {Number(item.active) === 0 && (
                          <p className="text-xs text-red-400 mt-1">Inactive</p>
                        )}
                      </div>
                    </div>

                    <div className="mt-2 grid grid-cols-12 gap-2">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="col-span-6 text-sm bg-pinkAccent/50 text-pinkSecondary rounded-md w-full p-1"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          setConfirmPopup({
                            open: true,
                            bank: item,
                          })
                        }
                        className="col-span-6 text-sm bg-red-50 text-red-400 rounded-md w-full p-1"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-12 bg-white border border-pinkAccent rounded-xl shadow-sm p-3 flex justify-center items-center h-[200px] text-sm">
              No Data
            </div>
          )}
        </div>
      </main>
    </>
  );
}
