"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { Category } from "@/types/booking";
import type { OffersListQuery } from "@/types/offers";
import { localizedName, toNumber } from "@/lib/offers";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

export const PRICE_SLIDER_MAX = 10000;
export const SESSION_PRESETS = [6, 8, 10, 12, 16, 24];
export const PRICE_PRESETS = [
  { id: "any", min: undefined, max: undefined },
  { id: "under1000", min: undefined, max: 1000 },
  { id: "1000to2500", min: 1000, max: 2500 },
  { id: "2500to5000", min: 2500, max: 5000 },
  { id: "over5000", min: 5000, max: undefined },
] as const;

const FLAG_FILTERS = [
  { key: "has_discount", labelKey: "hasDiscount" },
  { key: "is_best_seller", labelKey: "flags.best_seller" },
  { key: "is_most_popular", labelKey: "flags.most_popular" },
  { key: "is_new", labelKey: "flags.new" },
  { key: "is_featured", labelKey: "filterFeatured" },
] as const;

export function countActiveOfferFilters(query: OffersListQuery) {
  let count = 0;
  if (query.category_id) count += 1;
  if (query.price_min != null || query.price_max != null) count += 1;
  if (query.sessions_count) count += 1;
  for (const flag of FLAG_FILTERS) {
    if (query[flag.key]) count += 1;
  }
  return count;
}

export function parseSessionFilters(value?: string | number) {
  if (value === undefined || value === null || value === "") return [];
  return String(value)
    .split(",")
    .map((part) => Number(part.trim()))
    .filter((n) => Number.isFinite(n) && n > 0);
}

function isPresetActive(
  preset: (typeof PRICE_PRESETS)[number],
  min?: string | number,
  max?: string | number,
) {
  const currentMin = toNumber(min);
  const currentMax = toNumber(max);
  const presetMin = preset.min ?? null;
  const presetMax = preset.max ?? null;
  return currentMin === presetMin && currentMax === presetMax;
}

type OffersFiltersPanelProps = {
  locale: string;
  query: OffersListQuery;
  categories: Category[];
  onChange: (patch: Partial<OffersListQuery>) => void;
  onReset: () => void;
};

