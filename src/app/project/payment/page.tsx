"use client";
import LoadingOverlay from "@/components/LoadingOverlay";
import Popup from "@/components/ModalPopup";
import SectionPaymentMethod from "@/components/payment/SectionPaymentMethod";
import SectionPaymentSummary from "@/components/payment/SectionPaymentSummary";
import SectionPaymentUpload from "@/components/payment/SectionPaymentUpload";
import SectionBack from "@/components/SectionBack";
import SectionContact from "@/components/SectionContact";
import useAuthGuard from "@/hooks/useAuthGuard";
import { getThemeColors } from "@/lib/theme";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const { popup, setPopup } = useAuthGuard();

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
  const theme = projectData
    ? getThemeColors(projectData.theme_color)
    : { secondary: "#ff6fa3", accent: "#ffe4ec" };

  const [cart, setCart] = useState<any[]>(() => {
    if (typeof window === "undefined") return [];

    try {
      const raw = localStorage.getItem("fc_order");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <>
    {loading && <LoadingOverlay />}
      <Popup
        open={popup.open}
        type={popup.type}
        message={popup.message}
        onClose={() => setPopup({ ...popup, open: false })}
      />
      <main className="max-w-5xl mx-auto px-6 py-4 md:max-w-3xl">
        <SectionBack
          onclick={() => router.replace("/project")}
          title={"Checkout"}
        />
        <SectionPaymentSummary theme={theme} data={cart}/>
        <SectionPaymentMethod theme={theme} total={total} data={projectData} setPopup={setPopup}/>
        <SectionPaymentUpload 
          theme={theme}
          setLoading={setLoading}
          setPopup={setPopup}
          loading={loading}
          data={projectData}
          total={total}
        />
        <SectionContact />
      </main>
    </>
  );
}
