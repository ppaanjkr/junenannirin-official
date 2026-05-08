"use client";

import SectionAdminProject from "@/components/admin/SectionAdminProject";
import SectionSummary from "@/components/admin/SectionSummary";
import LoadingOverlay from "@/components/LoadingOverlay";
import Popup from "@/components/ModalPopup";
import { useUserContext } from "@/context/UserContext";
import useProjectList from "@/hooks/useAdmin";
import useAuthGuard from "@/hooks/useAuthGuard";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const { user, loading } = useUserContext();
  const { projects, isProjectLoading } = useProjectList();

  const { popup, setPopup } = useAuthGuard();
  return (
    <>
      {(isProjectLoading || loading) && <LoadingOverlay />}
      <Popup
        open={popup.open}
        type={popup.type}
        message={popup.message}
        onClose={() => setPopup({ ...popup, open: false })}
      />
      <main className="max-w-5xl mx-auto px-6 py-4 md:max-w-3xl">
        <SectionSummary projects={projects} />
        <button 
          onClick={() => router.replace("/admin/project/create")}
          className="mt-4 px-4 py-2 bg-pinkSecondary/80 text-white rounded-lg w-full flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> Create Project
          </button>
        <SectionAdminProject projects={projects} />
      </main>
    </>
  );
}
