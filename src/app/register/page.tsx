"use client";

import LoadingOverlay from "@/components/LoadingOverlay";
import Popup from "@/components/ModalPopup";
import ButtonTeam from "@/components/register/ButtonTeam";
import SectionBack from "@/components/SectionBack";
import SectionContact from "@/components/SectionContact";
import { useUserContext } from "@/context/UserContext";
import useAuthGuard from "@/hooks/useAuthGuard";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { teamOptions } from "@/data/teams";

export default function Page() {
  const router = useRouter();
  const { setUser, validateUser } = useUserContext();

  const [tempUser, setTempUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const { popup, setPopup } = useAuthGuard();

  const [form, setForm] = useState({
    lineUserId: "",
    username: "",
    phone: "",
    team: "",
    name: "",
    address: "",
  });

  const [phone, setPhone] = useState("");

  const registerTeamOptions = teamOptions.filter(
    (team) => team.value !== "admin",
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userParam = params.get("user");

    if (!userParam) return;

    try {
      const parsed = JSON.parse(decodeURIComponent(userParam));

      setTempUser(parsed);
      sessionStorage.setItem("tempUser", JSON.stringify(parsed));

      window.history.replaceState({}, "", window.location.pathname);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    if (tempUser) return;

    const stored = sessionStorage.getItem("tempUser");
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored);
      setTempUser(parsed);
    } catch {}
  }, [tempUser]);

  useEffect(() => {
    if (!tempUser) return;

    // ปกติ EXIST ไม่ควรมาหน้านี้แล้ว เพราะ callback จะส่งไป /project พร้อม token
    if (tempUser.status === "EXIST") {
      sessionStorage.removeItem("tempUser");
      router.replace("/project");
    }
  }, [tempUser, router]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);

    setPhone(value);

    setForm((prev) => ({
      ...prev,
      phone: value,
    }));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (
      ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key)
    ) {
      return;
    }

    if (!/^\d$/.test(e.key)) {
      e.preventDefault();
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const paste = e.clipboardData.getData("text");

    if (!/^\d{1,10}$/.test(paste)) {
      e.preventDefault();
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (form.phone[0] !== "0" || form.phone.length !== 10) {
      setPopup({ open: true, message: "Invalid phone number", type: "error" });
      return;
    }

    if (form.team === "") {
      setPopup({ open: true, message: "Select team", type: "error" });
      return;
    }

    if (!tempUser?.lineUserId) {
      setPopup({
        open: true,
        type: "error",
        message: "LINE user not found. Please login again.",
      });
      return;
    }

    setLoading(true);

    const payload = {
      ...form,
      lineUserId: tempUser.lineUserId,
    };

    try {
      const res = await fetch("/api/firebase/user/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.status === "EXIST") {
        setPopup({
          open: true,
          type: "error",
          message: "You are already a member",
        });

        setTimeout(() => {
          router.replace("/project");
        }, 1500);

        return;
      }

      if (data.status === "USERNAME_DUPLICATE") {
        setPopup({
          open: true,
          type: "error",
          message: "Username already taken",
        });

        return;
      }

      if (data.status === "PHONENUMBER_DUPLICATE") {
        setPopup({
          open: true,
          type: "error",
          message: "Phonenumber already taken",
        });

        return;
      }

      if (data.status === "CREATED") {
        if (!data.accessToken) {
          setPopup({
            open: true,
            type: "error",
            message: "Register success but token not found. Please login again.",
          });
          return;
        }

        localStorage.setItem("accessToken", data.accessToken);

        const user = {
          uuid: data.user?.uuid || "",
          lineUserId: data.user?.lineUserId || "",
          username: data.user?.username || "",
          phone: data.user?.phone || "",
          team: data.user?.team || "",
          name: data.user?.name || "",
          address: data.user?.address || "",
          active: Number(data.user?.active || 0),
        };

        setUser(user);

        if (validateUser) {
          await validateUser();
        }

        sessionStorage.removeItem("tempUser");

        setPopup({
          open: true,
          type: "success",
          message: "Register success!",
        });

        setTimeout(() => {
          router.replace("/project");
        }, 1200);
      }
    } catch (err) {
      console.error(err);

      setPopup({
        open: true,
        type: "error",
        message: "Register failed",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {loading && <LoadingOverlay />}

      <Popup
        open={popup.open}
        type={popup.type}
        message={popup.message}
        onClose={() => setPopup({ ...popup, open: false })}
      />

      <main className="max-w-5xl mx-auto px-6 py-4 md:max-w-3xl">
        <SectionBack onclick={() => router.replace("/")} title={"Register"} />

        <section className="rounded-md bg-white shadow-sm p-4">
          <div className="flex justify-center">
            <span className="px-3 py-2 rounded-full bg-pinkAccent text-sm font-semibold">
              🍒 New Member
            </span>
          </div>

          <form onSubmit={handleSubmit} className="mt-4">
            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-12 md:col-span-6 flex flex-col gap-1">
                <div>
                  <span className="font-semibold">Username</span>
                  <span className="text-red-500">*</span>
                </div>

                <input
                  type="text"
                  id="username"
                  className="px-4 py-2 bg-pinkAccent/60 rounded-lg outline-none border-none"
                  maxLength={50}
                  autoComplete="off"
                  required
                  value={form.username}
                  onChange={(e) =>
                    setForm({ ...form, username: e.target.value })
                  }
                />
              </div>

              <div className="col-span-12 md:col-span-6 flex flex-col gap-1">
                <div>
                  <span className="font-semibold">Phonenumber</span>
                  <span className="text-red-500">*</span>
                </div>

                <input
                  type="text"
                  id="phone"
                  className="px-4 py-2 bg-pinkAccent/60 rounded-lg outline-none border-none"
                  maxLength={10}
                  autoComplete="off"
                  required
                  value={phone}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  onPaste={handlePaste}
                  inputMode="numeric"
                />
              </div>

              <div className="col-span-12 flex flex-col gap-1 mb-2">
                <div>
                  <span className="font-semibold">Pick your team</span>
                  <span className="text-red-500">*</span>
                </div>

                <ButtonTeam
                  name="team"
                  options={registerTeamOptions}
                  value={form.team}
                  onChange={(val) => setForm({ ...form, team: val })}
                />
              </div>

              <div className="col-span-12 md:col-span-6 flex flex-col gap-1">
                <div>
                  <span className="font-semibold">Shipping Name</span>
                  <span className="text-red-500">*</span>
                </div>

                <input
                  type="text"
                  id="name"
                  required
                  className="px-4 py-2 bg-pinkAccent/60 rounded-lg outline-none border-none"
                  autoComplete="off"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="col-span-12 flex flex-col gap-1">
                <div>
                  <span className="font-semibold">Address</span>
                  <span className="text-red-500">*</span>
                </div>

                <textarea
                  id="address"
                  rows={3}
                  required
                  className="px-4 py-2 bg-pinkAccent/60 rounded-lg outline-none border-none"
                  autoComplete="off"
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                />
              </div>

              <div className="col-span-12">
                <button
                  type="submit"
                  className="px-4 py-2 bg-pinkSecondary/80 text-white rounded-lg w-full mt-5"
                >
                  Register
                </button>
              </div>
            </div>
          </form>
        </section>

        <SectionContact />
      </main>
    </>
  );
}