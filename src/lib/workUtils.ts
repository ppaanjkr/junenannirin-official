export function splitComma(v?: string) {
  if (!v) return [];
  return v.split(",").map(s => s.trim()).filter(Boolean);
}

// รองรับ drive link แบบ file/d/ID/view?..., หรือให้มาเป็น ID ตรงๆ
export function driveThumb(urlOrId?: string) {
  const v = (urlOrId ?? "").trim();
  if (!v) return "";

  // plain id
  if (/^[a-zA-Z0-9_-]{10,}$/.test(v) && !v.includes("/")) {
    return `https://drive.google.com/thumbnail?id=${v}&sz=w800`;
  }

  const m1 = v.match(/\/file\/d\/([^/]+)/);
  if (m1?.[1]) return `https://drive.google.com/thumbnail?id=${m1[1]}&sz=w800`;

  const m2 = v.match(/\/d\/([^/]+)/);
  if (m2?.[1]) return `https://drive.google.com/thumbnail?id=${m2[1]}&sz=w800`;

  const m3 = v.match(/[?&]id=([^&]+)/);
  if (m3?.[1]) return `https://drive.google.com/thumbnail?id=${m3[1]}&sz=w800`;

  return v; // 🔥 fallback
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

  return "";
}