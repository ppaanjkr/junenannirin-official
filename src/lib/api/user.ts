import { apiFetch } from "./client";
import type { ProfileHistoryResponse, ProfileSummaryResponse, UserPurchaseSummeryResponse } from "./types";

export const getProfileSummary = (user_id: string) =>
  apiFetch<ProfileSummaryResponse>(`?action=getProfileSummary&user_id=${user_id}`);

export const getProfileHistory = (user_id: string) =>
  apiFetch<ProfileHistoryResponse>(`?action=getUserHistory&user_id=${user_id}`);

export const getUserShopSummary = (project_id: string, user_id: string) =>
  apiFetch<UserPurchaseSummeryResponse>(`?action=getUserShopSummary&project_id=${project_id}&user_id=${user_id}`);