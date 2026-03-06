"use client";

import { useEffect } from "react";

// layout.tsx 에 <SwRegister /> 한 줄 추가하면 끝
export default function SwRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .catch((err) => console.warn("SW registration failed:", err));
    }
  }, []);

  return null;
}