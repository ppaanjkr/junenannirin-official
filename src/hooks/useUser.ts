"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function useUser() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const userParam = searchParams.get("user");

    try {
      if (userParam) {
        const parsed = JSON.parse(decodeURIComponent(userParam));

        localStorage.setItem("user", JSON.stringify(parsed));
        setUser(parsed);

        router.replace(window.location.pathname);
      } else {
        const stored = localStorage.getItem("user");

        const parsed = stored ? JSON.parse(stored) : null;

        const isValidUser =
          parsed &&
          typeof parsed === "object" &&
          Object.keys(parsed).length > 0;

        if (isValidUser && parsed.expireAt && parsed.expireAt < Date.now()) {
          localStorage.clear();
          setUser(null);
          router.replace("/"); 
        } else {
          setUser(isValidUser ? parsed : null);
        }
      }
    } catch (err) {
      console.error("user error", err);
      setUser(null);
    } finally {
      setLoading(false); 
    }
  }, [searchParams]);

  return { user, setUser, loading };
}