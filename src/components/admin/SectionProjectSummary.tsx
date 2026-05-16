import ShopItemSummary from "./summary/ShopItemSummary";
import ShopOrderList from "./summary/ShopOrderList";
import SummaryDetail from "./summary/SummaryDetail";

type Props = {
    summary: any
    shop: any
    donation: any
    projectId: string,
    orders: any
};
export default function SectionProjectSummary({ summary, shop, donation, projectId, orders }: Props) {
    return (
        <section className="mt-2 mb-12">
            <SummaryDetail summary={summary} />
            {shop && <ShopItemSummary shop={shop} />}
            {shop && <ShopOrderList projectId={projectId} orders={orders} />}
            {/* {donation && <SummaryDetail summary={donation} />} */}
        </section>
    );
}