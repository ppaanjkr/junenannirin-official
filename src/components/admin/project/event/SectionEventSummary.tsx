import { ImportRow, Participant } from "@/types/event";
import EventImport from "./EventImport";
import EventSummary from "./EventSummary";
import { useEffect, useState } from "react";
import { useEventParticipants } from "@/hooks/useAdmin";

type Prop = {
  projectId: string;
};
export default function SectionEventSummary({ projectId }: Prop) {
  const { participants, isLoading } = useEventParticipants(projectId);

  const [participantData, setParticipantData] = useState<Participant[]>([]);
  useEffect(() => {
    setParticipantData(participants);
  }, [participants]);

  const totalParticipants = participantData.length;

  const checkedIn = participantData.filter((x) => x.checked_in).length;

  const absent = totalParticipants - checkedIn;

  const checkinRate =
    totalParticipants > 0
      ? Math.round((checkedIn / totalParticipants) * 100)
      : 0;
  return (
    <section className="mt-4 space-y-4">
      <EventSummary
        totalParticipants={totalParticipants}
        checkedIn={checkedIn}
        absent={absent}
        checkinRate={checkinRate}
      />
      <EventImport
        projectId={projectId}
        participants={participantData}
        setParticipants={setParticipantData}
      />
    </section>
  );
}
