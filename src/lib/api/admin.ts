import { apiFetch } from "./client";
import { AdminBanksResponse, AdminProjectDetailResponse, AdminProjectOrderResponse, AdminUsersResponse, ProjectListResponse } from "./types";

export const getAdminProjects = () =>
  apiFetch<ProjectListResponse>("?action=getAdminProjects");
export const getAdminProjectDetail = (project_id: string) =>
  apiFetch<AdminProjectDetailResponse>(`?action=getAdminProjectSummary&project_id=${project_id}`);
export const getAdminProjectOrders = (project_id: string) =>
  apiFetch<AdminProjectOrderResponse>(`?action=getAdminProjectOrders&project_id=${project_id}`);

// setting
export const getAdminUsers = () =>
  apiFetch<AdminUsersResponse>("?action=getAdminUsers");
export const getAdminBanks = () =>
  apiFetch<AdminBanksResponse>("?action=getAdminBanks");
