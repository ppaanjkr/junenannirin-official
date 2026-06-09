"use client";

import { getThemeColors } from "@/lib/theme";
import type { ActiveProjectData } from "@/lib/api/types";
import LoadingOverlay from "../LoadingOverlay";
import SectionProject from "./SectionProject";
import SectionLocation from "./SectionLocation";
import SectionMyQueue from "./SectionMyQueue ";

export default function ActiveEvent({
  data,
  user,
  previewMode = false,
}: {
  data: ActiveProjectData;
  user: any;
  previewMode?: boolean;
}) {
  const { project } = data;
  const theme = getThemeColors(project.theme_color);

  return (
    <>
      {/* {!previewMode && <LoadingOverlay />} */}

      <SectionProject data={data} theme={theme} />
      <SectionLocation data={data} theme={theme} />
      <SectionMyQueue projectId={project.id} theme={theme} />
    </>
  );
}
