import { Project } from "@/lib/api/types";
import ProjectDetailFooter from "./project/ProjectDetailFooter";
import ProjectBasicDetail from "./project/ProjectBasicDetail";

type Props = {
    project?: Project | null;
};
export default function SectionProjectDetail({ project }: Props) {
    return (
        <section className="mt-2">
            <ProjectBasicDetail project={project} />
            <ProjectDetailFooter />
        </section>
    );
}