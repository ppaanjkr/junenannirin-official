"use client";

import { useBankList } from "@/hooks/useAdmin";
import {
  defaultProjectForm,
  ProjectFormState,
} from "@/lib/admin-project/projectFormDefault";
import {
  buildProjectPayload,
  mapProjectDetailToForm,
} from "@/lib/admin-project/projectFormMapper";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

import ProjectBankSection from "./ProjectBankSection";
import ProjectBasicSection from "./ProjectBasicSection";
import ProjectImageSection from "./ProjectImageSection";
import ProjectRewardSection from "./ProjectRewardSection";
import ProjectStatusSection from "./ProjectStatusSection";
import ProjectStickyActions from "./ProjectStickyActions";
import ProjectTargetSection from "./ProjectTargetSection";
import ProjectThemeSection from "./ProjectThemeSection";
import ProjectTypeSection from "./ProjectTypeSection";

type PopupState = {
  open: boolean;
  type: "success" | "error";
  message: string;
};

type Props = {
  mode: "create" | "edit";
  projectId?: string;
  initialData?: any;
  user?: any;
  setPopup: Dispatch<SetStateAction<PopupState>>;
  setPageLoading: Dispatch<SetStateAction<boolean>>;
};

export default function ProjectForm({
  mode,
  projectId,
  initialData,
  user,
  setPopup,
  setPageLoading,
}: Props) {
  const router = useRouter();
  const { banks, isBankLoading } = useBankList();

  const [form, setForm] = useState<ProjectFormState>(defaultProjectForm);

  useEffect(() => {
    if (mode === "create") {
      setForm(defaultProjectForm);
    }

    if (mode === "edit" && initialData) {
      setForm(mapProjectDetailToForm(initialData));
    }
  }, [mode, initialData]);

  useEffect(() => {
    setPageLoading(isBankLoading);
  }, [isBankLoading, setPageLoading]);

  function updateForm<K extends keyof ProjectFormState>(
    key: K,
    value: ProjectFormState[K],
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function validate() {
    if (!form.name.trim()) {
      setPopup({
        open: true,
        type: "error",
        message: "Project name is required",
      });
      return false;
    }

    if (form.status === "draft") return true;

    if (!form.type) {
      setPopup({
        open: true,
        type: "error",
        message: "Select project type",
      });
      return false;
    }

    if (!form.bank_id) {
      setPopup({
        open: true,
        type: "error",
        message: "Select bank account",
      });
      return false;
    }

    if (form.type === "donation" && Number(form.target_amount || 0) <= 0) {
      setPopup({
        open: true,
        type: "error",
        message: "Target amount is required",
      });
      return false;
    }

    if (form.type === "shop" && form.rewards.length === 0) {
      setPopup({
        open: true,
        type: "error",
        message: "Add at least 1 product",
      });
      return false;
    }

    return true;
  }

  async function handleSubmit() {
    if (!validate()) return;

    setPageLoading(true);

    try {
      const payload = buildProjectPayload(form);

      const url =
        mode === "create"
          ? "/api/firebase/admin/project/create"
          : "/api/firebase/admin/project/update";

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          project: {
            ...payload,
            id: projectId || form.id,
            created_by: user?.uuid || "",
            updated_by: user?.uuid || "",
          },
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setPopup({
          open: true,
          type: "error",
          message: data.message || "Save project failed",
        });
        return;
      }

      setPopup({
        open: true,
        type: "success",
        message:
          mode === "create"
            ? "Project created successfully"
            : "Project updated successfully",
      });

      const nextProjectId = data.project_id || data.id || projectId || form.id;

      setTimeout(() => {
        if (nextProjectId) {
          router.replace(`/admin/project/${nextProjectId}`);
        } else {
          router.replace("/admin");
        }
      }, 600);
    } catch (err) {
      console.error(err);

      setPopup({
        open: true,
        type: "error",
        message: "Save project failed",
      });
    } finally {
      setPageLoading(false);
    }
  }

  return (
    <>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-8 space-y-4">
          <ProjectBasicSection form={form} updateForm={updateForm} />

          <ProjectImageSection form={form} updateForm={updateForm} />

          <ProjectTypeSection form={form} updateForm={updateForm} />

          {form.type === "donation" && (
            <ProjectTargetSection form={form} updateForm={updateForm} />
          )}

          <ProjectRewardSection form={form} updateForm={updateForm} />
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-4">
          <ProjectStatusSection form={form} updateForm={updateForm} />

          <ProjectThemeSection form={form} updateForm={updateForm} />

          <ProjectBankSection
            form={form}
            updateForm={updateForm}
            banks={banks || []}
          />
        </div>
      </div>

      <ProjectStickyActions
        mode={mode}
        onCancel={() =>
          mode === "edit" && projectId
            ? router.replace(`/admin/project/${projectId}`)
            : router.replace("/admin")
        }
        onSave={handleSubmit}
      />
    </>
  );
}