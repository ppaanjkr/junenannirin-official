"use client";

import SectionProjectDetail from "@/components/admin/SectionProjectDetail";
import SectionProjectSummary from "@/components/admin/SectionProjectSummary";
import TabAdmin from "@/components/admin/TabAdmin";
import LoadingOverlay from "@/components/LoadingOverlay";
import Popup from "@/components/ModalPopup";
import SectionBack from "@/components/SectionBack";
import { useUserContext } from "@/context/UserContext";
import { useProjectDetail } from "@/hooks/useAdmin";
import useAuthGuard from "@/hooks/useAuthGuard";
import { Span } from "next/dist/trace";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

export default function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const router = useRouter();
  const { user, loading } = useUserContext();

  const { project, isDetailLoading } = useProjectDetail(id);
  const title = project?.project?.name || "-";
  const type = project?.project?.type || "";

  const [tab, setTab] = useState("summary");

  const { popup, setPopup } = useAuthGuard();
  return (
    <>
      {(isDetailLoading || loading) && <LoadingOverlay />}
      <Popup
        open={popup.open}
        type={popup.type}
        message={popup.message}
        onClose={() => setPopup({ ...popup, open: false })}
      />
      <main className="max-w-5xl mx-auto px-6 py-4 md:max-w-3xl">
        <SectionBack onclick={() => router.replace("/admin")} title={title} />
        <TabAdmin type="shop" tab={tab} setTab={setTab} />
        {tab === "summary" && (
          <SectionProjectSummary
            summary={project?.summary}
            shop={project?.shop}
            donation={project?.donation}
            projectId={project?.project?.id}
          />
        )}

        {tab === "project" && (
          <SectionProjectDetail project={project?.project} shop={project?.shop?.rewardSummary}/>
        )}
      </main>
    </>
  );
}
