import { cn } from "@/lib/utils";
import React from "react";

function PreHeading({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h4
      className={cn(
        "text-center text-text-brand-secondary-700  text-sm md:text-base font-semibold  leading-tight md:leading-normal",
        className
      )}
    >
      {children}
    </h4>
  );
}

export default PreHeading;
