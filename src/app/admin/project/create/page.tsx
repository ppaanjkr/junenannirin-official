"use client";

import LoadingOverlay from "@/components/LoadingOverlay";
import Popup from "@/components/ModalPopup";
import SectionBack from "@/components/SectionBack";
import ProjectForm from "@/components/admin/project/form/ProjectForm";
import { useUserContext } from "@/context/UserContext";
import useAuthGuard from "@/hooks/useAuthGuard";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const router = useRouter();

  const { user, loading } = useUserContext();

  const { popup, setPopup } = useAuthGuard();

  const [formLoading, setFormLoading] = useState(false);

  return (
    <>
      {(loading || formLoading) && <LoadingOverlay />}

      <Popup
        open={popup.open}
        type={popup.type}
        message={popup.message}
        onClose={() => setPopup({ ...popup, open: false })}
      />

      <main className="max-w-5xl mx-auto px-6 py-4 pb-28 md:max-w-3xl lg:max-w-6xl">
        <SectionBack
          onclick={() => router.replace("/admin")}
          title={"Project Create"}
        />

        <ProjectForm
          mode="create"
          user={user}
          setPopup={setPopup}
          setPageLoading={setFormLoading}
        />
      </main>
    </>
  );
}