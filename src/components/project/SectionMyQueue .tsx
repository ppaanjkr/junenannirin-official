"use client";

import { useEffect, useState } from "react";
import { getMyQueue } from "@/lib/api/user";
import { CircleCheck, Phone, Ticket, UserRound } from "lucide-react";
import { formatFirestoreTimestamp } from "@/lib/workUtils";

type Props = {
  projectId: string;
  theme: any;
};

export default function SectionMyQueue({ projectId, theme }: Props) {
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState<any>(null);

  useEffect(() => {
    loadQueue();
  }, [projectId]);

  async function loadQueue() {
    try {
      setLoading(true);

      const res = await getMyQueue(projectId);

      if (res.success) {
        setData(res);
      }
    } finally {
      setLoading(false);
    }
  }

  if (loading) return null;

  if (!data?.has_permission) return null;

  const participant = data.participant;

  return (
    <section className="mt-4">
      {data.participant.queue > 0 && (
        <div
          className="rounded-lg overflow-hidden shadow-sm border"
          style={{
            backgroundColor: `${theme.accent}30`,
            borderColor: `${theme.secondary}33`,
          }}
        >
          <div className="grid grid-cols-12">
            <div
              className="col-span-12 min-h-[100px] flex flex-col justify-center items-center gap-2 p-4"
              style={{
                backgroundColor: `${theme.accent}80`,
              }}
            >
              <span
                className="flex justify-center items-center text-xs gap-2 rounded-full bg-white px-2 py-1 w-[100px]"
                style={{
                  color: `${theme.secondary}`,
                }}
              >
                <Ticket className="w-4 h-4" />
                My Queue
              </span>
              <span
                className="font-semibold text-6xl "
                style={{
                  color: `${theme.secondary}`,
                }}
              >
                {data.participant.queue}
              </span>
            </div>
            <div className="col-span-12 grid grid-cols-12">
              <div
                className="col-span-6 border-r border-b"
                style={{
                  borderRightColor: `${theme.accent}`,
                  borderBottomColor: `${theme.accent}`,
                }}
              >
                <div className="p-2 flex flex-col">
                  <span
                    className="flex gap-2  text-sm"
                    style={{
                      color: `${theme.secondary}`,
                    }}
                  >
                    Name
                  </span>
                  <span className="font-semibold">
                    {data.participant.full_name ?? "-"}
                  </span>
                </div>
              </div>
              <div
                className="col-span-6 border-b"
                style={{
                  borderBottomColor: `${theme.accent}`,
                }}
              >
                <div className="p-2 flex flex-col">
                  <span
                    className="flex gap-2  text-sm"
                    style={{
                      color: `${theme.secondary}`,
                    }}
                  >
                    Phone
                  </span>
                  <span className="font-semibold">
                    {data.participant.phone != ""
                      ? data.participant.phone
                      : "-"}
                  </span>
                </div>
              </div>
              <div
                className="col-span-6 border-r border-b"
                style={{
                  borderRightColor: `${theme.accent}`,
                  borderBottomColor: `${theme.accent}`,
                }}
              >
                <div className="p-2 flex flex-col">
                  <span
                    className="flex gap-2  text-sm"
                    style={{
                      color: `${theme.secondary}`,
                    }}
                  >
                    Twitter
                  </span>
                  <span className="font-semibold">
                    {data.participant.twitter != ""
                      ? data.participant.twitter
                      : "-"}
                  </span>
                </div>
              </div>
              <div
                className="col-span-6 border-b"
                style={{
                  borderBottomColor: `${theme.accent}`,
                }}
              >
                <div className="p-2 flex flex-col">
                  <span
                    className="flex gap-2  text-sm"
                    style={{
                      color: `${theme.secondary}`,
                    }}
                  >
                    Check-in
                  </span>
                  <span className="font-semibold">
                    {data.participant.checked_in
                      ? formatFirestoreTimestamp(data.participant.checked_in_at)
                      : "Waiting for check-in"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
