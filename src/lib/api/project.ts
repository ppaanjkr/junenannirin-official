import { apiFetch } from "./client";
import type { ProjectListResponse, ActiveProjectResponse } from "./types";

export const getProjects = () =>
  apiFetch<ProjectListResponse>("?action=projects");

export const getActiveProject = () =>
  apiFetch<ActiveProjectResponse>("?action=active");