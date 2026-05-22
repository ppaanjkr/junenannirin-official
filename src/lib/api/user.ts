import type {
  ProfileHistoryResponse,
  ProfileSummaryResponse,
  UserPurchaseSummeryResponse,
} from "./types";

export async function getProfileSummary(
  userId: string,
): Promise<ProfileSummaryResponse> {
  const params = new URLSearchParams({
    user_id: userId,
  });

  const res = await fetch(`/api/firebase/user/summary?${params}`, {
    method: "GET",
    cache: "no-store",
  });

  return res.json();
}

export async function updateUserProfile(payload: any) {
  const res = await fetch("/api/firebase/user/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return res.json();
}

export async function getProfileHistory(
  userId: string,
): Promise<ProfileHistoryResponse> {
  const params = new URLSearchParams({
    user_id: userId,
  });

  const res = await fetch(`/api/firebase/user/history?${params}`, {
    method: "GET",
    cache: "no-store",
  });

  return res.json();
}

export async function getUserShopSummary(
  projectId: string,
  userId: string,
): Promise<UserPurchaseSummeryResponse> {
  const params = new URLSearchParams({
    project_id: projectId,
    user_id: userId,
  });

  const res = await fetch(`/api/firebase/user/shop-summary?${params}`, {
    method: "GET",
    cache: "no-store",
  });

  return res.json();
}