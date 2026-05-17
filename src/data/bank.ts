export type BankOption = {
  bank_name: string;
  bank_short_name: string;
  bank_logo: string;
  code: string;
};

export const bankOptions: BankOption[] = [
  {
    bank_name: "ธนาคารกสิกรไทย",
    bank_short_name: "Kasikorn Bank",
    bank_logo: "/bank/KBANK.png",
    code: "01004",
  },
  {
    bank_name: "ธนาคารกรุงไทย",
    bank_short_name: "Krungthai Bank",
    bank_logo: "/bank/KTB.png",
    code: "01006",
  },
  {
    bank_name: "พร้อมเพย์",
    bank_short_name: "PromptPay",
    bank_logo: "/bank/promptpay.png",
    code: "02001",
  },
  {
    bank_name: "ธนาคารกรุงเทพ",
    bank_short_name: "Bangkok Bank",
    bank_logo: "/bank/bbl.png",
    code: "01002",
  },
];

export function getBankOptionByShortName(bankShortName?: string) {
  if (!bankShortName) return null;

  const value = bankShortName.trim().toLowerCase();

  return (
    bankOptions.find(
      (bank) =>
        bank.bank_short_name.trim().toLowerCase() === value ||
        bank.bank_name.trim().toLowerCase() === value,
    ) || null
  );
}