"use client";

import SectionAdminProject from "@/components/admin/SectionAdminProject";
import SectionSummary from "@/components/admin/SectionSummary";
import LoadingOverlay from "@/components/LoadingOverlay";
import Popup from "@/components/ModalPopup";
import { useUserContext } from "@/context/UserContext";
import useAuthGuard from "@/hooks/useAuthGuard";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const { user, loading } = useUserContext();

  const { popup, setPopup } = useAuthGuard();
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
        <SectionSummary />
        <SectionAdminProject projects={[]} />
      </main>
    </>
  );
}
