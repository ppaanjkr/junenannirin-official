"use client";

import LoadingOverlay from "@/components/LoadingOverlay";
import Popup from "@/components/ModalPopup";
import SectionBack from "@/components/SectionBack";
import ProjectForm from "@/components/admin/project/form/ProjectForm";
import { useUserContext } from "@/context/UserContext";
import { getAdminProjectEditDetail } from "@/lib/api/admin";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type PopupState = {
  open: boolean;
  type: "success" | "error";
  message: string;
};

export default function AdminProjectEditPage() {
  const router = useRouter();

  const params = useParams();
  const id = String(params?.id || "");

  const { user } = useUserContext();

  const [projectDetail, setProjectDetail] = useState<any>(null);
  const [pageLoading, setPageLoading] = useState(true);

  const [popup, setPopup] = useState<PopupState>({
    open: false,
    type: "success",
    message: "",
  });

  useEffect(() => {
    if (!id) return;

    async function fetchProjectDetail() {
      setPageLoading(true);

      try {
        const res = await getAdminProjectEditDetail(id);

        if (!res.success) {
          setPopup({
            open: true,
            type: "error",
            message: res.message || "Load project failed",
          });

          return;
        }

        setProjectDetail(res.data);
      } catch (err) {
        console.error(err);

        setPopup({
          open: true,
          type: "error",
          message: "Load project failed",
        });
      } finally {
        setPageLoading(false);
      }
    }

    fetchProjectDetail();
  }, [id]);

  return (
    <>
      {pageLoading && <LoadingOverlay />}

      <Popup
        open={popup.open}
        type={popup.type}
        message={popup.message}
        onClose={() =>
          setPopup((prev) => ({
            ...prev,
            open: false,
          }))
        }
      />

      <main className="min-h-screen bg-pinkAccent/10 px-4 py-6 pb-28">
        <div className="mx-auto max-w-6xl">
          <SectionBack
            onclick={() => router.replace(`/admin/project/${id}`)}
            title="Edit Project"
          />

          {projectDetail && (
            <ProjectForm
              mode="edit"
              projectId={id}
              initialData={projectDetail}
              user={user}
              setPopup={setPopup}
              setPageLoading={setPageLoading}
            />
          )}
        </div>
      </main>
    </>
  );
}