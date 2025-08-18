"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import { CheckCircle2, Info, TriangleAlert, XCircle, Loader2, X } from "lucide-react";

type Props = Omit<ToasterProps, "theme" | "icons" | "dir"> & {
  dir?: "rtl" | "ltr" | "auto";
};

export function Toaster({
  dir = "rtl",
  position = "top-center",
  richColors = true,
  expand = true,
  duration = 4000,
  closeButton = true,
  pauseWhenPageIsHidden = true,
  className = "toaster group",
  style,
  ...props
}: Props) {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      dir={dir}
      position={position}
      richColors={richColors}
      expand={expand}
      duration={duration}
      closeButton={closeButton}
      pauseWhenPageIsHidden={pauseWhenPageIsHidden}
      theme={theme as ToasterProps["theme"]}
      className={className}
      style={{
        // تقدر تخصص الألوان من CSS variables بتاعتك (shadcn)
        "--normal-bg": "var(--popover)",
        "--normal-text": "var(--popover-foreground)",
        "--normal-border": "var(--border)",
        ...style,
      } as React.CSSProperties}
      icons={{
        success: <CheckCircle2 className="size-5" />,
        info: <Info className="size-5" />,
        warning: <TriangleAlert className="size-5" />,
        error: <XCircle className="size-5" />,
        loading: <Loader2 className="size-5 animate-spin" />,
        close: <X className="size-4" />,
      }}
      containerAriaLabel="التنبيهات"
      {...props}
    />
  );
}

export default Toaster;
