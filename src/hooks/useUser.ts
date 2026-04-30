"use client";

import { useEffect, useState } from "react";

export default function useUser() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      const parsed = stored ? JSON.parse(stored) : null;

      const isValidUser =
        parsed &&
        typeof parsed === "object" &&
        Object.keys(parsed).length > 0;
      
      if (isValidUser && parsed.expireAt && parsed.expireAt < Date.now()) {
        // localStorage.clear();
        localStorage.removeItem("user");
        localStorage.removeItem("fc_project");
        localStorage.removeItem("cart");
        localStorage.removeItem("fc_order");
        setUser(null);
      } else {
        setUser(isValidUser ? parsed : null);
      }
    } catch (err) {
      console.error("user error", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return { user, setUser, loading };
}