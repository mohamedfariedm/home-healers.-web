"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useCustomSearchParams } from "@/Hooks/useCustomSearchParams";
import useDraggable from "@/Hooks/useDraggable";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export default function BlogFilters({ className }: { className?: string }) {
  const { t } = useTranslation("blog");
  const { searchParams, setSearchParams, createQueryString } =
    useCustomSearchParams();
  const [activeTag, setActiveTag] = useState(
    searchParams.get("tag") || "View all"
  );
  const selectedSort = searchParams.get("sort") || "recent";
  const tabsRef = useRef<HTMLDivElement>(null);

  const tags = [
    { label: t("tags.0"), value: "" },
    { label: t("tags.1"), value: "Forecasting" },
    { label: t("tags.2"), value: "Reporting" },
    { label: t("tags.3"), value: "Cashflow" },
    { label: t("tags.6"), value: "Trends" },
  ];
  const sortOptions = [
    { value: "recent", label: t("sortOptions.0") },
    { value: "featured", label: t("sortOptions.1") },
    { value: "popular", label: t("sortOptions.2") },
  ];
  const { onMouseDown, onMouseUp, onMouseMove } = useDraggable(tabsRef);

  return (
    <div
      className={cn(
        "w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4",
        className
      )}
    >
      <div className="relative w-full md:w-auto overflow-hidden">
        <div
          ref={tabsRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide cursor-grab md:cursor-auto active:cursor-grabbing md:active:cursor-auto"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseUp}
        >
          {tags.map((tag) => (
            <Link
              key={tag.value}
              href={`?${createQueryString("tag", tag.value)}`}
              onClick={() => setActiveTag(tag.value)}
              className={cn(
                " text-sm font-medium trns relative h-7 shrink-0",
                activeTag === tag.value
                  ? "text-text-brand-secondary-700"
                  : "text-text-quaternary-500  hover:text-text-brand-secondary-700"
              )}
              scroll={false}
            >
              {tag.label}
              {activeTag === tag.value && (
                <motion.div
                  className="absolute  bottom-0 left-0 right-0 h-0.5 bg-foreground-brand-primary-alt"
                  layoutId="activeTab"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                  }}
                />
              )}
            </Link>
          ))}
        </div>
        <Separator />
      </div>
      <Select
        value={selectedSort}
        onValueChange={(value) => setSearchParams("sort", value, "push", false)}
      >
        <SelectTrigger className="w-full sm:max-w-60 h-10 text-sm text-text-primary-900">
          <SelectValue placeholder={t("Select_placeholder")} />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem
              className="h-10 text-sm"
              key={option.value}
              value={option.value}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
