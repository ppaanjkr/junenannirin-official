import { Project } from "@/lib/api/types";
import ProjectDetailFooter from "./project/ProjectDetailFooter";
import ProjectBasicDetail from "./project/ProjectBasicDetail";
import ProjectImageMore from "./project/ProjectImageMore";
import ProjectShopItem from "./project/ProjectShopItem";
import { useRouter } from "next/navigation";
import { closeProject, updateProjectSubStatus } from "@/lib/api/admin";
import ProjectLocationDetail from "./project/ProjectLocationDetail";

type Props = {
  project?: Project | null;
  shop?: any | null;
  donation?: any | null;
  projectId?: string;
  user?: any;
};

export default function SectionProjectDetail({
  project,
  shop,
  donation,
  projectId,
  user
}: Props) {
  const router = useRouter();

  const id = projectId || project?.id || "";

  return (
    <section className="mt-2">
      <ProjectBasicDetail project={project} />
      {(project?.img_more && project?.img_more.length > 0) && <ProjectImageMore project={project} />}

      {project?.type === "event" && <ProjectLocationDetail project={project} />}

      {shop && <ProjectShopItem items={shop} />}

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
