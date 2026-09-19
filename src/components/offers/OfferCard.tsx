"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";
import type { OfferCard as OfferCardType } from "@/types/offers";
import {
  offerBookHref,
  offerDisplayImage,
  offerHref,
  pickOfferFlags,
  toNumber,
} from "@/lib/offers";
import { cn } from "@/lib/utils";
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
  const bookHref = offerBookHref(locale, offer.slug, offer.id);
  const image = offerDisplayImage(offer);
  const discount = toNumber(offer.discount_percentage);
  const flags = pickOfferFlags(offer);
  const sessions = toNumber(offer.sessions_count);
  const booked = toNumber(offer.booked_count);
  const Title = headingLevel;

  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all duration-300 ease-out",
        "hover:-translate-y-1.5 hover:border-[#143087]/20 hover:shadow-[0_18px_40px_rgba(20,48,135,0.14)]",
        compact && "min-w-[240px]",
      )}
    >
      {href ? (
        <a href={href} className="flex flex-1 flex-col">
          <CardBody
            image={image}
            offerName={offer.name}
            compact={compact}
            priority={priority}
            discount={discount}
            t={t}
            flags={flags}
            Title={Title}
            sessions={sessions}
            shortDescription={offer.short_description}
            price={offer.price}
            oldPrice={offer.old_price}
            savingsAmount={offer.savings_amount}
            currency={offer.currency}
            locale={locale}
            endsAt={offer.ends_at}
            serverTime={serverTime}
            displayRating={offer.display_rating}
            displayReviewsCount={offer.display_reviews_count}
            booked={booked}
          />
        </a>
      ) : (
        <div className="flex flex-1 flex-col">
          <CardBody
            image={image}
            offerName={offer.name}
            compact={compact}
            priority={priority}
            discount={discount}
            t={t}
            flags={flags}
            Title={Title}
            sessions={sessions}
            shortDescription={offer.short_description}
            price={offer.price}
            oldPrice={offer.old_price}
            savingsAmount={offer.savings_amount}
            currency={offer.currency}
            locale={locale}
            endsAt={offer.ends_at}
            serverTime={serverTime}
            displayRating={offer.display_rating}
            displayReviewsCount={offer.display_reviews_count}
            booked={booked}
          />
        </div>
      )}
      {href ? (
        <div className="mt-auto grid grid-cols-2 gap-2 p-4 pt-0">
          <a
            href={href}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-[#143087] px-2 text-center text-xs font-semibold text-[#143087] transition-colors duration-200 hover:bg-[#eef4ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:px-3 sm:text-sm"
          >
            {t("viewDetails")}
          </a>
          <a
            href={bookHref}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-2 text-center text-xs font-semibold text-white transition-colors duration-200 hover:bg-[#4f8ae8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:px-3 sm:text-sm"
          >
            {t("bookNow")}
          </a>
        </div>
      ) : null}
    </article>
  );
}

function CardBody({
  image,
  offerName,
  compact,
  priority,
  discount,
  t,
  flags,
  Title,
  sessions,
  shortDescription,
  price,
  oldPrice,
  savingsAmount,
  currency,
  locale,
  endsAt,
  serverTime,
  displayRating,
  displayReviewsCount,
  booked,
}: {
  image: string;
  offerName: string;
  compact: boolean;
  priority: boolean;
  discount: number | null;
  t: (key: string, opts?: Record<string, unknown>) => string;
  flags: ReturnType<typeof pickOfferFlags>;
  Title: "h2" | "h3";
  sessions: number | null;
  shortDescription?: string | null;
  price: string | number;
  oldPrice?: string | number | null;
  savingsAmount?: string | number | null;
  currency?: string | null;
  locale: string;
  endsAt?: string | null;
  serverTime?: string;
  displayRating?: number | null;
  displayReviewsCount?: number | null;
  booked: number | null;
}) {
  return (
    <>
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#eef4ff]">
        {image ? (
          <Image
            src={image}
            alt={offerName}
            fill
            sizes={
              compact
                ? "(max-width: 768px) 70vw, 240px"
                : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1440px) 33vw, 25vw"
            }
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            priority={priority}
            quality={90}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
          />
        ) : (
          <div className="h-full w-full bg-[#dbeafe]" />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
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
        <Title className="line-clamp-2 break-words text-base font-semibold text-[#1e1e1e] transition-colors duration-200 group-hover:text-[#143087]">
          {offerName}
        </Title>
        {sessions ? (
          <p className="text-sm text-[#4a5568]">{t("sessions", { count: sessions })}</p>
        ) : null}
        {shortDescription ? (
          <p className="line-clamp-2 text-sm text-[#4a5568]">{shortDescription}</p>
        ) : null}
        <OfferPriceBlock
          price={price}
          oldPrice={oldPrice}
          savingsAmount={savingsAmount}
          currency={currency}
          locale={locale}
          saveLabel={t("save")}
        />
        {endsAt && serverTime ? (
          <OfferCountdown
            endsAt={endsAt}
            serverTime={serverTime}
            label={(time) => t("endsIn", { time })}
            endedLabel={t("ended")}
            tickMs={60_000}
          />
        ) : null}
        {(toNumber(displayRating) !== null || booked) && (
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
            <OfferRating
              rating={displayRating}
              count={displayReviewsCount}
              locale={locale}
            />
            {booked ? (
              <span className="text-[#4a5568]">{t("booked", { count: booked })}</span>
            ) : null}
          </div>
        )}
      </div>
    </>
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
