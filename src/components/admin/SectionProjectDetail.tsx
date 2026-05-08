import { Project } from "@/lib/api/types";
import ProjectDetailFooter from "./project/ProjectDetailFooter";
import ProjectBasicDetail from "./project/ProjectBasicDetail";
import ProjectImageMore from "./project/ProjectImageMore";
import ProjectShopItem from "./project/ProjectShopItem";

type Props = {
    project?: Project | null;
    shop?: any | null;
    donation?: any | null;
};
export default function SectionProjectDetail({ project, shop, donation }: Props) {
    return (
        <section className="mt-2">
            <ProjectBasicDetail project={project} />
            <ProjectImageMore project={project} />
            {shop && <ProjectShopItem items={shop} />}
            {/* <ProjectDetailFooter /> */}
        </section>
    );
}