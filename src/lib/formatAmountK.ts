export function formatAmount(value: number): string {
  if (!value) return "0";

  if (value >= 10000) {
    return Math.floor(value / 1000) + "K";
  }

  return value.toLocaleString("en-US");
}