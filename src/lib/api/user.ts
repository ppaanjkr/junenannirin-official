import type {
  ProfileHistoryResponse,
  ProfileSummaryResponse,
  UserPurchaseSummeryResponse,
} from "./types";

function getAccessToken() {
  if (typeof window === "undefined") return "";

  return localStorage.getItem("accessToken") || "";
}

function authHeaders() {
  const token = getAccessToken();

  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function getProfileSummary(): Promise<ProfileSummaryResponse> {
  const res = await fetch("/api/firebase/user/summary", {
    method: "GET",
    headers: {
      ...authHeaders(),
    },
    cache: "no-store",
  });

  return res.json();
}

export async function updateUserProfile(payload: any) {
  const res = await fetch("/api/firebase/user/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    cache: "no-store",
    body: JSON.stringify(payload),
  });

  return res.json();
}

export async function getProfileHistory(): Promise<ProfileHistoryResponse> {
  const res = await fetch("/api/firebase/user/history", {
    method: "GET",
    headers: {
      ...authHeaders(),
    },
    cache: "no-store",
  });

  return res.json();
}

export async function getUserShopSummary(
  projectId: string,
): Promise<UserPurchaseSummeryResponse> {
  const params = new URLSearchParams({
    project_id: projectId,
  });

  const res = await fetch(`/api/firebase/user/shop-summary?${params}`, {
    method: "GET",
    headers: {
      ...authHeaders(),
    },
    cache: "no-store",
  });

  return res.json();
}

export async function getTeam() {
  const res = await fetch("/api/firebase/user/team", {
    method: "GET",
    cache: "no-store",
  });

  return res.json();
}

export async function getTeamPoll() {
  const res = await fetch("/api/firebase/user/team-poll", {
    method: "GET",
    cache: "no-store",
  });

  return res.json();
}