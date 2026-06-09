"use client";

import { useRouter } from "next/navigation";
import ProjectDetailFooter from "./project/ProjectDetailFooter";
import ShopItemSummary from "./summary/ShopItemSummary";
import ShopOrderList from "./summary/ShopOrderList";
import SummaryDetail from "./summary/SummaryDetail";
import { closeProject, updateProjectSubStatus } from "@/lib/api/admin";
import { useOrderList } from "@/hooks/useAdmin";

type Props = {
  summary: any;
  shop: any;
  donation: any;
  projectId: string;
  // orders: any;
  project?: any;
  user?: any;
};

export default function SectionProjectSummary({
  summary,
  shop,
  donation,
  projectId,
  // orders,
  project,
  user
}: Props) {
  const router = useRouter();

  const { orders, isOrderLoading } = useOrderList(projectId.toString());

  return (
    <section className="mt-2 mb-12">
      <SummaryDetail summary={summary} />

      {shop && <ShopItemSummary shop={shop} />}
      {shop && <ShopOrderList projectId={projectId} orders={orders} />}

      {/* {donation && <SummaryDetail summary={donation} />} */}

      <ProjectDetailFooter
        project={project}
        onEdit={() => {
          if (!project?.id) return;
          router.push(`/admin/project/${project.id}/edit`);
        }}
        onCloseProject={async () => {
          if (!project?.id) return;

          const res = await closeProject({
            project_id: project.id,
            updated_by: user?.uuid || "",
          });

          if (res.success) {
            router.refresh();
          } else {
            alert(res.message || "Close project failed");
          }
        }}
        onChangeSubStatus={async (subStatus) => {
          if (!project?.id) return;

          const res = await updateProjectSubStatus({
            project_id: project.id,
            sub_status: subStatus,
            updated_by: user?.uuid || "",
          });

          if (res.success) {
            router.refresh();
          } else {
            alert(res.message || "Update sub status failed");
          }
        }}
      />
    </section>
  );
}
