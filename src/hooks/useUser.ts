// "use client";

// import { useEffect, useState } from "react";

// export default function useUser() {
//   const [user, setUser] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     try {
//       const stored = localStorage.getItem("user");
//       const parsed = stored ? JSON.parse(stored) : null;

//       const isValidUser =
//         parsed &&
//         typeof parsed === "object" &&
//         Object.keys(parsed).length > 0;

//       if (isValidUser && parsed.expireAt && parsed.expireAt < Date.now()) {
//         // localStorage.clear();
//         localStorage.removeItem("user");
//         localStorage.removeItem("fc_project");
//         localStorage.removeItem("cart");
//         localStorage.removeItem("fc_order");
//         setUser(null);
//       } else {
//         setUser(isValidUser ? parsed : null);
//       }
//     } catch (err) {
//       console.error("user error", err);
//       setUser(null);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   return { user, setUser, loading };
// }

"use client";

import { useEffect, useState } from "react";

export default function useUser() {
  const [user, setUser] = useState<any>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateUser = async () => {
      try {
        const stored = localStorage.getItem("user");

        const parsed = stored ? JSON.parse(stored) : null;

        const isValidUser =
          parsed &&
          typeof parsed === "object" &&
          Object.keys(parsed).length > 0;

        if (!isValidUser) {
          setUser(null);

          return;
        }

        if (parsed.expireAt && parsed.expireAt < Date.now()) {
          clearUser();

          return;
        }

        // check user
        const res = await fetch("/api/auth/me", {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            lineUserId: parsed.lineUserId,
          }),
        });
        const result = await res.json();

        if (
          result.status !== "EXIST" ||
          !result.user ||
          Number(result.user.active) !== 1
        ) {
          clearUser();

          return;
        }

        // refresh
        const latestUser = {
          ...parsed,

          username: result.user.username,
          phone: result.user.phone,
          team: result.user.team,
          active: result.user.active,
          name: result.user.name,
          address: result.user.address,
        };

        localStorage.setItem("user", JSON.stringify(latestUser));

        setUser(latestUser);
      } catch (err) {
        console.error("user error", err);

        clearUser();
      } finally {
        setLoading(false);
      }
    };

    validateUser();
  }, []);

  function clearUser() {
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
  };
}
