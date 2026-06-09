"use client";

import { useEffect, useState } from "react";
import { useUserContext } from "@/context/UserContext";
import {
  getProfileHistory,
  getProfileSummary,
  getTeamPoll,
  getUserShopSummary,
} from "@/lib/api/user";
import type {
  HistoryDonation,
  HistoryEvent,
  HistoryShop,
  ProfileSummary,
  UserPurchaseSummery,
} from "@/lib/api/types";

export default function useProfileSummary() {
  const { user } = useUserContext();

  const [profile, setProfile] = useState<ProfileSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user?.uuid) return;

    const fetchData = async () => {
      setIsLoading(true);

      try {
        const res = await getProfileSummary();

        if (res.success) {
          setProfile(res.data);
        }
      } catch (err) {
        console.error("fetch profile summary error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user?.uuid]);

  return {
    profile,
    isLoading,
  };
}

export function useUserPurchaseSummary(project_id: string) {
  const { user } = useUserContext();

  const [shopSummary, setShopSummary] =
    useState<UserPurchaseSummery | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user?.uuid || !project_id) return;

    const fetchData = async () => {
      setIsLoading(true);

      try {
        const res = await getUserShopSummary(project_id);

        if (res.success) {
          setShopSummary(res.data);
        }
      } catch (err) {
        console.error("fetch user shop summary error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user?.uuid, project_id]);

  return {
    shopSummary,
    isLoading,
  };
}

export function useProfileHistory() {
  const { user } = useUserContext();

  const [shop, setShop] = useState<HistoryShop[] | null>(null);
  const [donation, setDonation] = useState<HistoryDonation[] | null>(null);
  const [event, setEvent] = useState<HistoryEvent[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user?.uuid) return;

    const fetchData = async () => {
      setIsLoading(true);

      try {
        const res = await getProfileHistory();

        if (res.success) {
          setShop(res.data?.shop || []);
          setDonation(res.data?.donation || []);
          setEvent(res.data?.event || []);
        }
      } catch (err) {
        console.error("fetch profile history error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user?.uuid]);

  return {
    shop,
    donation,
    event,
    isLoading,
  };
}

export function useTeamPoll() {
  const [teams, setTeams] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const res = await getTeamPoll();

        if (res.success) {
          setTeams(res.data || []);
          setTotal(Number(res.total || 0));
        }
      } catch (err) {
        console.error("team poll error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    teams,
    total,
    isLoading,
  };
}