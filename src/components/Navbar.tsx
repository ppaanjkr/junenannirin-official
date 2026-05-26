"use client";

import { useUserContext } from "@/context/UserContext";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar({ user }: { user: any }) {
  const { setUser, clearUser } = useUserContext();

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const router = useRouter();

  function handleGoToPage(page: string) {
    const path = page.startsWith("/") ? page : `/${page}`;

    setIsMobileOpen(false);
    setIsProfileOpen(false);

    setTimeout(() => {
      router.push(path);
    }, 50);
  }

  function handleLogout() {
    if (clearUser) {
      clearUser();
    } else {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      localStorage.removeItem("fc_project");
      localStorage.removeItem("cart");
      localStorage.removeItem("fc_order");
      setUser(null);
    }

    setIsProfileOpen(false);
    setIsMobileOpen(false);

    router.replace("/");
  }

  return (
    <>
      <header className="sticky top-0 z-50 backdrop-blur bg-white/80 border-b border-pinkAccent/80 shadow-sm">
        <div className="w-full flex justify-between items-center max-w-5xl mx-auto px-6 md:max-w-3xl cursor-pointer">
          <div className="flex items-center py-3">
            <a
              className="flex items-center gap-2 font-semibold text-lg text-secondary"
              onClick={() => handleGoToPage("")}
            >
              <img src="/icon/june_logo_circle.png" className="w-6" />
              JUNE NANNIRIN OFFICIAL
            </a>
          </div>

          {user && (
            <>
              <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="md:hidden flex justify-center items-center border border-pinkSecondary/50 rounded-sm w-8 h-8"
              >
                {isMobileOpen ? (
                  <X className="w-4 h-4 text-textSub" />
                ) : (
                  <Menu className="w-4 h-4 text-textSub" />
                )}
              </button>

              <div className="hidden md:flex items-center gap-2 relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <span className="font-medium">
                    {user.username || "June Nannirin Fanclub"}
                  </span>

                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 top-8 bg-white shadow-lg rounded-xl w-40 overflow-hidden border border-secondary/20">
                    <button
                      className="w-full text-left block px-4 py-2 hover:bg-pinkAccent/50"
                      onClick={() => handleGoToPage("profile")}
                    >
                      Profile
                    </button>

                    <button
                      className="w-full text-left block px-4 py-2 hover:bg-pinkAccent/50"
                      onClick={() => handleGoToPage("history")}
                    >
                      History
                    </button>

                    {user?.team === "admin" && (
                      <>
                        <button
                          className="w-full text-left block px-4 py-2 hover:bg-pinkAccent/50"
                          onClick={() => handleGoToPage("admin")}
                        >
                          Admin
                        </button>

                        <button
                          className="w-full text-left block px-4 py-2 hover:bg-pinkAccent/50"
                          onClick={() => handleGoToPage("admin/setting")}
                        >
                          Setting
                        </button>
                      </>
                    )}

                    <button
                      className="w-full text-left block px-4 py-2 hover:bg-pinkAccent/50"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </header>

      {isMobileOpen && (
        <div className="fixed top-[50px] left-0 w-full z-[999] md:hidden backdrop-blur bg-white/80 border-b border-secondary/20 shadow-sm px-4 py-3 space-y-2">
          <button
            className="w-full text-left block px-3 py-2 hover:text-secondary border-b border-pinkAccent"
            onClick={() => handleGoToPage("profile")}
          >
            Profile
          </button>

          <button
            className="w-full text-left block px-3 py-2 hover:text-secondary border-b border-pinkAccent"
            onClick={() => handleGoToPage("history")}
          >
            History
          </button>

          {user?.team === "admin" && (
            <>
              <button
                className="w-full text-left block px-3 py-2 hover:text-secondary border-b border-pinkAccent"
                onClick={() => handleGoToPage("admin")}
              >
                Admin
              </button>

              <button
                className="w-full text-left block px-3 py-2 hover:text-secondary border-b border-pinkAccent"
                onClick={() => handleGoToPage("admin/setting")}
              >
                Setting
              </button>
            </>
          )}

          <button
            className="w-full text-left block px-3 py-2 hover:text-secondary border-b border-pinkAccent"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}
    </>
  );
}