export default function OffersFiltersPanel({
  locale,
  query,
  categories,
  onChange,
  onReset,
}: OffersFiltersPanelProps) {
  const { t } = useTranslation("offers");
  const selectedSessions = useMemo(
    () => parseSessionFilters(query.sessions_count),
    [query.sessions_count],
  );
  const sliderFromQuery = [
    toNumber(query.price_min) ?? 0,
    toNumber(query.price_max) ?? PRICE_SLIDER_MAX,
  ];
  const [slider, setSlider] = useState(sliderFromQuery);
  const [minInput, setMinInput] = useState(String(query.price_min ?? ""));
  const [maxInput, setMaxInput] = useState(String(query.price_max ?? ""));

  useEffect(() => {
    setSlider([
      toNumber(query.price_min) ?? 0,
      toNumber(query.price_max) ?? PRICE_SLIDER_MAX,
    ]);
    setMinInput(String(query.price_min ?? ""));
    setMaxInput(String(query.price_max ?? ""));
  }, [query.price_min, query.price_max]);

  const activeCount = countActiveOfferFilters(query);

  function commitPrice(min?: number | null, max?: number | null) {
    let price_min = min ?? undefined;
    let price_max = max ?? undefined;
    if (price_min != null && price_max != null && price_min > price_max) {
      [price_min, price_max] = [price_max, price_min];
    }
    if (price_min === 0) price_min = undefined;
    if (price_max === PRICE_SLIDER_MAX) price_max = undefined;
    onChange({
      price_min,
      price_max,
    });
  }

  function toggleSession(count: number) {
    const next = new Set(selectedSessions);
    if (next.has(count)) next.delete(count);
    else next.add(count);
    const value = [...next].sort((a, b) => a - b).join(",");
    onChange({ sessions_count: value || undefined });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-[#143087]">{t("filters")}</h2>
          {activeCount > 0 ? (
            <p className="text-xs text-[#4a5568]">
              {t("activeFiltersCount", { count: activeCount })}
            </p>
          ) : null}
        </div>
        {activeCount > 0 ? (
          <button
            type="button"
            onClick={onReset}
            className="text-sm font-semibold text-primary hover:underline"
          >
            {t("clearAll")}
          </button>
        ) : null}
      </div>

      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-[#1e1e1e]">{t("filterCategory")}</h3>
        <div className="flex max-h-56 flex-col gap-1 overflow-y-auto pe-1">
          <button
            type="button"
            onClick={() => onChange({ category_id: undefined })}
            className={cn(
              "rounded-xl px-3 py-2 text-start text-sm transition",
              !query.category_id
                ? "bg-[#143087] font-semibold text-white"
                : "bg-[#f5f8ff] text-[#143087] hover:bg-[#e8f0ff]",
            )}
          >
            {t("allCategories")}
          </button>
          {categories.map((category) => {
            const active = String(query.category_id) === String(category.id);
            return (
              <button
                key={category.id}
                type="button"
                onClick={() =>
                  onChange({
                    category_id: active ? undefined : category.id,
                  })
                }
                className={cn(
                  "rounded-xl px-3 py-2 text-start text-sm transition",
                  active
                    ? "bg-[#143087] font-semibold text-white"
                    : "bg-[#f5f8ff] text-[#143087] hover:bg-[#e8f0ff]",
                )}
              >
                {localizedName(category.name, locale)}
              </button>
            );
          })}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-[#1e1e1e]">{t("priceRange")}</h3>
        <div className="flex flex-wrap gap-1.5">
          {PRICE_PRESETS.map((preset) => {
            const active = isPresetActive(preset, query.price_min, query.price_max);
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => commitPrice(preset.min ?? null, preset.max ?? null)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-semibold transition",
                  active
                    ? "bg-[#143087] text-white"
                    : "bg-[#eef4ff] text-[#143087] hover:bg-[#dbeafe]",
                )}
              >
                {t(`pricePresets.${preset.id}`)}
              </button>
            );
          })}
        </div>
        <Slider
          min={0}
          max={PRICE_SLIDER_MAX}
          step={50}
          value={slider}
          onValueChange={(value) => setSlider(value as number[])}
          onValueCommit={(value) => {
            const [min, max] = value as number[];
            commitPrice(min, max);
          }}
          aria-label={t("priceRange")}
          className="mt-2"
        />
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-1">
            <Label htmlFor="offer-price-min" className="text-xs text-[#4a5568]">
              {t("priceMin")}
            </Label>
            <Input
              id="offer-price-min"
              inputMode="numeric"
              value={minInput}
              onChange={(e) => setMinInput(e.target.value.replace(/[^\d]/g, ""))}
              onBlur={() =>
                commitPrice(
                  minInput ? Number(minInput) : null,
                  maxInput ? Number(maxInput) : toNumber(query.price_max),
                )
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  commitPrice(
                    minInput ? Number(minInput) : null,
                    maxInput ? Number(maxInput) : toNumber(query.price_max),
                  );
                }
              }}
              placeholder="0"
              className="h-10"
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="offer-price-max" className="text-xs text-[#4a5568]">
              {t("priceMax")}
            </Label>
            <Input
              id="offer-price-max"
              inputMode="numeric"
              value={maxInput}
              onChange={(e) => setMaxInput(e.target.value.replace(/[^\d]/g, ""))}
              onBlur={() =>
                commitPrice(
                  minInput ? Number(minInput) : toNumber(query.price_min),
                  maxInput ? Number(maxInput) : null,
                )
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  commitPrice(
                    minInput ? Number(minInput) : toNumber(query.price_min),
                    maxInput ? Number(maxInput) : null,
                  );
                }
              }}
              placeholder={String(PRICE_SLIDER_MAX)}
              className="h-10"
            />
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-[#1e1e1e]">{t("sessionsCount")}</h3>
        <div className="flex flex-wrap gap-1.5">
          {SESSION_PRESETS.map((count) => {
            const active = selectedSessions.includes(count);
            return (
              <button
                key={count}
                type="button"
                onClick={() => toggleSession(count)}
                aria-pressed={active}
                className={cn(
                  "min-w-12 rounded-full px-3 py-1.5 text-sm font-semibold transition",
                  active
                    ? "bg-[#143087] text-white"
                    : "bg-[#eef4ff] text-[#143087] hover:bg-[#dbeafe]",
                )}
              >
                {count}
              </button>
            );
          })}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-[#1e1e1e]">{t("offerType")}</h3>
        <div className="flex flex-col gap-2">
          {FLAG_FILTERS.map((flag) => {
            const checked = Boolean(query[flag.key]);
            return (
              <label
                key={flag.key}
                className="flex cursor-pointer items-center gap-2 rounded-xl bg-[#f5f8ff] px-3 py-2 text-sm text-[#1e1e1e]"
              >
                <Checkbox
                  checked={checked}
                  onCheckedChange={(value) =>
                    onChange({ [flag.key]: value ? 1 : undefined })
                  }
                />
                {t(flag.labelKey)}
              </label>
            );
          })}
        </div>
      </section>

      {activeCount > 0 ? (
        <Button type="button" variant="outline" onClick={onReset} className="h-11">
          {t("resetFilters")}
        </Button>
      ) : null}
    </div>
  );
}
