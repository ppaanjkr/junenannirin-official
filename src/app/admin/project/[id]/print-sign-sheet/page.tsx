"use client";

import { useEffect, useMemo, useState } from "react";

const ROWS_PER_PAGE = 20;

function chunkArray<T>(array: T[], size: number) {
  const result: T[][] = [];

  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }

  return result;
}

export default function Page() {
  const [participants, setParticipants] = useState<any[]>([]);
  const [eventName, setEventName] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem("print_event_participants");

    const event = localStorage.getItem("print_event_name") || "";

    if (raw) {
      setParticipants(JSON.parse(raw));
    }

    setEventName(event);
  }, []);

  const pages = useMemo(() => {
    const sorted = [...participants].sort(
      (a, b) => Number(a.queue) - Number(b.queue),
    );

    return chunkArray(sorted, ROWS_PER_PAGE);
  }, [participants]);

  useEffect(() => {
    if (participants.length === 0) return;

    const timer = setTimeout(() => {
      window.print();
    }, 500);

    return () => clearTimeout(timer);
  }, [participants]);

  return (
    <>
      <main className="print-main">
        {pages.map((pageItems, pageIndex) => (
          <section key={pageIndex} className="print-page">
            {/* Header */}
            <div className="print-header">
              <div className="w-10 h-10"><img src="/icon/june_logo_circle.png" className="rounded-full w-10 h-10 object-contain"/></div>

              <div className="text-center font-semibold text-lg">
                {eventName}
              </div>

              <div className="text-right">Total: {participants.length}</div>
            </div>

            {/* Table */}
            <table className="print-table">
              <thead>
                <tr>
                  <th style={{ width: "12%" }}>No.</th>

                  <th style={{ width: "53%" }}>Name</th>
                  <th style={{ width: "35%" }}>Signature</th>
                </tr>
              </thead>

              <tbody>
                {pageItems.map((item) => (
                  <tr key={item.id}>
                    <td>{item.queue}</td>
                    <td>{item.full_name}</td>
                    <td></td>
                  </tr>
                ))}

                {/* เติมแถวว่างให้ครบ 20 */}
                {Array.from({
                  length: ROWS_PER_PAGE - pageItems.length,
                }).map((_, index) => (
                  <tr key={`empty-${index}`}>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Footer */}
            <div className="print-footer mt-4">
              <span></span>

              <span>Junenannirin Official</span>

              <span>
                {pageIndex + 1}/{pages.length}
              </span>
            </div>
          </section>
        ))}
      </main>

      <style jsx global>{`
        @media screen {
          body {
            background: #f5f5f5;
          }

          .print-main {
            padding: 16px;
          }

          .print-page {
            width: 210mm;
            min-height: 297mm;
            background: white;
            margin: 0 auto 24px;
            padding: 10mm;
            box-sizing: border-box;
            border: 1px solid #ddd;
          }
        }

        @media print {
          @page {
            size: A4 portrait;
            margin: 8mm;
          }

          html,
          body {
            margin: 0;
            padding: 0;
            background: white;
          }

          .print-main {
            margin: 0;
            padding: 0;
          }

          .print-page {
            page-break-after: always;
            break-after: page;
          }

          .print-page:last-child {
            page-break-after: auto;
            break-after: auto;
          }

          .print-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 11px;
            margin-bottom: 10px;
          }

          .print-table {
            width: 100%;
            min-width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
          }

          .print-table th,
          .print-table td {
            border: 1px solid #d1d5db !important;
            padding: 6px 8px;
            font-size: 14px;
          }

          .print-table th {
            text-align: center;
            font-weight: 600;
          }

          .print-table tbody tr {
            height: 11mm;
          }

          .col-no {
            width: 12%;
          }

          .col-name {
            width: 53%;
          }

          .col-sign {
            width: 35%;
          }

          .print-table td:first-child {
            text-align: center;
          }

          .print-footer {
            margin-top: 8px;
            display: flex;
            justify-content: space-between;
            font-size: 10px;
          }

          .print-table {
            border: 2px solid #d1d5db;
          }
        }
      `}</style>
    </>
  );
}
