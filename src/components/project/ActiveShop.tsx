"use client";

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
// import { getEndTime } from "@/lib/workUtils";

type CartSelection = {
  reward_item_id: string;
  item_name: string;
  option_name: string;
  selected_option: string;
  qty: number;
};

type CartLine = {
  reward_id: string;
  title: string;
  price: number;
  img: string;
  qty: number;
  selections: CartSelection[];
};

export default function ActiveShop({
  data,
  user,
  previewMode = false,
}: {
  data: ActiveProjectData;
  user: any;
  previewMode?: boolean;
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

    if (!previewMode) {
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
    }

    if (previewMode) {
      setCanPlaceOrder(false);
      return;
    }

    const status = String(project.status || "").toLowerCase();

    const getStartTime = (value: any): number | null => {
      if (!value) return null;

      const date = new Date(value);
      if (isNaN(date.getTime())) return null;

      date.setHours(0, 0, 0, 0);
      return date.getTime();
    };

    const getEndTime = (value: any): number | null => {
      if (!value) return null;

      const date = new Date(value);
      if (isNaN(date.getTime())) return null;

      date.setHours(23, 59, 59, 999);
      return date.getTime();
    };

    const now = Date.now();

    const start = getStartTime(project.start_date);
    const end = getEndTime(project.end_date);

    const isOpen = status === "open";
    const isNotStarted = start !== null && now < start;
    const isExpired = end !== null && now > end;

    const canOrder = isOpen && !isNotStarted && !isExpired;

    setCanPlaceOrder(canOrder);

    // ล้าง cart ถ้า order ไม่ได้แล้ว
    if (!canOrder && !clearedRef.current) {
      clearedRef.current = true;

      localStorage.removeItem("cart");
      localStorage.removeItem("fc_cart");
      localStorage.removeItem("fc_order");
    }
  }, [project, bank, previewMode]);

  const theme = getThemeColors(project.theme_color);

  const [cart, setCart] = useState<Record<string, CartLine>>(() => {
    if (typeof window === "undefined") return {};

    if (previewMode) return {};

    const saved = localStorage.getItem("cart");

    try {
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    if (previewMode) return;

    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart, previewMode]);

  // =====================================================
  // CART KEY
  // ใช้ option_name + selected_option แทน selected_size
  // =====================================================

  function buildCartKey(rewardId: string, selections: CartSelection[]) {
    const optionPart = selections
      .map((s) => `${s.reward_item_id}:${s.option_name}:${s.selected_option}`)
      .sort()
      .join("|");

    return optionPart ? `${rewardId}|${optionPart}` : rewardId;
  }

  // =====================================================
  // INC
  // =====================================================

  function inc(reward: any, selections: CartSelection[]) {
    if (previewMode) return;
    if (!canPlaceOrder) return;

    const rewardId = String(reward.id);
    const key = buildCartKey(rewardId, selections);

    setCart((prev) => {
      const oldLine = prev[key];

      return {
        ...prev,
        [key]: {
          reward_id: rewardId,
          title: reward.title,
          price: Number(reward.min_amount || 0),
          img: reward.image_url || "",
          qty: (oldLine?.qty || 0) + 1,
          selections,
        },
      };
    });
  }

  // =====================================================
  // DEC
  // =====================================================

  function dec(reward: any, selections: CartSelection[]) {
    if (previewMode) return;
    if (!canPlaceOrder) return;

    const rewardId = String(reward.id);
    const key = buildCartKey(rewardId, selections);

    setCart((prev) => {
      const oldLine = prev[key];

      if (!oldLine) return prev;

      const newCart = { ...prev };

      if (oldLine.qty <= 1) {
        delete newCart[key];
      } else {
        newCart[key] = {
          ...oldLine,
          qty: oldLine.qty - 1,
        };
      }

      return newCart;
    });
  }

  // =====================================================
  // TOTAL
  // =====================================================

  const total = Object.values(cart).reduce((sum, line) => {
    return sum + line.price * line.qty;
  }, 0);

  const count = Object.values(cart).reduce((sum, line) => {
    return sum + line.qty;
  }, 0);

  // =====================================================
  // BUILD ORDER
  // ตรงนี้สำคัญ: selection.qty ต้องคูณ line.qty
  // เพราะ GAS จะเอาไปบันทึก UserRewardItemSelections
  // =====================================================

  function buildOrder() {
    return Object.values(cart).map((line) => ({
      id: line.reward_id,
      name: line.title,
      price: line.price,
      img: line.img,
      qty: line.qty,
      selections: line.selections.map((selection) => ({
        reward_item_id: selection.reward_item_id,
        item_name: selection.item_name,
        option_name: selection.option_name,
        selected_option: selection.selected_option,
        qty: Number(selection.qty || 1) * Number(line.qty || 1),
      })),
    }));
  }

  function handleCheckout() {
    if (previewMode) return;

    const order = buildOrder();

    if (!order.length) return;

    localStorage.setItem("fc_order", JSON.stringify(order));

    // กัน project ซ้อน
    localStorage.setItem("fc_project", String(project.id));

    router.replace("/project/payment");
  }

  return (
    <>
      {!previewMode && isLoading && <LoadingOverlay />}

      <SectionProject data={data} theme={theme} />

      {!previewMode && user && (
        <SectionPurchaseSummary data={shopSummary} theme={theme} user={user} />
      )}

      <SectionItems
        data={rewards}
        theme={theme}
        user={user}
        cart={cart}
        inc={inc}
        dec={dec}
        canPlaceOrder={!previewMode && canPlaceOrder}
        previewMode={previewMode}
      />

      {previewMode && (
        <SectionPlaceOrder
          theme={theme}
          total={0}
          count={0}
          cart={{}}
          onCheckout={handleCheckout}
          previewMode={previewMode}
        />
      )}

      {!previewMode && user && canPlaceOrder && (
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
