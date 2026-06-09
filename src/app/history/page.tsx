"use client";
import SectionHistoryDonation from "@/components/history/HistoryDonation";
import SectionHistoryEvent from "@/components/history/HistoryEvent";
import SectionHistoryShop from "@/components/history/HistoryShop";
import TabButton from "@/components/history/TabButton";
import LoadingOverlay from "@/components/LoadingOverlay";
import Popup from "@/components/ModalPopup";
import SectionBack from "@/components/SectionBack";
import { useUserContext } from "@/context/UserContext";
import useAuthGuard from "@/hooks/useAuthGuard";
import { useProfileHistory } from "@/hooks/useProfile";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

export default function Page() {
  const { user, setUser } = useUserContext();
  const { shop, donation, event, isLoading } = useProfileHistory();
  const [loading, setLoading] = useState(false);
  const isloading = loading || isLoading;
  const { popup, setPopup } = useAuthGuard();
  const [tab, setTab] = useState("shop");
  const router = useRouter();
  useEffect(() => {
    if (!user) {
      router.replace("/");
    }
  }, [user]);

  return (
    <>
      <Popup
        open={popup.open}
        type={popup.type}
        message={popup.message}
        onClose={() => setPopup({ ...popup, open: false })}
      />
      <main className="max-w-5xl mx-auto px-6 py-4 md:max-w-3xl">
        {isloading && <LoadingOverlay />}
        <SectionBack onclick={() => router.replace("/")} title={"History"} />
        <section className="flex gap-4 mt-2 border border-pinkAccent rounded-lg p-1 mb-4">
          <TabButton title={"Shop"} setTab={setTab} active={tab === "shop"} />
          <TabButton
            title={"Donate"}
            setTab={setTab}
            active={tab === "donate"}
          />
          <TabButton title={"Event"} setTab={setTab} active={tab === "event"} />
        </section>
        {tab === "shop" && <SectionHistoryShop data={shop} />}

        {tab === "donate" && <SectionHistoryDonation data={donation} />}

        {tab === "event" && <SectionHistoryEvent data={event} />}
      </main>
    </>
  );
}
