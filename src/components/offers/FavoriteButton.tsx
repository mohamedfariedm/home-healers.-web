"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import ClientAPI from "@/app/api/api";
import { isClientApiError } from "@/lib/client-api-error";
import { localePath } from "@/lib/offers";
import { cn } from "@/lib/utils";

type FavoriteButtonProps = {
  offerId: number;
  locale: string;
  className?: string;
};

export default function FavoriteButton({
  offerId,
  locale,
  className,
}: FavoriteButtonProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { t } = useTranslation("offers");
  const [on, setOn] = useState(false);
  const [pending, setPending] = useState(false);

  async function toggle(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (pending) return;

    const callbackUrl = encodeURIComponent(
      typeof window !== "undefined"
        ? window.location.pathname + window.location.search
        : localePath(locale, "/offers"),
    );

    if (status !== "authenticated" || !session?.user?.id) {
      router.push(localePath(locale, `/login?callbackUrl=${callbackUrl}`));
      return;
    }

    const prev = on;
    setOn(!prev);
    setPending(true);
    try {
      await ClientAPI.toggleFavorite(offerId, locale, session.user.id);
    } catch (error) {
      setOn(prev);
      if (isClientApiError(error) && error.status === 401) {
        router.push(localePath(locale, `/login?callbackUrl=${callbackUrl}`));
        return;
      }
      toast.error(t("error"));
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      aria-pressed={on}
      aria-label={on ? t("unfavorite") : t("favorite")}
      className={cn(
        "absolute top-3 end-3 z-10 flex size-10 items-center justify-center rounded-full bg-white/95 text-[#143087] shadow-sm transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        className,
      )}
    >
      <Heart
        className={cn("size-5", on && "fill-red-500 text-red-500")}
        aria-hidden
      />
    </button>
  );
}
