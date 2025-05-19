import { cn } from "@/lib/utils";
import React from "react";

function SubHeading({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3
      className={cn(
        "text-center text-lg font-normal  leading-7 text-text-tertiary-600 md:text-xl md:leading-[30px]",
        className
      )}
    >
      {children}
    </h3>
  );
}

export default SubHeading;
