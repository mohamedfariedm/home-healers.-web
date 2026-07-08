"use client";

import { SessionProvider } from "next-auth/react";

type props = {
  children: React.ReactNode;
};

export default function ClientComponentsAuthSessionProvider({
  children,
}: props) {
  return <SessionProvider>{children}</SessionProvider>;
}
