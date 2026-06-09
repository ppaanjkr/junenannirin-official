import { ImportRow, Participant } from "@/types/event";
import { importEventParticipants, checkInParticipant } from "@/lib/api/admin";

import * as XLSX from "xlsx";
import { useEffect, useRef, useState } from "react";
import LoadingOverlay from "@/components/LoadingOverlay";
import Popup from "@/components/ModalPopup";
import EventParticipantList from "./EventParticipantList";
import ConfirmPopup from "@/components/ConfirmPopup";

type Props = {
  participants: Participant[];
  projectId: string;
  isLoading?: boolean;
  setParticipants: React.Dispatch<React.SetStateAction<Participant[]>>;
};

export default function EventImport({
  participants,
  projectId,
  isLoading,
  setParticipants,
}: Props) {
  const [previewRows, setPreviewRows] = useState<ImportRow[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);

  const [popup, setPopup] = useState({
    open: false,
    type: "success" as "success" | "error" | "warning",
    message: "",
  });

  const hasParticipants = participants.length > 0;
  const [confirmItem, setConfirmItem] = useState<any>(null);
  const [checkinLoading, setCheckinLoading] = useState(false);
  const [reloadOnClose, setReloadOnClose] = useState(false);

  const [isImportMode, setIsImportMode] = useState(false);

  function handleCheckIn(participant: any) {
    setConfirmItem(participant);
  }

  async function confirmCheckIn() {
    if (!confirmItem) return;

    try {
      setCheckinLoading(true);

      const res = await checkInParticipant(confirmItem.id);

      if (!res.success) {
        setPopup({
          open: true,
          type: "error",
          message: res.message || "Check-in failed",
        });

        return;
      }

      setParticipants((prev) =>
        prev.map((item: any) =>
          item.id === confirmItem.id
            ? {
                ...item,
                checked_in: true,
                checked_in_at: {
                  _seconds: Math.floor(Date.now() / 1000),
                  _nanoseconds: 0,
                },
              }
            : item,
        ),
      );

      setConfirmItem(null);

      setReloadOnClose(false);

      setPopup({
        open: true,
        type: "success",
        message: "Check-in completed",
      });
    } catch (err: any) {
      setPopup({
        open: true,
        type: "error",
        message: err?.message || "Check-in failed",
      });
    } finally {
      setCheckinLoading(false);
    }
  }

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const rows: any[] = XLSX.utils.sheet_to_json(worksheet, {
      defval: "",
    });

    const parsedRows: ImportRow[] = rows.map((row) => ({
      queue: Number(row.Queue || row.queue || row.QUEUE),
      name: row.Name || row.name || "",
      uuid: row.UUID || row.uuid || "",
      phone: row.Phone || row.phone || "",
      twitter: row.X || row.x || "",
    }));

    setPreviewRows(parsedRows);
  };

  async function handleImport() {
    try {
      setLoading(true);

      const res = await importEventParticipants({
        project_id: projectId,
        participants: previewRows,
      });

      if (!res.success) {
        setPopup({
          open: true,
          type: "error",
          message: res.message || "Import failed",
        });

        return;
      }

      setReloadOnClose(true);

      setPopup({
        open: true,
        type: "success",
        message: `Import completed (${res.count} participants)`,
      });

      setPreviewRows([]);
    } catch (err: any) {
      setPopup({
        open: true,
        type: "error",
        message: err?.message || "Import failed",
      });
    } finally {
      setLoading(false);
    }
  }

  function handleImportNewList() {
    const hasCheckIn = participants.some((x) => x.checked_in);

    if (hasCheckIn) {
      setPopup({
        open: true,
        type: "error",
        message:
          "Cannot import new list because some participants have already checked in.",
      });

      return;
    }

    setIsImportMode(true);
  }

  return (
    <div className="mt-4">
      {(loading || checkinLoading) && <LoadingOverlay />}
      <Popup
        open={popup.open}
        type={popup.type}
        message={popup.message}
        onClose={() => {
          setPopup({
            ...popup,
            open: false,
          });

          if (reloadOnClose) {
            window.location.reload();
          }
        }}
      />
      <ConfirmPopup
        open={!!confirmItem}
        title="Confirm Check-in"
        message={`${confirmItem?.full_name ?? ""}`}
        confirmText="Check-in"
        cancelText="Cancel"
        loading={checkinLoading}
        onCancel={() => setConfirmItem(null)}
        onConfirm={confirmCheckIn}
      />

      {!isLoading &&
        (!hasParticipants || isImportMode) &&
        previewRows.length === 0 && (
          <div className="bg-white border border-pinkAccent rounded-xl p-6">
            <h2 className="font-semibold text-lg">Import Participants</h2>

            {/* desktop */}
            <div className="text-sm mt-1">
              Example for import
              <div className="overflow-x-auto">
                <table className="text-sm min-w-[700px] md:w-full">
                  <thead className="bg-pinkAccent/40 border">
                    <tr>
                      <td className="text-center p-2 border">queue</td>
                      <td className="text-center p-2 border">name</td>
                      <td className="text-center p-2 border">uuid</td>
                      <td className="text-center p-2 border">phone</td>
                      <td className="text-center p-2 border">x</td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="text-center p-2 border">1</td>
                      <td className="text-center p-2 border">JUNE NANNIRIN</td>
                      <td className="text-center p-2 border">
                        copy from Profile page or blank
                      </td>
                      <td className="text-center p-2 border">0900000000</td>
                      <td className="text-center p-2 border">@JUNE_NANNIRIN</td>
                    </tr>
                    <tr>
                      <td className="text-center p-2 border">2</td>
                      <td className="text-center p-2 border">
                        JUNE NANNIRIN OFFICIAL
                      </td>
                      <td className="text-center p-2 border">
                        copy from Profile page or blank
                      </td>
                      <td className="text-center p-2 border">0900000000</td>
                      <td className="text-center p-2 border">
                        @Junenannirin_TH
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-4 h-[220px] border-2 border-dashed border-pinkAccent rounded-xl flex items-center justify-center">
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-lg bg-pinkSecondary text-white"
                >
                  Select Excel File
                </button>
              </>
            </div>
          </div>
        )}
      {previewRows.length > 0 && (
        <div className="mt-4">
          <div className="mb-2 text-sm">
            Total: {previewRows.length} participants
          </div>

          <div className="overflow-auto rounded-lg border border-pinkAccent bg-white">
            <table className="w-full text-sm">
              <thead className="bg-pinkAccent/40">
                <tr>
                  <th className="p-2 w-20">Queue</th>
                  <th className="p-2">Name</th>
                  <th className="p-2">Phone</th>
                  <th className="p-2">X</th>
                </tr>
              </thead>

              <tbody>
                {previewRows.slice(0, 10).map((row, index) => (
                  <tr key={index}>
                    <td className="p-2 text-center">{row.queue}</td>
                    <td className="p-2 text-center">{row.name}</td>
                    <td className="p-2 text-center">{row.phone}</td>
                    <td className="p-2 text-center">{row.twitter}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button
              className="px-4 py-2 border rounded-lg"
              onClick={() => setPreviewRows([])}
            >
              Cancel
            </button>

            <button
              onClick={handleImport}
              className="px-4 py-2 bg-pinkSecondary text-white rounded-lg"
            >
              Import
            </button>
          </div>
        </div>
      )}

      {participants.length > 0 && !isImportMode && (
        <div className="w-full flex justify-end">
          <button
            onClick={handleImportNewList}
            className="text-pinkSecondary italic text-sm underline hover:text-textMain transition"
          >
            Import New List
          </button>
        </div>
      )}

      {participants.length > 0 && !isImportMode && (
        <EventParticipantList
          participants={participants}
          onCheckIn={handleCheckIn}
        />
      )}
    </div>
  );
}
