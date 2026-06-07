"use client";

import ConfirmPopup from "@/components/ConfirmPopup";
import LoadingOverlay from "@/components/LoadingOverlay";
import Popup from "@/components/ModalPopup";
import SectionBack from "@/components/SectionBack";
import SectionSystemSetting from "@/components/setting/profile/SectionSystemSetting";
import SectionTeamManagement from "@/components/setting/profile/SectionTeamManagement";
import TeamFormModal from "@/components/setting/profile/TeamFormModal";
import { useUserList } from "@/hooks/useAdmin";
import {
  createAdminTeam,
  deleteAdminTeam,
  getAdminTeams,
  getProfileSettings,
  updateAdminTeam,
} from "@/lib/api/admin";
import { defaultTeamForm } from "@/types/team";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const router = useRouter();

  const { users, isUserLoading } = useUserList();


  const [popupOpen, setPopupOpen] = useState(false);
  const [popupType, setPopupType] = useState("success");
  const [popupMessage, setPopupMessage] = useState("");

  const [teamModalOpen, setTeamModalOpen] = useState(false);
  const [teamMode, setTeamMode] = useState<"create" | "edit">("create");
  const [teamLoading, setTeamLoading] = useState(false);
  const [teamForm, setTeamForm] = useState(defaultTeamForm);
  const [deleteTeam, setDeleteTeam] = useState<any>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [settings, setSettings] = useState({
    profile_edit_enabled: true,
    team_edit_enabled: false,
  });
  const [teams, settingTeams] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const [profile, teamApi] = await Promise.all([
      getProfileSettings(),
      getAdminTeams(),
    ]);

    if (profile.success) {
      setSettings(profile.data);
    }

    if (teamApi.success) {
      settingTeams(teamApi.data);
    }
  }
  async function loadTeams() {
    const res = await getAdminTeams();

    if (res.success) {
      settingTeams(res.data || []);
    }
  }

  function showPopup(type: string, message: string) {
    setPopupType(type);
    setPopupMessage(message);
    setPopupOpen(true);

    setTimeout(() => {
      setPopupOpen(false);
    }, 1500);
  }

  function handleOpenCreate() {
    setTeamMode("create");
    setTeamForm(defaultTeamForm);
    setTeamModalOpen(true);
  }

  function handleOpenEdit(team: any) {
    setTeamMode("edit");

    setTeamForm({
      id: team.id,
      value: team.value || "",
      label: team.label || "",
      image_url: team.image_url || "",
      image_file: null,
      image_delete_url: "",
      show_in_register: Boolean(team.show_in_register),
      active: Number(team.active) === 1,
    });

    setTeamModalOpen(true);
  }

  async function handleSaveTeam() {
    try {
      if (!teamForm.label.trim()) return;

      setTeamLoading(true);

      const payload = {
        team: teamForm,
      };

      const res =
        teamMode === "create"
          ? await createAdminTeam(payload)
          : await updateAdminTeam(payload);

      if (!res.success) {
        showPopup("error", res.message || "Save failed");

        return;
      }

      setTeamModalOpen(false);

      showPopup(
        "success",
        teamMode === "create" ? "Team created" : "Team updated",
      );

      await loadTeams();

      await loadTeams();
    } catch (err: any) {
      showPopup("error", err?.message || "Save failed");
    } finally {
      setTeamLoading(false);
    }
  }

  function handleDeleteClick(team: any) {
    setDeleteTeam(team);
    setDeleteOpen(true);
  }
  async function handleDeleteTeam() {
    if (!deleteTeam) return;

    try {
      setTeamLoading(true);

      const res = await deleteAdminTeam(deleteTeam.id);

      if (!res.success) {
        showPopup("error", res.message || "Delete failed");

        return;
      }

      showPopup("success", "Team deleted successfully");

      await loadTeams();
    } catch (err: any) {
      showPopup("error", err?.message || "Delete failed");
    } finally {
      setDeleteOpen(false);
      setDeleteTeam(null);
      setTeamLoading(false);
    }
  }

  return (
    <main className="max-w-5xl mx-auto px-6 py-4 md:max-w-3xl lg:max-w-6xl">
      {(isUserLoading || teamLoading) && <LoadingOverlay />}

      <SectionBack
        onclick={() => router.replace("/admin/setting")}
        title={"Setting Editable Profile & Teams"}
      />

      <SectionSystemSetting settings={settings} setSetting={setSettings} />

      <SectionTeamManagement
        teams={teams}
        onCreate={handleOpenCreate}
        onEdit={handleOpenEdit}
        onDelete={handleDeleteClick}
      />
      <TeamFormModal
        open={teamModalOpen}
        mode={teamMode}
        form={teamForm}
        setForm={setTeamForm}
        loading={teamLoading}
        onClose={() => setTeamModalOpen(false)}
        onSave={handleSaveTeam}
      />

      <ConfirmPopup
        open={deleteOpen}
        title={`Delete "${deleteTeam?.label || ""}" ?`}
        confirmText="Delete"
        cancelText="Cancel"
        onCancel={() => {
          setDeleteOpen(false);
          setDeleteTeam(null);
        }}
        onConfirm={handleDeleteTeam}
      />
      <Popup
        open={popupOpen}
        type={popupType}
        message={popupMessage}
        onClose={() => setPopupOpen(false)}
      />
    </main>
  );
}
