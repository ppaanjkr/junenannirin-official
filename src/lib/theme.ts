type ThemeColorMap = {
  secondary?: string;
  accent?: string;
};

export function getThemeColors(theme?: string | ThemeColorMap | null) {
  const defaultColors = {
    secondary: "#ec4899",
    accent: "#fce7f3",
  };

  if (!theme) return defaultColors;

  if (typeof theme === "object") {
    return {
      secondary: theme.secondary || defaultColors.secondary,
      accent: theme.accent || defaultColors.accent,
    };
  }

  const parts = theme.split(",").map((c) => c.trim());

  return {
    secondary: parts[0] || defaultColors.secondary,
    accent: parts[1] || defaultColors.accent,
  };
}