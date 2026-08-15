"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Search, SlidersHorizontal, X } from "lucide-react";
import ClientAPI from "@/app/api/api";
import type { Category } from "@/types/booking";
import type {
  OfferCard as OfferCardType,
  OffersListQuery,
  OffersPaginator,
} from "@/types/offers";
import {
  buildOffersListPath,
  getPaginator,
  localePath,
  localizedName,
} from "@/lib/offers";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import OfferCard, { OfferCardSkeleton } from "./OfferCard";
import FeaturedOfferBanner from "./FeaturedOfferBanner";
import OffersFiltersPanel, {
  countActiveOfferFilters,
  parseSessionFilters,
} from "./OffersFiltersPanel";

type OffersListingClientProps = {
  locale: string;
  initialQuery: OffersListQuery;
  initialOffers: OfferCardType[];
  initialMeta: OffersPaginator;
  initialServerTime?: string;
  featured?: OfferCardType | null;
  categories: Category[];
  fetchError?: boolean;
};

const SORTS = [
  "featured",
  "best_seller",
  "highest_discount",
  "newest",
  "price_asc",
  "price_desc",
] as const;

export default function OffersListingClient({
  locale,
  initialQuery,
  initialOffers,
  initialMeta,
  initialServerTime,
  featured,
  categories,
  fetchError = false,
}: OffersListingClientProps) {
  const { t } = useTranslation("offers");
  const router = useRouter();
  const [query, setQuery] = useState<OffersListQuery>(initialQuery);
  const [offers, setOffers] = useState(initialOffers);
  const [meta, setMeta] = useState(initialMeta);
  const [serverTime, setServerTime] = useState(initialServerTime);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(String(initialQuery.name || ""));
  const [filtersOpen, setFiltersOpen] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const skipFirstSearch = useRef(true);

  useEffect(() => {
    setQuery(initialQuery);
    setOffers(initialOffers);
    setMeta(initialMeta);
    setServerTime(initialServerTime);
    setSearch(String(initialQuery.name || ""));
  }, [initialQuery, initialOffers, initialMeta, initialServerTime]);

  async function fetchOffers(
    next: OffersListQuery,
    { scroll } = { scroll: false },
  ) {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    try {
      const res = await ClientAPI.getPackages(locale, next, {
        signal: controller.signal,
        noCache: true,
      });
      if (controller.signal.aborted) return;
      setOffers(res?.data ?? []);
      setMeta(getPaginator(res));
      setServerTime(res?.server_time);
      router.replace(buildOffersListPath(locale, next), { scroll: false });
      if (scroll) window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      if ((error as { name?: string })?.name === "AbortError") return;
      toast.error(t("error"));
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }

  function updateQuery(
    patch: Partial<OffersListQuery>,
    options?: { scroll?: boolean },
  ) {
    const next: OffersListQuery = {
      ...query,
      ...patch,
      type: "offer",
      limit: 20,
      page: patch.page ?? 1,
    };
    Object.entries(patch).forEach(([key, value]) => {
      if (value === undefined || value === "" || value === null) {
        delete (next as Record<string, unknown>)[key];
      }
    });
    setQuery(next);
    void fetchOffers(next, { scroll: options?.scroll ?? false });
  }

  useEffect(() => {
    if (skipFirstSearch.current) {
      skipFirstSearch.current = false;
      return;
    }
    const handle = window.setTimeout(() => {
      const name = search.trim();
      if (name === String(query.name || "")) return;
      updateQuery({ name: name || undefined });
    }, 400);
    return () => window.clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const chips = useMemo(() => {
    const items: { key: string; label: string; clear: Partial<OffersListQuery> }[] =
      [];
    if (query.name) {
      items.push({
        key: "name",
        label: t("searchChip", { query: query.name }),
        clear: { name: undefined },
      });
    }
    if (query.category_id) {
      const category = categories.find(
        (item) => String(item.id) === String(query.category_id),
      );
      items.push({
        key: "category_id",
        label: localizedName(category?.name, locale) || String(query.category_id),
        clear: { category_id: undefined },
      });
    }
    if (query.price_min != null || query.price_max != null) {
      const min = query.price_min ?? 0;
      const max = query.price_max ?? "∞";
      items.push({
        key: "price",
        label: t("priceChip", { min, max, currency: t("currency") }),
        clear: { price_min: undefined, price_max: undefined },
      });
    }
    parseSessionFilters(query.sessions_count).forEach((count) => {
      items.push({
        key: `sessions-${count}`,
        label: t("sessions", { count }),
        clear: {
          sessions_count:
            parseSessionFilters(query.sessions_count)
              .filter((item) => item !== count)
              .join(",") || undefined,
        },
      });
    });
    if (query.has_discount) {
      items.push({
        key: "has_discount",
        label: t("hasDiscount"),
        clear: { has_discount: undefined },
      });
    }
    if (query.is_best_seller) {
      items.push({
        key: "is_best_seller",
        label: t("flags.best_seller"),
        clear: { is_best_seller: undefined },
      });
    }
    if (query.is_most_popular) {
      items.push({
        key: "is_most_popular",
        label: t("flags.most_popular"),
        clear: { is_most_popular: undefined },
      });
    }
    if (query.is_new) {
      items.push({
        key: "is_new",
        label: t("flags.new"),
        clear: { is_new: undefined },
      });
    }
    if (query.is_featured) {
      items.push({
        key: "is_featured",
        label: t("filterFeatured"),
        clear: { is_featured: undefined },
      });
    }
    return items;
  }, [query, categories, locale, t]);

  function resetFilters() {
    setSearch("");
    const next: OffersListQuery = {
      type: "offer",
      limit: 20,
      page: 1,
      sort: query.sort,
    };
    setQuery(next);
    void fetchOffers(next);
  }

  const filterCount = countActiveOfferFilters(query);
  const resultsCount = meta.total ?? offers.length;
  const emptyKind = !offers.length
    ? query.name && filterCount === 0
      ? "search"
      : query.category_id && filterCount === 1 && !query.name
        ? "category"
        : filterCount > 0 || query.name
          ? "filters"
          : Number(query.page) > 1
            ? "page"
            : "none"
    : null;

  function renderFilterPanel() {
    return (
      <OffersFiltersPanel
        locale={locale}
        query={query}
        categories={categories}
        onChange={(patch) => updateQuery(patch)}
        onReset={resetFilters}
      />
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 pb-16">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute top-1/2 start-3 size-4 -translate-y-1/2 text-[#4a5568]" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="h-12 rounded-2xl border-[#d7e4f8] bg-[#f8fbff] ps-10"
          />
          {search ? (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                updateQuery({ name: undefined });
              }}
              className="absolute top-1/2 end-3 -translate-y-1/2 rounded-full p-1 text-[#4a5568] hover:bg-white"
              aria-label={t("clearSearch")}
            >
              <X className="size-4" />
            </button>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <div className="lg:hidden">
            <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="relative h-12 gap-2 rounded-2xl">
                  <SlidersHorizontal className="size-4" />
                  {t("filters")}
                  {filterCount > 0 ? (
                    <span className="flex min-w-5 items-center justify-center rounded-full bg-[#143087] px-1.5 text-[11px] font-bold text-white">
                      {filterCount}
                    </span>
                  ) : null}
                </Button>
              </SheetTrigger>
              <SheetContent
                side="bottom"
                className="max-h-[88vh] overflow-y-auto rounded-t-3xl"
              >
                <SheetHeader>
                  <SheetTitle>{t("filters")}</SheetTitle>
                </SheetHeader>
                <div className="px-4 pb-8">{renderFilterPanel()}</div>
              </SheetContent>
            </Sheet>
          </div>
          <Select
            value={String(query.sort || "featured")}
            onValueChange={(value) => updateQuery({ sort: value })}
          >
            <SelectTrigger
              className="h-12 min-w-[190px] rounded-2xl border-[#d7e4f8]"
              aria-label={t("sort")}
            >
              <SelectValue placeholder={t("sort")} />
            </SelectTrigger>
            <SelectContent>
              {SORTS.map((sort) => (
                <SelectItem key={sort} value={sort}>
                  {t(`sortOptions.${sort}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="-mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <a
          href={buildOffersListPath(locale, { ...query, category_id: undefined, page: 1 })}
          onClick={(event) => {
            if (event.metaKey || event.ctrlKey) return;
            event.preventDefault();
            updateQuery({ category_id: undefined });
          }}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
            !query.category_id
              ? "bg-[#143087] text-white"
              : "bg-[#eef4ff] text-[#143087] hover:bg-[#dbeafe]"
          }`}
        >
          {t("allCategories")}
        </a>
        {categories.map((category) => {
          const active = String(query.category_id) === String(category.id);
          const href = buildOffersListPath(locale, {
            ...query,
            category_id: active ? undefined : category.id,
            page: 1,
          });
          return (
            <a
              key={category.id}
              href={href}
              onClick={(event) => {
                if (event.metaKey || event.ctrlKey) return;
                event.preventDefault();
                updateQuery({
                  category_id: active ? undefined : category.id,
                });
              }}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
                active
                  ? "bg-[#143087] text-white"
                  : "bg-[#eef4ff] text-[#143087] hover:bg-[#dbeafe]"
              }`}
            >
              {localizedName(category.name, locale)}
            </a>
          );
        })}
      </div>

      {featured?.slug ? (
        <div className="mt-8 overflow-hidden rounded-3xl">
          <FeaturedOfferBanner offer={featured} locale={locale} />
        </div>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[#4a5568]" aria-live="polite">
          {t("resultsCount", { count: resultsCount })}
        </p>
        {chips.length > 0 ? (
          <button
            type="button"
            onClick={resetFilters}
            className="text-sm font-semibold text-primary hover:underline lg:hidden"
          >
            {t("clearAll")}
          </button>
        ) : null}
      </div>

      {chips.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {chips.map((chip) => (
            <button
              key={chip.key}
              type="button"
              className="inline-flex items-center gap-1.5 rounded-full border border-[#d7e4f8] bg-white px-3 py-1.5 text-sm text-[#143087] hover:border-[#143087]"
              aria-label={t("removeFilter", { label: chip.label })}
              onClick={() => {
                if (chip.key === "name") setSearch("");
                updateQuery(chip.clear);
              }}
            >
              {chip.label}
              <X className="size-3.5" aria-hidden />
            </button>
          ))}
        </div>
      ) : null}

      <div className="mt-8 grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="hidden lg:sticky lg:top-24 lg:block lg:self-start">
          <div className="rounded-3xl border border-[#e4edfb] bg-[#f8fbff] p-5">
            {renderFilterPanel()}
          </div>
        </aside>

        <div>
          {fetchError && !offers.length ? (
            <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center">
              <p className="mb-3 text-[#1e1e1e]">{t("error")}</p>
              <Button type="button" onClick={() => void fetchOffers(query)}>
                {t("retry")}
              </Button>
            </div>
          ) : loading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <OfferCardSkeleton key={index} />
              ))}
            </div>
          ) : emptyKind ? (
            <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center">
              <p className="mb-4 text-lg text-[#1e1e1e]">
                {emptyKind === "search"
                  ? t("empty.search", { query: query.name })
                  : t(`empty.${emptyKind}`)}
              </p>
              {emptyKind === "search" ? (
                <Button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    updateQuery({ name: undefined });
                  }}
                >
                  {t("clearSearch")}
                </Button>
              ) : emptyKind === "filters" || emptyKind === "category" ? (
                <Button type="button" onClick={resetFilters}>
                  {t("resetFilters")}
                </Button>
              ) : emptyKind === "page" ? (
                <a
                  href={buildOffersListPath(locale, { ...query, page: 1 })}
                  className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-white"
                >
                  {t("backToPage1")}
                </a>
              ) : (
                <a
                  href={localePath(locale, "/our-services")}
                  className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-white"
                >
                  {t("browseServices")}
                </a>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {offers.map((offer, index) => (
                <OfferCard
                  key={offer.id}
                  offer={offer}
                  locale={locale}
                  serverTime={serverTime}
                  priority={index < 4}
                />
              ))}
            </div>
          )}

          {meta.last_page > 1 ? (
            <nav
              aria-label={t("pagination.page", { page: meta.current_page })}
              className="mt-10 flex flex-wrap items-center justify-center gap-2"
            >
              {meta.current_page > 1 ? (
                <a
                  href={buildOffersListPath(locale, {
                    ...query,
                    page: meta.current_page - 1,
                  })}
                  className="rounded-lg border px-3 py-2 text-sm"
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                >
                  {t("pagination.prev")}
                </a>
              ) : null}
              {Array.from({ length: meta.last_page }, (_, index) => index + 1)
                .filter(
                  (page) =>
                    page === 1 ||
                    page === meta.last_page ||
                    Math.abs(page - meta.current_page) <= 1,
                )
                .map((page, index, arr) => {
                  const prev = arr[index - 1];
                  return (
                    <span key={page} className="flex items-center gap-2">
                      {prev && page - prev > 1 ? (
                        <span className="px-1 text-[#4a5568]">…</span>
                      ) : null}
                      <a
                        href={buildOffersListPath(locale, { ...query, page })}
                        aria-current={
                          page === meta.current_page ? "page" : undefined
                        }
                        className={`rounded-lg px-3 py-2 text-sm ${
                          page === meta.current_page
                            ? "bg-[#143087] text-white"
                            : "border"
                        }`}
                      >
                        {page}
                      </a>
                    </span>
                  );
                })}
              {meta.current_page < meta.last_page ? (
                <a
                  href={buildOffersListPath(locale, {
                    ...query,
                    page: meta.current_page + 1,
                  })}
                  className="rounded-lg border px-3 py-2 text-sm"
                >
                  {t("pagination.next")}
                </a>
              ) : null}
            </nav>
          ) : null}
        </div>
      </div>
    </div>
  );
}
