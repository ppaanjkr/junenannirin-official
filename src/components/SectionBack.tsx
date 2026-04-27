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
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"
                    strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5M12 19l-7-7 7-7"></path>
                </svg>
            </button>

            <div className="text-lg font-semibold">
                {title}
            </div>
        </section>
    );
}