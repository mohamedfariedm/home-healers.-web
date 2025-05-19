"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FiCheck, FiCopy } from "react-icons/fi";
import { toast } from "sonner";
function CopyToClipboard({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const { t } = useTranslation("common");
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <Button
      onClick={handleCopy}
      variant={"secondary"}
      className={cn(" shrink-0 gap-1.5 ", className)}
    >
      {copied ? <FiCheck className="" /> : <FiCopy className="" />}
      {t("CopyToClipboard")}
    </Button>
  );
}

export default CopyToClipboard;
