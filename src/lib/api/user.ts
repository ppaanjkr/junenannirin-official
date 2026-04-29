import { apiFetch } from "./client";
import type { ProfileSummaryResponse } from "./types";

export const getProfileSummary = (user_id: string) =>
  apiFetch<ProfileSummaryResponse>(`?action=getProfileSummary&user_id=${user_id}`);