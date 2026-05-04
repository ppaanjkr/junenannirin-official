import { getThemeColors } from "@/lib/theme";
import type { ActiveProjectData } from "@/lib/api/types";
import { useEffect, useState } from "react";
import SectionProject from "./SectionProject";
import SectionGoal from "./SectionGoal";
import SectionReward from "./SectionReward";
import SectionTopSpender from "./SectionTopSpender";
import SectionLastDonate from "./SectionLastDonate";
import { useUserDonationSummary } from "@/hooks/useProfile";
import LoadingOverlay from "../LoadingOverlay";
import SectionDonationSummary from "./SectionDonationSummary";

export default function ActiveProject({ data, user }: { data: ActiveProjectData; user: any | null }) {
  const { project, targets, rewards, bank, topSpenders, recent } = data;
  const { donation, isLoading } = useUserDonationSummary(project.id.toString());
  useEffect(() => {
    if (!project) return;

    if (localStorage.getItem("project")) return;

    localStorage.setItem(
      "project",
      JSON.stringify({
        id: project.id,
        name: project.name,
        theme_color: project.theme_color,
        bank_name: bank.bank_name || "",
        bank_short_name: bank.bank_short_name || "",
        account_name: bank.account_name || "",
        account_name_en: bank.account_name_en || "",
        account_no: bank.account_no || "",
        qrcode: bank.qrcode || "",
      }),
    );
  }, [project]);

  const [projectData, setProjectData] = useState<any>(null);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("project");

      if (raw) {
        setProjectData(JSON.parse(raw));
      }
    } catch {
      setProjectData(null);
    }
  }, []);
  const theme = getThemeColors(project.theme_color);
  return (
    <>
     {isLoading && <LoadingOverlay />}
      <SectionProject data={data} theme={theme} />
      {user && <SectionDonationSummary data={donation} theme={theme} user={user} />}
      {targets && targets.length > 0 && <SectionGoal data={data} theme={theme} />}
      {rewards && rewards.length > 0 && <SectionReward data={data} theme={theme} />}
      <div className="grid grid-cols-12 gap-4">
        <SectionTopSpender data={topSpenders} theme={theme} />
        <SectionLastDonate data={recent} theme={theme} />
      </div>
      
    </>
  );
}
