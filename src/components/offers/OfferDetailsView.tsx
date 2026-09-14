"use client";

import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import type { OfferDetails } from "@/types/offers";
import RichText from "@/components/ui/RichText";
import {
  bookingHref,
  formatOfferNumber,
  isListEmpty,
  isRichTextEmpty,
  localePath,
  localizedName,
  OFFERS_WEBSITE_BASE_PATH,
  resolveOfferImageUrl,
  toNumber,
} from "@/lib/offers";
import OfferGallery from "./OfferGallery";
import OfferRating from "./OfferRating";
import OfferPriceBlock from "./OfferPriceBlock";
import OfferCountdown from "./OfferCountdown";
import OfferShare from "./OfferShare";
import OfferFaqAccordion from "./OfferFaq";
import OfferReviews from "./OfferReviews";
import RelatedOffers from "./RelatedOffers";
import StickyBookingBar from "./StickyBookingBar";
import { Check } from "lucide-react";

type OfferDetailsViewProps = {
  offer: OfferDetails;
  locale: string;
  serverTime?: string;
  canonicalUrl: string;
};

function ChipList({ items, title }: { items: string[]; title: string }) {
  return (
    <section>
      <h2 className="mb-3 text-xl font-semibold text-[#143087] sm:text-2xl">{title}</h2>
      <ul className="flex flex-wrap gap-2">
        {items.map((item) => (
          <li
            key={item}
            className="max-w-full break-words rounded-full bg-[#eef4ff] px-3 py-1.5 text-sm text-[#143087]"
          >
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

function CheckList({ items, title }: { items: string[]; title: string }) {
  return (
    <section>
      <h2 className="mb-3 text-xl font-semibold text-[#143087] sm:text-2xl">{title}</h2>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-[#1e1e1e]">
            <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
            <span className="min-w-0 break-words">{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function OfferDetailsView({
  offer,
  locale,
  serverTime,
  canonicalUrl,
}: OfferDetailsViewProps) {
  const { t } = useTranslation("offers");
  const [ended, setEnded] = useState(false);
  const onEnded = useCallback((value: boolean) => setEnded(value), []);
  const bookHref = bookingHref(locale, offer.id);
  const discount = toNumber(offer.discount_percentage);
  const sessions = toNumber(offer.sessions_count);
  const booked = toNumber(offer.booked_count);
  const gallery = [
    resolveOfferImageUrl(offer.cover_image) || resolveOfferImageUrl(offer.image),
    ...(offer.gallery_images || [])
      .map((image) => resolveOfferImageUrl(image))
      .filter(Boolean),
  ].filter((src, index, arr) => src && arr.indexOf(src) === index);

  const category = offer.categories?.[0];
  const categoryName = category
    ? localizedName(category.name, locale)
    : "";

  const infoCards = [
    sessions ? { label: t("sessions", { count: sessions }), value: true } : null,
    offer.visit_duration
      ? { label: t("visitDuration"), value: offer.visit_duration }
      : null,
    offer.location_type
      ? { label: t("locationType"), value: offer.location_type }
      : null,
    toNumber(offer.validity_days)
      ? {
          label: t("validityDays", { count: toNumber(offer.validity_days) as number }),
          value: true,
        }
      : null,
  ].filter(Boolean) as { label: string; value: string | true }[];

  const ctaClass =
    "inline-flex h-12 items-center justify-center rounded-xl px-6 font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";

  return (
    <div className="mx-auto w-full min-w-0 max-w-[1440px] overflow-x-hidden px-4 pb-28 sm:px-6 lg:pb-16">
      <nav aria-label="Breadcrumb" className="py-4 text-sm text-[#4a5568] sm:py-6">
        <ol className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
          <li>
            <a href={localePath(locale, "/")} className="hover:text-primary">
              {t("breadcrumb.home")}
            </a>
          </li>
          <li aria-hidden className="rtl:rotate-180">›</li>
          <li>
            <a href={localePath(locale, OFFERS_WEBSITE_BASE_PATH)} className="hover:text-primary">
              {t("breadcrumb.offers")}
            </a>
          </li>
          {categoryName && category ? (
            <>
              <li aria-hidden className="rtl:rotate-180">›</li>
              <li>
                <a
                  href={`${localePath(locale, OFFERS_WEBSITE_BASE_PATH)}?category_id=${category.id}`}
                  className="hover:text-primary"
                >
                  {categoryName}
                </a>
              </li>
            </>
          ) : null}
          <li aria-hidden className="rtl:rotate-180">›</li>
          <li
            aria-current="page"
            className="min-w-0 max-w-full basis-full truncate font-medium text-[#1e1e1e] sm:basis-auto sm:max-w-[min(100%,28rem)] sm:whitespace-normal sm:break-words"
          >
            {offer.name}
          </li>
        </ol>
      </nav>

      <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)] lg:gap-10">
        <div className="flex min-w-0 flex-col gap-6 sm:gap-8 lg:gap-10">
          <OfferGallery
            images={gallery}
            alt={offer.name}
            label={t("gallery")}
          />

          <div className="lg:hidden">
            <OfferSummary
              offer={offer}
              locale={locale}
              t={t}
              discount={discount}
              booked={booked}
              ended={ended}
              onEnded={onEnded}
              serverTime={serverTime}
              bookHref={bookHref}
              canonicalUrl={canonicalUrl}
              ctaClass={ctaClass}
              isPageHeading
            />
          </div>

          {!isListEmpty(offer.highlights) ? (
            <ChipList items={offer.highlights!} title={t("highlights")} />
          ) : null}
          {!isListEmpty(offer.package_includes) ? (
            <CheckList items={offer.package_includes!} title={t("includes")} />
          ) : null}
          {!isListEmpty(offer.suitable_conditions) ? (
            <ChipList items={offer.suitable_conditions!} title={t("suitable")} />
          ) : null}

          {infoCards.length > 0 || !isRichTextEmpty(offer.cancellation_policy) ? (
            <section>
              {infoCards.length > 0 ? (
                <div className="grid grid-cols-1 gap-2 xs:grid-cols-2 sm:gap-3 md:grid-cols-4">
                  {infoCards.map((card) => (
                    <div
                      key={card.label}
                      className="break-words rounded-2xl bg-[#eef4ff] p-3 text-xs font-medium text-[#143087] sm:p-4 sm:text-sm"
                    >
                      {card.value === true ? card.label : (
                        <>
                          <p className="mb-1 text-xs text-[#4a5568]">{card.label}</p>
                          <p>{card.value}</p>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ) : null}
              {!isRichTextEmpty(offer.cancellation_policy) ? (
                <div className="mt-4">
                  <h3 className="mb-2 text-lg font-semibold text-[#143087]">
                    {t("cancellation")}
                  </h3>
                  <RichText html={offer.cancellation_policy} />
                </div>
              ) : null}
            </section>
          ) : null}

          {!isRichTextEmpty(offer.why_choose_home_healers) ? (
            <section>
              <h2 className="mb-3 text-xl font-semibold text-[#143087] sm:text-2xl">
                {t("whyChoose")}
              </h2>
              <RichText html={offer.why_choose_home_healers} />
            </section>
          ) : null}

          {!isListEmpty(offer.patient_journey) ? (
            <section>
              <h2 className="mb-4 text-xl font-semibold text-[#143087] sm:text-2xl">
                {t("journey")}
              </h2>
              <ol className="flex flex-col gap-4">
                {offer.patient_journey!.map((step, index) => (
                  <li key={step} className="flex gap-3">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#143087] text-sm font-bold text-white">
                      {formatOfferNumber(index + 1, locale)}
                    </span>
                    <p className="pt-1 text-[#1e1e1e]">{step}</p>
                  </li>
                ))}
              </ol>
            </section>
          ) : null}

          {!isRichTextEmpty(offer.before_treatment) ||
          !isRichTextEmpty(offer.after_treatment) ? (
            <section className="grid gap-6 md:grid-cols-2">
              {!isRichTextEmpty(offer.before_treatment) ? (
                <div>
                  <h2 className="mb-3 text-xl font-semibold text-[#143087] sm:text-2xl">
                    {t("before")}
                  </h2>
                  <RichText html={offer.before_treatment} />
                </div>
              ) : null}
              {!isRichTextEmpty(offer.after_treatment) ? (
                <div>
                  <h2 className="mb-3 text-xl font-semibold text-[#143087] sm:text-2xl">
                    {t("after")}
                  </h2>
                  <RichText html={offer.after_treatment} />
                </div>
              ) : null}
            </section>
          ) : null}

          {!isRichTextEmpty(offer.benefits) ? (
            <section>
              <h2 className="mb-3 text-xl font-semibold text-[#143087] sm:text-2xl">
                {t("benefits")}
              </h2>
              <RichText html={offer.benefits} />
            </section>
          ) : null}

          {!isRichTextEmpty(offer.description) ? (
            <section>
              <h2 className="mb-3 text-xl font-semibold text-[#143087] sm:text-2xl">
                {t("description")}
              </h2>
              <RichText html={offer.description} />
            </section>
          ) : null}

          {!isRichTextEmpty(offer.terms_conditions) ? (
            <section>
              <h2 className="mb-3 text-xl font-semibold text-[#143087] sm:text-2xl">
                {t("terms")}
              </h2>
              <RichText html={offer.terms_conditions} />
            </section>
          ) : null}

          {!isListEmpty(offer.faqs) ? (
            <OfferFaqAccordion faqs={offer.faqs!} title={t("faq")} />
          ) : null}

          {!isListEmpty(offer.reviews) ? (
            <OfferReviews reviews={offer.reviews!} locale={locale} />
          ) : null}

          <RelatedOffers
            locale={locale}
            offerId={offer.id}
            embedded={offer.related_offers}
          />
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <OfferSummary
              offer={offer}
              locale={locale}
              t={t}
              discount={discount}
              booked={booked}
              ended={ended}
              onEnded={onEnded}
              serverTime={serverTime}
              bookHref={bookHref}
              canonicalUrl={canonicalUrl}
              ctaClass={ctaClass}
              showTitle
            />
          </div>
        </aside>
      </div>

      <StickyBookingBar
        name={offer.name}
        price={offer.price}
        currency={offer.currency}
        locale={locale}
        href={bookHref}
        ended={ended}
      />
    </div>
  );
}

function OfferSummary({
  offer,
  locale,
  t,
  discount,
  booked,
  ended,
  onEnded,
  serverTime,
  bookHref,
  canonicalUrl,
  ctaClass,
  showTitle = true,
  isPageHeading = false,
}: {
  offer: OfferDetails;
  locale: string;
  t: (key: string, opts?: Record<string, unknown>) => string;
  discount: number | null;
  booked: number | null;
  ended: boolean;
  onEnded: (ended: boolean) => void;
  serverTime?: string;
  bookHref: string;
  canonicalUrl: string;
  ctaClass: string;
  showTitle?: boolean;
  isPageHeading?: boolean;
}) {
  const titleClassName =
    "break-words text-2xl font-bold text-[#1e1e1e] sm:text-3xl";

  return (
    <div className="relative flex flex-col gap-4">
      {discount && discount > 0 ? (
        <span className="w-fit rounded-full bg-[#143087] px-3 py-1 text-sm font-semibold text-white">
          {t("off", { percent: Math.round(discount) })}
        </span>
      ) : null}
      {showTitle ? (
        isPageHeading ? (
          <h1 className={titleClassName}>{offer.name}</h1>
        ) : (
          <p className={titleClassName}>{offer.name}</p>
        )
      ) : null}
      <div className="flex flex-wrap items-center gap-3">
        <OfferRating
          rating={offer.display_rating}
          count={offer.display_reviews_count}
          locale={locale}
        />
        {booked ? (
          <span className="text-sm text-[#4a5568]">
            {t("booked", { count: booked })}
          </span>
        ) : null}
      </div>
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
          onEndedChange={onEnded}
        />
      ) : null}
      <div id="book" className="flex flex-wrap gap-3">
        {ended ? (
          <span className={`${ctaClass} w-full bg-gray-100 text-[#4a5568] sm:w-auto`}>
            {t("ended")}
          </span>
        ) : (
          <a href={bookHref} className={`${ctaClass} w-full bg-primary text-white sm:w-auto`}>
            {t("bookNow")}
          </a>
        )}
      </div>
      <OfferShare url={canonicalUrl} title={offer.name} />
    </div>
  );
}
