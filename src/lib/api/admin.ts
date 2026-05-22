import {
  AdminBanksResponse,
  AdminProjectDetailResponse,
  AdminProjectOrderResponse,
  AdminUsersResponse,
  ProjectListResponse,
} from "./types";

export async function getAdminProjects(): Promise<ProjectListResponse> {
  const res = await fetch("/api/firebase/admin/project/list", {
    method: "GET",
    cache: "no-store",
  });

  return res.json();
}

export async function getAdminProjectDetail(
  project_id: string,
): Promise<AdminProjectDetailResponse> {
  const params = new URLSearchParams({
    project_id,
  });

  const res = await fetch(`/api/firebase/admin/project/detail?${params}`, {
    method: "GET",
    cache: "no-store",
  });

  return res.json();
}

export async function getAdminProjectEditDetail(projectId: string) {
  const params = new URLSearchParams({
    project_id: projectId,
  });

  const res = await fetch(`/api/firebase/admin/project/edit-detail?${params}`, {
    method: "GET",
    cache: "no-store",
  });

  return res.json();
}

export async function updateAdminProject(payload: any) {
  const res = await fetch("/api/firebase/admin/project/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return res.json();
}

export async function closeProject(payload: {
  project_id: string;
  updated_by?: string;
}) {
  const res = await fetch("/api/firebase/admin/project/close", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return res.json();
}

export async function updateProjectSubStatus(payload: {
  project_id: string;
  sub_status: string;
  updated_by?: string;
}) {
  const res = await fetch("/api/firebase/admin/project/sub-status", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return res.json();
}

export async function getAdminProjectOrders(
  project_id: string,
): Promise<AdminProjectOrderResponse> {
  const params = new URLSearchParams({
    project_id,
  });

  const res = await fetch(`/api/firebase/admin/project/orders?${params}`, {
    method: "GET",
    cache: "no-store",
  });

  return res.json();
}

export async function updateAdminShipments(shipments: any[]) {
  const res = await fetch("/api/firebase/admin/shipment/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      shipments,
    }),
  });

  return res.json();
}

// setting members
export async function getAdminUsers(): Promise<AdminUsersResponse> {
  const res = await fetch("/api/firebase/admin/user/list", {
    method: "GET",
    cache: "no-store",
  });

  return res.json();
}

export async function updateAdminUser(payload: any) {
  const res = await fetch("/api/firebase/admin/user/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return res.json();
}

// Banks
export async function getAdminBanks() {
  const res = await fetch("/api/firebase/admin/bank/list", {
    method: "GET",
    cache: "no-store",
  });

  return res.json();
}

export async function createAdminBank(payload: any) {
  const res = await fetch("/api/firebase/admin/bank/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return res.json();
}

export async function updateAdminBank(payload: any) {
  const res = await fetch("/api/firebase/admin/bank/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return res.json();
}

export async function deleteAdminBank(bankId: string) {
  const res = await fetch("/api/firebase/admin/bank/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      bank_id: bankId,
    }),
  });

  return res.json();
}