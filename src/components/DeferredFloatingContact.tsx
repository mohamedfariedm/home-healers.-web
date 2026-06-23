"use client";

import dynamic from "next/dynamic";

const FloatingContact = dynamic(() => import("@/components/FloatingContact"), {
  ssr: false,
});

export default FloatingContact;
