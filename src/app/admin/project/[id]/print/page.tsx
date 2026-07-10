"use client";

import { useEffect, useMemo, useState } from "react";
import { buildItemSummary } from "@/lib/buildItemSummary";

const LABELS_PER_PAGE = 6;

function chunkArray<T>(array: T[], size: number) {
  const result: T[][] = [];

  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }

  return result;
}

function buildOrderText(orders: any[] = []) {
  return orders.map((order) => {
    const items = (order.items || [])
      .map((item: any) => `${item.title} x${item.qty}`)
      .join(", ");

    return `• ${order.order_id} : ${items}`;
  });
}

export default function Page() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem("print_labels");

    if (raw) {
      setOrders(JSON.parse(raw));
    }
  }, []);

  const pages = useMemo(() => {
    return chunkArray(orders, LABELS_PER_PAGE);
  }, [orders]);

  useEffect(() => {
    if (orders.length === 0) return;

    const timer = setTimeout(() => {
      window.print();
    }, 500);

    return () => clearTimeout(timer);
  }, [orders]);

  return (
    <>
      <main className="bg-white min-h-screen print-main">
        {pages.map((pageItems, pageIndex) => (
          <section key={pageIndex} className="print-page">
            <div className="label-grid">
              {pageItems.map((item, index) => {
                const summary = buildItemSummary(item.orders || []);

                const orderLines = buildOrderText(item.orders || []);

                return (
                  <div
                    key={`${item.user.uuid}_${pageIndex}_${index}`}
                    className="label-card"
                  >
                    <div className="text-base font-semibold">
                      Name: {item.user.name ?? "-"}
                    </div>

                    <div className="mt-1 text-base">
                      Tel: {item.user.phone ?? "-"}
                    </div>

                    <div className="mt-1 whitespace-pre-wrap text-base leading-6 address-text">
                      Address: {item.user.address ?? "-"}
                    </div>

                    {/* Summary */}
                    <div className="mt-2 text-xs">
                      <span className="font-semibold">Summary:</span>

                      <div className="leading-5">
                        {summary
                          .map((detail) => {
                            const hasOption =
                              String(detail.option_name || "").trim() !== "" &&
                              String(detail.selected_option || "").trim() !==
                                "";

                            return `${detail.item_name}${
                              hasOption
                                ? ` (${detail.option_name} ${detail.selected_option})`
                                : ""
                            } x${detail.qty}`;
                          })
                          .join(", ")}
                      </div>
                    </div>

                    {/* Order */}
                    <div className="mt-1 text-xs">
                      <span className="font-semibold">Order:</span>

                      <div className="flex flex-col gap-1">
                        {orderLines.map((line, i) => (
                          <div key={i}>{line}</div>
                        ))}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </main>

      <style jsx global>{`
        @media screen {
          .print-main {
            padding: 16px;
          }

          .print-page {
            background: white;
            margin: 0 auto 24px auto;
            width: 210mm;
            min-height: 297mm;
            border: 1px solid #e5e7eb;
          }
        }

        @media print {
          @page {
            size: A4 portrait;
            margin: 10mm;
          }

          html,
          body {
            margin: 0;
            padding: 0;
            background: white;
          }

          .print-main {
            padding: 0 !important;
            margin: 0 !important;
            background: white !important;
          }

          .print-page {
            width: 100%;
            height: calc(297mm - 20mm);
            page-break-after: always;
            break-after: page;

            display: flex;
            flex-direction: column;
            box-sizing: border-box;
          }

          .print-page:last-child {
            page-break-after: auto;
            break-after: auto;
          }

          .print-header {
            height: 10mm;
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            align-items: center;
            font-size: 10px;
          }

          .print-header span:nth-child(2) {
            text-align: center;
            font-weight: 600;
          }

          .label-grid {
            flex: 1;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            grid-template-rows: repeat(3, 1fr);
            border-top: 1px solid #e5e7eb;
            border-left: 1px solid #e5e7eb;
          }

          .label-card {
            border-right: 1px solid #e5e7eb;
            border-bottom: 1px solid #e5e7eb;
            padding: 10px 12px;
            box-sizing: border-box;

            overflow: hidden;
            break-inside: avoid;
            page-break-inside: avoid;

            display: flex;
            flex-direction: column;
            justify-content: flex-start;
          }

          .address-text {
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 5;
            -webkit-box-orient: vertical;
          }
        }
      `}</style>
    </>
  );
}
