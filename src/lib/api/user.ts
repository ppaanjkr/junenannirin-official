import { apiFetch } from "./client";
import type { ProfileHistoryResponse, ProfileSummaryResponse } from "./types";

export const getProfileSummary = (user_id: string) =>
  apiFetch<ProfileSummaryResponse>(`?action=getProfileSummary&user_id=${user_id}`);

export const getProfileHistory = (user_id: string) =>
  apiFetch<ProfileHistoryResponse>(`?action=getUserHistory&user_id=${user_id}`);