"use client";
import LoadingOverlay from "@/components/LoadingOverlay";
import Popup from "@/components/ModalPopup";
import SectionEditProfile from "@/components/profile/SectionEditProfile";
import SectionProfile from "@/components/profile/SectionProfile";
import SectionBack from "@/components/SectionBack";
import { useUserContext } from "@/context/UserContext";
import useAuthGuard from "@/hooks/useAuthGuard";
import useProfileSummary from "@/hooks/useProfile";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

export default function Page() {
  const { user, setUser, validateUser } = useUserContext();
  const { profile, isLoading } = useProfileSummary();
  const [loading, setLoading] = useState(false);
  const isloading = loading || isLoading;
  const { popup, setPopup } = useAuthGuard();
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
        <SectionBack onclick={() => router.replace("/")} title={"Profile"} />
        <SectionProfile user={user} profile={profile} />
        <SectionEditProfile
          user={user}
          setUser={setUser}
          setLoading={setLoading}
          setPopup={setPopup}
          validateUser={validateUser}
        />
      </main>
    </>
  );
}
