"use client";

import LineLogin from "@/components/LineLogin";
import LoadingOverlay from "@/components/LoadingOverlay";
import Popup from "@/components/ModalPopup";
import SectionContact from "@/components/SectionContact";
import ActiveEvent from "@/components/project/ActiveEvent";
import ActiveProject from "@/components/project/ActiveProject";
import ActiveShop from "@/components/project/ActiveShop";
import { useUserContext } from "@/context/UserContext";
import useAuthGuard from "@/hooks/useAuthGuard";
import useProjectData from "@/hooks/useProjectData";
import { useEffect, useState } from "react";

export default function Home() {
  const { user, loading, validateUser } = useUserContext();
  const { popup, setPopup } = useAuthGuard();
  const { projects, activeData, isLoading } = useProjectData();

  const [checkingToken, setCheckingToken] = useState(true);

  useEffect(() => {
    async function handleTokenFromUrl() {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");

      if (!token) {
        setCheckingToken(false);
        return;
      }

      localStorage.setItem("accessToken", token);

      window.history.replaceState({}, "", window.location.pathname);

      if (validateUser) {
        await validateUser();
      }

      setCheckingToken(false);
    }

    handleTokenFromUrl();
  }, [validateUser]);

  const pageLoading = loading || checkingToken || isLoading;

  return (
    <>
      <Popup
        open={popup.open}
        type={popup.type}
        message={popup.message}
        onClose={() => setPopup({ ...popup, open: false })}
      />

      <main className="max-w-5xl mx-auto px-6 py-4 md:max-w-3xl">
        {pageLoading && <LoadingOverlay />}

        {!pageLoading && !user && <LineLogin />}

        {!pageLoading && (
          <>
            {activeData && (
              <>
                {activeData.project.type === "donation" && (
                  <ActiveProject data={activeData} />
                )}
                {activeData.project.type === "shop" && (
                  <ActiveShop data={activeData} user={user} />
                )}
                {activeData.project.type === "event" && (
                  <ActiveEvent data={activeData} user={user} />
                )}
              </>
            )}
            {/* ถ้าเป็น ProjectList ที่หลัง ควรใช้ตรงนี้ */}
            {/* {!activeData && <ProjectList projects={projects} />} */}
          </>
        )}

        <SectionContact />
      </main>
    </>
  );
}
