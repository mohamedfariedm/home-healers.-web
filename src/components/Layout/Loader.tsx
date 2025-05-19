import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

function Loader({
  width = 185,
  height = 110,
  className,
}: {
  width?: number;
  height?: number;
  className?: string;
}) {
  return (
    <Image
      className={cn("object-contain ", className)}
      src="/assets/images/spinner.gif"
      alt="loading"
      width={width}
      height={height}
    />
  );
}

export default Loader;
