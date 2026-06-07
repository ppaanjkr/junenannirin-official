"use client";
import LoadingOverlay from "@/components/LoadingOverlay";
import Popup from "@/components/ModalPopup";
import SectionEditProfile from "@/components/profile/SectionEditProfile";
import SectionProfile from "@/components/profile/SectionProfile";
import SectionBack from "@/components/SectionBack";
import { useUserContext } from "@/context/UserContext";
import useAuthGuard from "@/hooks/useAuthGuard";
import useProfileSummary from "@/hooks/useProfile";
import { getProfileSettings } from "@/lib/api/admin";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { getTeam } from "@/lib/api/user";

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

  const [settings, setSettings] = useState({
    profile_edit_enabled: true,
    team_edit_enabled: false,
  });
  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const res = await getProfileSettings();

    if (res.success) {
      setSettings(res.data);
    }
  }

  const [teamOptions, setTeamOptions] = useState<any[]>([]);
  useEffect(() => {
    loadTeams();
  }, []);
  async function loadTeams() {
    const res = await getTeam();

    if (res.success) {
      setTeamOptions(res.data || []);
    }
  }

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
          settings={settings}
          teams={teamOptions}
        />
      </main>
    </>
  );
}
