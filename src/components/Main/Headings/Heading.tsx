import { cn } from "@/lib/utils";
import React from "react";

function Heading({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "text-center text-text-primary-900  text-3xl md:text-4xl font-semibold leading-[38px]  md:leading-[44px]",
        className
      )}
    >
      {children}
    </h2>
  );
}

export default Heading;
