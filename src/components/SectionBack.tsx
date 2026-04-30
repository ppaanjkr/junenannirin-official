import { ArrowLeft } from "lucide-react";

type Props = {
    title: string,
    onclick?: () => void
}

export default function SectionBack({ title, onclick}: Props) {
    return (
        <section className="flex items-center gap-3 mt-1 mb-3">
            <button 
                onClick={onclick}
                className="w-10 h-10 rounded-xl border border-secondary/20 bg-white grid place-items-center text-text-main hover:bg-primary/10 transition">
                <ArrowLeft className="w-4 h-4 text-textMain"/>
            </button>

            <div className="text-lg font-semibold">
                {title}
            </div>
        </section>
    );
}