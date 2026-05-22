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

export function formatThaiDateWithTime(dateInput: any) {
  if (!dateInput) return "-";

  let date: Date | null = null;

  if (dateInput?.toDate) {
    date = dateInput.toDate();
  } else if (dateInput?._seconds) {
    date = new Date(dateInput._seconds * 1000);
  } else if (dateInput instanceof Date) {
    date = dateInput;
  } else if (
    typeof dateInput === "string" &&
    /^\d{4}-\d{2}-\d{2}/.test(dateInput)
  ) {
    date = new Date(dateInput);
  } else if (typeof dateInput === "string") {
    const text = dateInput.trim();

    const match = text.match(
      /^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:,\s*(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/
    );

    if (match) {
      const [, d, m, y, hh = "0", mm = "0", ss = "0"] = match;

      date = new Date(
        Number(y),
        Number(m) - 1,
        Number(d),
        Number(hh),
        Number(mm),
        Number(ss)
      );
    } else {
      date = new Date(text);
    }
  }

  if (!date || isNaN(date.getTime())) return "-";

  const day = date.getDate();
  const month = date.toLocaleString("th-TH", { month: "short" });
  const year = date.getFullYear() + 543;

  const hours = date.getHours();
  const minutes = date.getMinutes();

  const hasTime = hours !== 0 || minutes !== 0;

  if (hasTime) {
    return `${day} ${month} ${year} ${String(hours).padStart(2, "0")}:${String(
      minutes
    ).padStart(2, "0")} น.`;
  }

  return `${day} ${month} ${year}`;
}