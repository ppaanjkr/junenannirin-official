import { getThemeColors } from "@/lib/theme";
import type { ActiveProjectData } from "@/lib/api/types";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import SectionProject from "./SectionProject";
import SectionItems from "./SectionItems";
import SectionPlaceOrder from "./SectionPlaceOrder";
import { useUserPurchaseSummary } from "@/hooks/useProfile";
import SectionPurchaseSummary from "./SectionPurchaseSummary";
import LoadingOverlay from "../LoadingOverlay";

export default function ActiveShop({
  data,
  user,
}: {
  data: ActiveProjectData;
  user: any;
}) {
  const router = useRouter();
  const clearedRef = useRef(false);

  const { project, rewards, bank } = data;
  const [canPlaceOrder, setCanPlaceOrder] = useState(false);

  const { shopSummary, isLoading } = useUserPurchaseSummary(
    project.id.toString(),
  );

  useEffect(() => {
    if (!project) return;

    localStorage.setItem(
      "project",
      JSON.stringify({
        id: project.id,
        name: project.name,
        theme_color: project.theme_color,
        bank_name: bank.bank_name || "",
        bank_short_name: bank.bank_short_name || "",
        account_name: bank.account_name || "",
        account_name_en: bank.account_name_en || "",
        account_no: bank.account_no || "",
        qrcode: bank.qrcode || "",
      }),
    );

    const end = project.end_date ? new Date(`${project.end_date}T23:59:59`).getTime() : null;

    const isExpired = end !== null && end < Date.now();

    setCanPlaceOrder(!isExpired);


    if (isExpired && !clearedRef.current) {
      clearedRef.current = true;

      localStorage.removeItem("cart");
      localStorage.removeItem("fc_cart");
      localStorage.removeItem("fc_order");
    }
  }, [project]);

  const [projectData, setProjectData] = useState<any>(null);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("project");

      if (raw) {
        setProjectData(JSON.parse(raw));
      }
    } catch {
      setProjectData(null);
    }
  }, []);
  const theme = getThemeColors(project.theme_color);

  const [cart, setCart] = useState<Record<number, number>>(() => {
    if (typeof window === "undefined") return {};

    const saved = localStorage.getItem("cart");

    try {
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // action
  function inc(id: number) {
    if (!canPlaceOrder) return;
    setCart((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  }
  function dec(id: number) {
    if (!canPlaceOrder) return;
    setCart((prev) => {
      const newCart = { ...prev };

      if (!newCart[id]) return newCart;

      newCart[id] -= 1;

      if (newCart[id] <= 0) {
        delete newCart[id];
      }

      return newCart;
    });
  }

  // total
  const total = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = rewards.find((r) => r.id === Number(id));
    if (!item) return sum;

    return sum + (item.min_amount || 0) * qty;
  }, 0);
  const count = Object.values(cart).reduce((a, b) => a + b, 0);

  // order
  function buildOrder() {
    return Object.entries(cart)
      .map(([id, qty]) => {
        const item = rewards.find((r) => r.id === Number(id));
        if (!item) return null;

        return {
          id: item.id,
          name: item.title,
          price: item.min_amount || 0,
          img: item.image_url || "",
          qty,
        };
      })
      .filter(Boolean);
  }
  function handleCheckout() {
    const order = buildOrder();

    if (!order.length) return;

    localStorage.setItem("fc_order", JSON.stringify(order));

    // กัน project ซ้อน
    localStorage.setItem("fc_project", String(project.id));

    // redirect
    // window.location.href = "/project/payment";
    router.replace("/project/payment");
  }

  return (
    <>
      {isLoading && <LoadingOverlay />}
      <SectionProject data={data} theme={theme} />
      {user && (
        <SectionPurchaseSummary data={shopSummary} theme={theme} user={user} />
      )}
      <SectionItems
        data={rewards}
        theme={theme}
        user={user}
        cart={cart}
        inc={inc}
        dec={dec}
        canPlaceOrder={canPlaceOrder}
      />
      {user && canPlaceOrder && (
        <SectionPlaceOrder
          theme={theme}
          total={total}
          count={count}
          cart={cart}
          onCheckout={handleCheckout}
        />
      )}
    </>
  );
}
