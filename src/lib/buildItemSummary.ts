function formatOption(option: string) {
  return String(option || "").trim().toUpperCase();
}

const optionOrder = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "2XL",
  "3XL",
];

export function buildItemSummary(orders: any[] = []) {
  const summaryMap: Record<
    string,
    {
      item_name: string;
      option_name: string;
      selected_option: string;
      qty: number;
    }
  > = {};

  orders.forEach((order) => {
    (order.items || []).forEach((item: any) => {
      (item.details || []).forEach((detail: any) => {
        const itemName = String(detail.item_name || "").trim();

        const optionName = String(
          detail.option_name ||
            (detail.selected_size ? "size" : ""),
        ).trim();

        const selectedOption = formatOption(
          detail.selected_option || detail.selected_size,
        );

        if (!itemName) return;

        const key = [
          itemName,
          optionName || "no_option",
          selectedOption || "no_value",
        ].join("_");

        if (!summaryMap[key]) {
          summaryMap[key] = {
            item_name: itemName,
            option_name: optionName,
            selected_option: selectedOption,
            qty: 0,
          };
        }

        summaryMap[key].qty += Number(detail.qty || 0);
      });
    });
  });

  return Object.values(summaryMap).sort((a, b) => {
    const nameCompare = a.item_name.localeCompare(b.item_name);

    if (nameCompare !== 0) return nameCompare;

    const aIndex = optionOrder.indexOf(a.selected_option);
    const bIndex = optionOrder.indexOf(b.selected_option);

    if (aIndex === -1 && bIndex === -1) {
      return a.selected_option.localeCompare(
        b.selected_option,
      );
    }

    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;

    return aIndex - bIndex;
  });
}