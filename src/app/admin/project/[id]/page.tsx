"use client";

import SectionProjectDetail from "@/components/admin/SectionProjectDetail";
import SectionProjectSummary from "@/components/admin/SectionProjectSummary";
import TabAdmin from "@/components/admin/TabAdmin";
import LoadingOverlay from "@/components/LoadingOverlay";
import Popup from "@/components/ModalPopup";
import SectionBack from "@/components/SectionBack";
import { useUserContext } from "@/context/UserContext";
import { useOrderList, useProjectDetail } from "@/hooks/useAdmin";
import useAuthGuard from "@/hooks/useAuthGuard";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page({ params }: { params: { id: string } }) {

  const id = params.id;
  const router = useRouter();
  const { user, loading } = useUserContext();

  const { project, isDetailLoading } = useProjectDetail(id);

  const title = project?.project?.name || "-";

  const [tab, setTab] = useState("summary");

  const { popup, setPopup } = useAuthGuard();

  const { orders, isOrderLoading } = useOrderList(id.toString());

  return (
    <>
      {(isDetailLoading || loading || isOrderLoading) && <LoadingOverlay />}

      <Popup
        open={popup.open}
        type={popup.type}
        message={popup.message}
        onClose={() => setPopup({ ...popup, open: false })}
      />

      <main className="max-w-5xl mx-auto px-6 py-4 md:max-w-3xl lg:max-w-6xl pb-24">
        <SectionBack
          onclick={() => router.replace("/admin")}
          title={title}
          action={() => router.push(`/admin/project/${id}/preview`)}
          actionText="Preview"
        />

        <TabAdmin type="shop" tab={tab} setTab={setTab} />

        {tab === "summary" && (
          <SectionProjectSummary
            summary={project?.summary}
            shop={project?.shop}
            donation={project?.donation}
            projectId={project?.project?.id ?? ""}
            orders={orders}
            project={project?.project}
            user={user}
          />
        )}

        {tab === "project" && (
          <SectionProjectDetail
            project={project?.project}
            shop={project?.shop?.rewardSummary}
            donation={project?.donation}
            projectId={id}
            user={user}
          />
        )}
      </main>
    </>
  );
}