"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";
import type { OfferCard as OfferCardType } from "@/types/offers";
import {
  offerDisplayImage,
  offerHref,
  pickOfferFlags,
  toNumber,
} from "@/lib/offers";
import { cn } from "@/lib/utils";
import FavoriteButton from "./FavoriteButton";
import OfferCountdown from "./OfferCountdown";
import OfferRating from "./OfferRating";
import OfferPriceBlock from "./OfferPriceBlock";

type OfferCardProps = {
  offer: OfferCardType;
  locale: string;
  serverTime?: string;
  priority?: boolean;
  headingLevel?: "h2" | "h3";
  compact?: boolean;
};

export default function OfferCard({
  offer,
  locale,
  serverTime,
  priority = false,
  headingLevel = "h2",
  compact = false,
}: OfferCardProps) {
  const { t } = useTranslation("offers");
  const href = offer.slug ? offerHref(locale, offer.slug) : "";
  const bookHref = offer.slug ? offerHref(locale, offer.slug, "book") : "";
  const image = offerDisplayImage(offer);
  const discount = toNumber(offer.discount_percentage);
  const flags = pickOfferFlags(offer);
  const sessions = toNumber(offer.sessions_count);
  const booked = toNumber(offer.booked_count);
  const Title = headingLevel;

  const body = (
    <>
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#eef4ff]">
        {image ? (
          <Image
            src={image}
            alt={offer.name}
            fill
            sizes={
              compact
                ? "(max-width: 768px) 70vw, 240px"
                : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1440px) 33vw, 25vw"
            }
            className="object-cover"
            priority={priority}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
          />
        ) : (
          <div className="h-full w-full bg-[#dbeafe]" />
        )}
        {discount && discount > 0 ? (
          <span className="absolute top-3 start-3 rounded-full bg-[#143087] px-3 py-1 text-xs font-semibold text-white">
            {t("off", { percent: Math.round(discount) })}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        {flags.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {flags.map((flag) => (
              <span
                key={flag}
                className="rounded-full bg-[#eef4ff] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#143087]"
              >
                {t(`flags.${flag}`)}
              </span>
            ))}
          </div>
        ) : null}
        <Title className="line-clamp-2 text-base font-semibold text-[#1e1e1e]">
          {offer.name}
        </Title>
        {sessions ? (
          <p className="text-sm text-[#4a5568]">{t("sessions", { count: sessions })}</p>
        ) : null}
        {offer.short_description ? (
          <p className="line-clamp-2 text-sm text-[#4a5568]">
            {offer.short_description}
          </p>
        ) : null}
        <OfferPriceBlock
          price={offer.price}
          oldPrice={offer.old_price}
          savingsAmount={offer.savings_amount}
          currency={offer.currency}
          locale={locale}
          saveLabel={t("save")}
        />
        {offer.ends_at && serverTime ? (
          <OfferCountdown
            endsAt={offer.ends_at}
            serverTime={serverTime}
            label={(time) => t("endsIn", { time })}
            endedLabel={t("ended")}
            tickMs={60_000}
          />
        ) : null}
        {(toNumber(offer.display_rating) !== null || booked) && (
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
            <OfferRating
              rating={offer.display_rating}
              count={offer.display_reviews_count}
              locale={locale}
            />
            {booked ? (
              <span className="text-[#4a5568]">
                {t("booked", { count: booked })}
              </span>
            ) : null}
          </div>
        )}
      </div>
    </>
  );

  if (compact) {
    if (!href) {
      return (
        <article className="flex h-full min-w-[240px] flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
          {body}
        </article>
      );
    }
    return (
      <article className="flex h-full min-w-[240px] flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
        <a href={href} className="flex h-full flex-col">
          {body}
        </a>
      </article>
    );
  }

  return (
    <article className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
      <FavoriteButton offerId={offer.id} locale={locale} />
      {href ? (
        <a href={href} className="flex flex-1 flex-col">
          {body}
        </a>
      ) : (
        <div className="flex flex-1 flex-col">{body}</div>
      )}
      {href ? (
        <div className="mt-auto grid grid-cols-2 gap-2 p-4 pt-0">
          <a
            href={href}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-[#143087] px-3 text-sm font-semibold text-[#143087] hover:bg-[#eef4ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {t("viewDetails")}
          </a>
          <a
            href={bookHref}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-3 text-sm font-semibold text-white hover:bg-[#4f8ae8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {t("bookNow")}
          </a>
        </div>
      ) : null}
    </article>
  );
}

export function OfferCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white",
        className,
      )}
    >
      <div className="aspect-[4/3] w-full animate-pulse bg-[#e5eefc]" />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="h-5 w-3/4 animate-pulse rounded bg-[#e5eefc]" />
        <div className="h-4 w-1/3 animate-pulse rounded bg-[#e5eefc]" />
        <div className="h-10 w-full animate-pulse rounded bg-[#e5eefc]" />
        <div className="h-5 w-1/2 animate-pulse rounded bg-[#e5eefc]" />
      </div>
      <div className="grid grid-cols-2 gap-2 p-4 pt-0">
        <div className="h-10 animate-pulse rounded-xl bg-[#e5eefc]" />
        <div className="h-10 animate-pulse rounded-xl bg-[#e5eefc]" />
      </div>
    </div>
  );
}
