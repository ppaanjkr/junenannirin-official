import { Check, UserRound, X } from "lucide-react";

type Props = {
    totalParticipants: number;
    checkedIn: number;
    absent: number;
    checkinRate: number;
};

export default function EventSummary({ totalParticipants, checkedIn, absent, checkinRate }: Props) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
        <div className="bg-white border border-pinkAccent rounded-xl p-4">
          <div className="text-textSub flex items-center gap-2"><UserRound className="w-4 h-4" /> Total</div>

          <div className="text-2xl font-bold mt-2">
            {totalParticipants > 0  ? totalParticipants : "-"}
          </div>
        </div>

        <div className="bg-white border border-pinkAccent rounded-xl p-4">
          <div className="text-textSub flex items-center gap-2"><Check className="w-4 h-4 text-green-600" /> Checked-in</div>

          <div className="text-2xl font-bold mt-2">
            {totalParticipants ? checkedIn : "-"}
          </div>
        </div>

        <div className="bg-white border border-pinkAccent rounded-xl p-4">
          <div className="text-textSub flex items-center gap-2"><X className="w-4 h-4 text-red-600" />Absent</div>

          <div className="text-2xl font-bold mt-2">
            {totalParticipants ? absent : "-"}
          </div>
        </div>

        <div className="bg-pinkAccent rounded-xl p-4">
          <div className="text-xs">Check-in Rate</div>

          <div className="text-2xl font-bold mt-2">
            {totalParticipants ? `${checkinRate}%` : "-"}
          </div>
        </div>
      </div>
    );
}