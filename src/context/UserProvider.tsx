"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import useUser from "../hooks/useUser";
import Navbar from "../components/Navbar";
import { UserContext } from "./UserContext";

export default function UserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, setUser } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    const isAdminPage = pathname.startsWith("/admin");

    if (isAdminPage && (!user || user.team !== "admin")) {
      router.replace("/");
    }

  }, [pathname, user, loading]);

  if (loading) return null; 

  return (
    <UserContext.Provider value={{ user, loading, setUser  }}>
      <div className="text-textMain">
        <Navbar user={user} />
        {children}
      </div>
    </UserContext.Provider>
  );
}