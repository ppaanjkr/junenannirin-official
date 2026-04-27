export function formatThaiDate(dateString?: string) {
  if (!dateString) return "";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const thaiMonths = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];

  const day = date.getDate();
  const month = thaiMonths[date.getMonth()];
  const year = date.getFullYear() + 543;

  return `${day} ${month} ${year}`;
}

export function convertToThaiYear(dateString: string) {
  const date = new Date(dateString);
  const year = date.getFullYear() + 543;
  return year.toString();
}

export function formatThaiDateWithTime(dateInput: string) {
  if (!dateInput) return "-";

  const date = new Date(dateInput);

  if (isNaN(date.getTime())) return "-";

  const day = date.getDate();
  const month = date.toLocaleString("th-TH", { month: "short" });
  const year = date.getFullYear() + 543;

  const hours = date.getHours();
  const minutes = date.getMinutes();

  // เช็คว่ามีเวลาไหม (ไม่ใช่ 00:00)
  const hasTime = hours !== 0 || minutes !== 0;

  if (hasTime){
    return `${day} ${month} ${year} ${String(hours).padStart(2,"0")}:${String(minutes).padStart(2,"0")} น.`;
  }

  return `${day} ${month} ${year}`;
}