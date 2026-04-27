export function formatTHB(amount: string | number) {
  const num = Number(amount || 0);

  return num.toLocaleString("th-TH");
}