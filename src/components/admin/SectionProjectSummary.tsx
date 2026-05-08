import ShopItemSummary from "./summary/ShopItemSummary";
import SummaryDetail from "./summary/SummaryDetail";

type Props = {
    summary: any
    shop: any
    donation: any
};
export default function SectionProjectSummary({ summary, shop, donation }: Props) {
    return (
        <section className="mt-2 mb-12">
            <SummaryDetail summary={summary} />
            {shop && <ShopItemSummary shop={shop} />}
            {/* {donation && <SummaryDetail summary={donation} />} */}
        </section>
    );
}