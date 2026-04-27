"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type PopupType = "success" | "error";

export default function useAuthGuard() {
  const searchParams = useSearchParams();

  const [popup, setPopup] = useState({
    open: false,
    type: "error" as PopupType,
    message: "",
  });

  useEffect(() => {
    const error = searchParams.get("error");

    if (error) {
      setPopup({
        open: true,
        type: "error",
        message: "Access denied!",
      });
    }

  }, [searchParams]);

  return {
    popup,
    setPopup,
  };
}