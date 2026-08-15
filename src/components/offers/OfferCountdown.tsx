"use client";

import { useEffect, useState } from "react";
import { formatRemaining, remainingMs } from "@/lib/offers";
import { cn } from "@/lib/utils";

type OfferCountdownProps = {
  endsAt: string;
  serverTime: string;
  label: (time: string) => string;
  endedLabel: string;
  className?: string;
  tickMs?: number;
  onEndedChange?: (ended: boolean) => void;
};

export default function OfferCountdown({
  endsAt,
  serverTime,
  label,
  endedLabel,
  className,
  tickMs,
  onEndedChange,
}: OfferCountdownProps) {
  const initial = remainingMs(endsAt, serverTime);
  const [remaining, setRemaining] = useState(initial);
  const ended = remaining <= 0;

  useEffect(() => {
    const offset = Date.parse(serverTime) - Date.now();
    const tick = () => {
      const next = Date.parse(endsAt) - (Date.now() + (Number.isNaN(offset) ? 0 : offset));
      setRemaining(next);
    };
    const intervalMs =
      tickMs ?? (remainingMs(endsAt, serverTime) < 3_600_000 ? 1000 : 60_000);
    const id = window.setInterval(tick, intervalMs);
    return () => window.clearInterval(id);
  }, [endsAt, serverTime, tickMs]);

  useEffect(() => {
    onEndedChange?.(ended);
  }, [ended, onEndedChange]);

  const time = formatRemaining(remaining);

  return (
    <p
      className={cn("text-sm font-medium text-[#143087]", className)}
      aria-live="polite"
    >
      {ended || !time ? endedLabel : label(time)}
    </p>
  );
}
