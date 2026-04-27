export function getThemeColors(theme?: string) {
  if (!theme) {
    return {
      secondary: "#ec4899", // default pink
      accent: "#fce7f3",
    };
  }

  const parts = theme.split(",").map((c) => c.trim());

  return {
    secondary: parts[0] || "#ec4899",
    accent: parts[1] || "#fce7f3",
  };
}