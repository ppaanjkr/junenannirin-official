"use client";

import LoadingOverlay from "@/components/LoadingOverlay";
import Popup from "@/components/ModalPopup";
import SectionBack from "@/components/SectionBack";
import { useUserContext } from "@/context/UserContext";
import useAuthGuard from "@/hooks/useAuthGuard";
import { useProjectDetail } from "@/hooks/useAdmin";
import { useRouter } from "next/navigation";

export default function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const router = useRouter();

  const { loading } = useUserContext();
  const { popup, setPopup } = useAuthGuard();

  const { project, isDetailLoading } = useProjectDetail(id);

  return (
    <>
      {(loading || isDetailLoading) && <LoadingOverlay />}

      <Popup
        open={popup.open}
        type={popup.type}
        message={popup.message}
        onClose={() => setPopup({ ...popup, open: false })}
      />

      <main className="max-w-5xl mx-auto px-6 py-4 md:max-w-3xl lg:max-w-6xl">
        <SectionBack
          onclick={() => router.replace(`/admin/project/${id}`)}
          title={`Edit ${project?.project?.name || "Project"}`}
        />

        {/* เดี๋ยวเอา ProjectForm mode="edit" มาใส่ตรงนี้ */}
        <div className="bg-white border border-pinkAccent rounded-xl p-4 text-sm">
          Edit Project
        </div>
      </main>
    </>
  );
}