import { cn } from "@/lib/utils";
import React from "react";

function FieldError({
  error,
  className,
}: {
  error?: string;
  className?: string;
}) {
  return (
    <h6
      className={cn(
        "mt-px text-xs font-light  text-red-500  min-h-4",
        className
      )}
    >
      {error ? <span className="animate-fade-up">{error}</span> : ""}
    </h6>
  );
}

export default FieldError;
