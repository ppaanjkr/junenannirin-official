import { Project } from "@/lib/api/types";

type Props = {
    project?: Project | null;
};
export default function SectionProjectDetail({ project }: Props) {
    console.log(project);
    return (
        <section className="mt-2">Detail</section>
    );
}