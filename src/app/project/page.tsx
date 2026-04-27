"use client";

import LineLogin from "@/components/LineLogin";
import LoadingOverlay from "@/components/LoadingOverlay";
import Popup from "@/components/ModalPopup";
import SectionContact from "@/components/SectionContact";
import ActiveProject from "@/components/project/ActiveProject";
import ActiveShop from "@/components/project/ActiveShop";
import { useUserContext } from "@/context/UserContext";
import useAuthGuard from "@/hooks/useAuthGuard";
import useProjectData from "@/hooks/useProjectData";

export default function Home() {
  const { user, loading } = useUserContext();
  const { popup, setPopup } = useAuthGuard();
  const { projects, activeData, isLoading } = useProjectData();

  return (
    <>
      <Popup
        open={popup.open}
        type={popup.type}
        message={popup.message}
        onClose={() => setPopup({ ...popup, open: false })}
      />
      <main className="max-w-5xl mx-auto px-6 py-4 md:max-w-3xl">
        {!user && <LineLogin />}
        {isLoading && <LoadingOverlay />}

        {/* {!activeData && <ProjectList projects={projects} />} */}
        {!isLoading && projects.length > 0 && (
          <>
            {activeData &&
              (activeData.project.type === "donation" ? (
                <ActiveProject data={activeData} />
              ) : (
                <ActiveShop data={activeData} user={user}/>
              ))}
          </>
        )}
        <SectionContact /> 
      </main>
    </>
  );
}
