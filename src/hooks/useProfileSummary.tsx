"use client";

import { useUserContext } from "@/context/UserContext";
import { getProfileSummary } from "@/lib/api/user";
import { useEffect, useState } from "react";
import type { ProfileSummary } from "@/lib/api/types";

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
  }, [user?.uuid]); // 🔥 สำคัญมาก

  return {
    profile,
    isLoading,
  };
}