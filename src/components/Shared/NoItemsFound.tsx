"use client";

import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

function NoItemsFound({
  items,
  className,
}: {
  items: string;
  className?: string;
}) {
  const { t } = useTranslation("common");
  return (
    <div className={cn("text-center", className)}>
      {t("NoItemsFound.items", { context: items })}
    </div>
  );
}

export default NoItemsFound;
