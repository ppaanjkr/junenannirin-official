"use client";

import { useEffect, useState } from "react";
import ConfirmPopup from "@/components/ConfirmPopup";

type Props = {
  onClose?: () => void;
  onEdit?: () => void;
  onCloseProject?: () => void;
  onChangeSubStatus?: (subStatus: string) => void;
  project?: any;
};

const subStatusOptions = [
  { label: "Pre-order", value: "pre-order" },
  { label: "Process", value: "process" },
  { label: "Shipping", value: "shipping" },
  { label: "Completed", value: "completed" },
];

export default function ProjectDetailFooter({
  onEdit,
  onCloseProject,
  onChangeSubStatus,
  project,
}: Props) {
  const [selectedSubStatus, setSelectedSubStatus] = useState(
    project?.sub_status || "",
  );

  const [pendingSubStatus, setPendingSubStatus] = useState("");
  const [confirmType, setConfirmType] = useState<
    null | "closeProject" | "changeSubStatus"
  >(null);

  useEffect(() => {
    setSelectedSubStatus(project?.sub_status || "");
  }, [project?.sub_status]);

  const isClosed = project?.status === "close";
  const isShop = project?.type === "shop";

  function handleSelectSubStatus(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;

    if (!value || value === project?.sub_status) return;

    setPendingSubStatus(value);
    setConfirmType("changeSubStatus");
  }

  function handleCancel() {
    setPendingSubStatus("");
    setConfirmType(null);
    setSelectedSubStatus(project?.sub_status || "");
  }

  function handleConfirm() {
    if (confirmType === "closeProject") {
      onCloseProject?.();
    }

    if (confirmType === "changeSubStatus") {
      setSelectedSubStatus(pendingSubStatus);
      onChangeSubStatus?.(pendingSubStatus);
    }

    setPendingSubStatus("");
    setConfirmType(null);
  }

  return (
    <>
      <ConfirmPopup
        open={confirmType !== null}
        title={
          confirmType === "closeProject"
            ? "Close Project?"
            : "Change Item Status?"
        }
        confirmText={
          confirmType === "closeProject" ? "Close Project" : "Confirm"
        }
        cancelText="Cancel"
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      />

      <div className="fixed bottom-0 left-0 w-full bg-white border-t shadow-lg px-4 py-3 z-40">
        <div className="max-w-5xl mx-auto flex justify-end items-center gap-3 md:max-w-3xl lg:max-w-6xl">
          {!isClosed && isShop && (
            <select
              value={selectedSubStatus}
              onChange={handleSelectSubStatus}
              className="text-pinkSecondary bg-white px-5 py-2 rounded-xl font-semibold border border-pinkSecondary text-sm outline-none"
            >
              {/* <option value="">Sub status</option> */}
              {subStatusOptions.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          )}

          {!isClosed && (
            <button
              type="button"
              onClick={() => setConfirmType("closeProject")}
              className="text-pinkSecondary bg-white px-5 py-2 rounded-xl font-semibold border border-pinkSecondary text-sm"
            >
              Close Project
            </button>
          )}

          {!isClosed && (
            <button
              type="button"
              onClick={onEdit}
              className="text-white bg-pinkSecondary px-5 py-2 rounded-xl font-semibold border border-pinkSecondary text-sm"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </>
  );
}