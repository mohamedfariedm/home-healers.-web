import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

type props = {
  children: React.ReactNode;
};
export default async function ClientComponentsAuthSessionProvider({
  children,
}: props) {
  const session = await auth();
  return <SessionProvider session={session}>{children} </SessionProvider>;
}
