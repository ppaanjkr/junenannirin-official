"use client";

import { useEffect, useState } from "react";

export default function useUser() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    validateUser();
  }, []);

  async function validateUser() {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        clearUser();
        return;
      }

      const res = await fetch("/api/auth/me", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();

      if (
        !res.ok ||
        !result.success ||
        result.status !== "EXIST" ||
        !result.user ||
        Number(result.user.active) !== 1
      ) {
        clearUser();
        return;
      }

      setUser(result.user);
    } catch (err) {
      console.error("user error", err);
      clearUser();
    } finally {
      setLoading(false);
    }
  }

  function clearUser() {
    localStorage.removeItem("accessToken");

    // ล้างของเดิมที่เคยเก็บไว้
    localStorage.removeItem("user");

    localStorage.removeItem("fc_project");
    localStorage.removeItem("cart");
    localStorage.removeItem("fc_order");

    setUser(null);
  }

  return {
    user,
    setUser,
    loading,
    clearUser,
    validateUser,
  };
}