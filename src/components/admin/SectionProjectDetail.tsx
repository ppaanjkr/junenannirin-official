import { Project } from "@/lib/api/types";
import ProjectDetailFooter from "./project/ProjectDetailFooter";
import ProjectBasicDetail from "./project/ProjectBasicDetail";
import ProjectImageMore from "./project/ProjectImageMore";
import ProjectShopItem from "./project/ProjectShopItem";
import { useRouter } from "next/navigation";

type Props = {
  project?: Project | null;
  shop?: any | null;
  donation?: any | null;
  projectId?: string;
};

export default function SectionProjectDetail({
  project,
  shop,
  donation,
  projectId,
}: Props) {
  const router = useRouter();

  const id = projectId || project?.id || "";

  return (
    <section className="mt-2">
      <ProjectBasicDetail project={project} />
      <ProjectImageMore project={project} />

      {shop && <ProjectShopItem items={shop} />}

      <ProjectDetailFooter
        onClose={() => router.replace("/admin")}
        onEdit={() => {
          if (!id) return;
          router.push(`/admin/project/${id}/edit`);
        }}
      />
    </section>
  );
}