import { Participant } from "@/types/event";
import { useState } from "react";
import EventCard from "./EventCard";
import { QrCode } from "lucide-react";
import EventTable from "./EventTable";

type Props = {
  participants: Participant[];
   onCheckIn: (
    participant: any,
  ) => void;
};

export default function EventParticipantList({ participants, onCheckIn }: Props) {
  const [search, setSearch] = useState("");
  const filtered = participants.filter((item) => {
    const keyword = search.toLowerCase();

    return (
      String(item.full_name || "")
        .toLowerCase()
        .includes(keyword) ||
      String(item.username || "")
        .toLowerCase()
        .includes(keyword) ||
      String(item.phone || "")
        .toLowerCase()
        .includes(keyword) ||
      String(item.twitter || "")
        .toLowerCase()
        .includes(keyword) ||
      String(item.queue || "").includes(keyword)
    );
  });
  return (
    <div className="mt-4">
      <div className="bg-white rounded-lg p-4 shadow-soft border border-pinkAccent">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <h2 className="font-semibold flex items-center gap-2">
            <span className="w-1.5 h-4 bg-pinkSecondary rounded-full"></span>
            Participants
          </h2>

          <div className="flex items-center gap-2 w-full md:w-auto">
            {/* search */}
            <input
              type="text"
              placeholder="Search..."
              className="text-sm flex-1 md:w-[280px] border border-pinkAccent rounded-lg px-4 py-2 outline-none"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
          </div>
        </div>
        {/* MOBILE */}
        <div className="mt-4 grid grid-cols-1 gap-3 md:hidden">
          {/* scan */}
          {/* <button className="text-xs px-4 py-2 bg-white border border-pinkSecondary text-pinkSecondary rounded-lg w-full flex items-center justify-center gap-2">
            <QrCode className="w-4 h-4" /> Scan QR-Code
          </button> */}
          {filtered.map((item: any) => (
            <EventCard key={item.id} item={item} onCheckIn={onCheckIn}/>
          ))}
        </div>

        {/* DESKTOP */}
        <div className="hidden md:block mt-4">
          <EventTable data={filtered} onCheckIn={onCheckIn}/>
        </div>
      </div>
    </div>
  );
}
