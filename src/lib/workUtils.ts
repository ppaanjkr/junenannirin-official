export function splitComma(v?: string) {
  if (!v) return [];
  return v.split(",").map(s => s.trim()).filter(Boolean);
}

// รองรับ drive link แบบ file/d/ID/view?..., หรือให้มาเป็น ID ตรงๆ
export function driveThumb(urlOrId?: unknown) {
  if (typeof urlOrId !== "string") return "";

  const v = urlOrId.trim();
  if (!v) return "";

  const patterns = [
    /\/file\/d\/([^/]+)/,
    /\/d\/([^/]+)/,
    /id=([^&]+)/,
  ];

  let fileId = "";

  for (const pattern of patterns) {
    const match = v.match(pattern);
    if (match?.[1]) {
      fileId = match[1];
      break;
    }
  }

  if (!fileId && !v.includes("/") && !v.includes("http")) {
    fileId = v;
  }

  if (!fileId) return v;

  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
}

export function randomNumeric(length = 12) {
  return Array.from({ length }, () =>
    Math.floor(Math.random() * 10)
  ).join("");
}

export function getBankLogo(shortName?: string) {
  if (!shortName) return "";

  const key = shortName.toLowerCase();

  if (key === "ktb") return "/bank/KTB.png";
  if (key === "kbank") return "/bank/KBANK.png";
  if (key === "promptpay") return "/bank/promptpay.png"; 
  if (key === "bangkok bank" || key === "bbl" || key === "bangkokbank") return "/bank/bbl.png"; 

  return "";
}


// export function getEndTime(endDate?: string | null) {
//   if (!endDate) return null;

//   // ถ้ามี T อยู่แล้ว แปลว่าเป็น datetime / ISO
//   if (endDate.includes("T")) {
//     return new Date(endDate).getTime();
//   }

//   // ถ้าเป็น yyyy-mm-dd ให้หมดวันนั้นเวลา 23:59:59
//   return new Date(`${endDate}T23:59:59`).getTime();
// }

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
}

function toIsoDate(value: any) {
  if (!value) return "";

  if (value?.toDate) {
    return value.toDate().toISOString();
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  return value;
}