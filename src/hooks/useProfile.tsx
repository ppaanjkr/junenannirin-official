"use client";

import { useUserContext } from "@/context/UserContext";
import { getProfileHistory, getProfileSummary } from "@/lib/api/user";
import { useEffect, useState } from "react";
import type { HistoryDonation, HistoryShop, ProfileSummary } from "@/lib/api/types";

export default function useProfileSummary() {
  const { user } = useUserContext();

  const [profile, setProfile] = useState<ProfileSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user?.uuid) return; 

    const fetchData = async () => {
      setIsLoading(true);

      try {
        const res = await getProfileSummary(user.uuid);

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

export function useProfileHistory() {
  const { user } = useUserContext();

  const [shop, setShop] = useState<HistoryShop[] | null>(null);
  const [donation, setDonation] = useState<HistoryDonation[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user?.uuid) return; 

    const fetchData = async () => {
      setIsLoading(true);

      try {
        const res = await getProfileHistory(user.uuid);

        if (res.success) {
          setShop(res.data.shop);
          setDonation(res.data.donation);
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
    shop,
    donation,
    isLoading,
  };
}