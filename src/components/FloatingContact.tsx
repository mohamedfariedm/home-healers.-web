"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, MessagesSquare, Phone, X } from "lucide-react";
import Link from "next/link";
import { openTawkLiveChat } from "@/lib/tawk";
import { buildWhatsAppUrl, formatWhatsAppNumber } from "@/constants/whatsapp";

interface FloatingContactProps {
  settings?: any;
  locale?: string;
}

interface WidgetPosition {
  x: number;
  y: number;
}

const STORAGE_KEY = "floating-contact-position";
const DRAG_THRESHOLD_PX = 6;
const VIEWPORT_MARGIN = 8;

const labels = {
  ar: {
    whatsapp: "واتساب",
    phone: "اتصال",
    chat: "محادثة مباشرة",
    contact: "تواصل معنا",
  },
  en: {
    whatsapp: "WhatsApp",
    phone: "Call",
    chat: "Live chat",
    contact: "Contact us",
  },
};

function clampToViewport(
  x: number,
  y: number,
  width: number,
  height: number,
): WidgetPosition {
  const maxX = Math.max(VIEWPORT_MARGIN, window.innerWidth - width - VIEWPORT_MARGIN);
  const maxY = Math.max(VIEWPORT_MARGIN, window.innerHeight - height - VIEWPORT_MARGIN);
  return {
    x: Math.min(Math.max(x, VIEWPORT_MARGIN), maxX),
    y: Math.min(Math.max(y, VIEWPORT_MARGIN), maxY),
  };
}

function readStoredPosition(): WidgetPosition | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as WidgetPosition;
    if (typeof parsed?.x === "number" && typeof parsed?.y === "number") {
      return parsed;
    }
  } catch {
    // Ignore invalid stored values and fall back to the default corner.
  }
  return null;
}

function persistPosition(position: WidgetPosition) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(position));
  } catch {
    // Storage can be unavailable in private browsing; dragging still works.
  }
}

export default function FloatingContact({
  settings,
  locale = "ar",
}: FloatingContactProps) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<WidgetPosition | null>(readStoredPosition);
  const [dragging, setDragging] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const widgetRef = useRef<HTMLDivElement>(null);
  const suppressClickRef = useRef(false);
  const dragRef = useRef({
    active: false,
    moved: false,
    pointerId: -1,
    startClientX: 0,
    startClientY: 0,
    originX: 0,
    originY: 0,
  });
  const isArabic = locale === "ar";
  const t = labels[isArabic ? "ar" : "en"];

  const settingsData = settings?.data?.[0]?.setting;
  const businessInfo = settingsData?.business_info || {};

  const whatsappPhone =
    businessInfo.whatsapp || businessInfo.contact || "0118289771";
  const contactPhone = businessInfo.contact || "0118289771";
  const phoneNumber = formatWhatsAppNumber(contactPhone);
  const whatsappUrl = buildWhatsAppUrl(whatsappPhone);

  const sideClass = isArabic ? "right-2 sm:right-4" : "left-2 sm:left-4";
  const labelsOnLeft =
    typeof window !== "undefined" && position
      ? position.x > window.innerWidth / 2
      : isArabic;
  const labelSide = labelsOnLeft
    ? "right-full me-2 sm:me-3"
    : "left-full ms-2 sm:ms-3";

  const btnClass =
    "relative flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full text-white shadow-lg transition-transform hover:scale-105";
  const iconClass = "h-5 w-5";

  const clearCloseTimer = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const handleOpen = () => {
    if (dragRef.current.active || dragging) return;
    clearCloseTimer();
    setOpen(true);
  };

  const handleClose = () => {
    if (dragRef.current.active || dragging) return;
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => setOpen(false), 120);
  };

  useEffect(() => () => clearCloseTimer(), []);

  useEffect(() => {
    const keepOnScreen = () => {
      const el = widgetRef.current;
      if (!el) return;
      setPosition((prev) => {
        if (!prev) return prev;
        const next = clampToViewport(prev.x, prev.y, el.offsetWidth, el.offsetHeight);
        if (next.x === prev.x && next.y === prev.y) return prev;
        persistPosition(next);
        return next;
      });
    };

    keepOnScreen();
    window.addEventListener("resize", keepOnScreen);
    window.addEventListener("orientationchange", keepOnScreen);
    return () => {
      window.removeEventListener("resize", keepOnScreen);
      window.removeEventListener("orientationchange", keepOnScreen);
    };
  }, []);

  const startDrag = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0 && event.pointerType === "mouse") return;
    const el = widgetRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    dragRef.current = {
      active: true,
      moved: false,
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startClientY: event.clientY,
      originX: rect.left,
      originY: rect.top,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const moveDrag = (event: React.PointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    if (!drag.active) return;

    const dx = event.clientX - drag.startClientX;
    const dy = event.clientY - drag.startClientY;
    if (!drag.moved && dx * dx + dy * dy < DRAG_THRESHOLD_PX * DRAG_THRESHOLD_PX) {
      return;
    }

    event.preventDefault();
    const el = widgetRef.current;
    if (!el) return;

    if (!drag.moved) {
      drag.moved = true;
      setDragging(true);
      setOpen(false);
      clearCloseTimer();
      document.body.style.userSelect = "none";
    }

    const next = clampToViewport(
      drag.originX + dx,
      drag.originY + dy,
      el.offsetWidth,
      el.offsetHeight,
    );
    setPosition(next);
  };

  const endDrag = (event: React.PointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    if (!drag.active || drag.pointerId !== event.pointerId) return;

    const didDrag = drag.moved;
    drag.active = false;
    drag.moved = false;
    drag.pointerId = -1;
    document.body.style.userSelect = "";

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    if (!didDrag) return;

    event.preventDefault();
    suppressClickRef.current = true;
    setDragging(false);
    setPosition((prev) => {
      if (prev) persistPosition(prev);
      return prev;
    });
  };

  const handleFabClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (suppressClickRef.current || dragging) {
      event.preventDefault();
      event.stopPropagation();
      suppressClickRef.current = false;
      return;
    }
    setOpen((prev) => !prev);
  };

  const actions = [
    {
      id: "whatsapp",
      label: t.whatsapp,
      href: whatsappUrl,
      external: true,
      className: "bg-green-500 hover:bg-green-600",
      icon: MessageCircle,
    },
    {
      id: "chat",
      label: t.chat,
      onClick: openTawkLiveChat,
      className: "bg-teal-500 hover:bg-teal-600",
      icon: MessagesSquare,
    },
    {
      id: "phone",
      label: t.phone,
      href: `tel:${phoneNumber}`,
      className: "bg-blue-500 hover:bg-blue-600",
      icon: Phone,
    },
  ];

  return (
    <div
      ref={widgetRef}
      className={`fixed z-[60] ${
        position ? "" : `${sideClass} bottom-4 sm:bottom-6`
      } ${dragging ? "cursor-grabbing" : ""}`}
      style={
        position
          ? { left: position.x, top: position.y, right: "auto", bottom: "auto" }
          : undefined
      }
      onMouseEnter={handleOpen}
      onMouseLeave={handleClose}
    >
      {/* Hover bridge: keeps pointer inside the menu while moving to icons */}
      <div className="relative flex flex-col items-center">
        <div
          className={`absolute bottom-full left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 pb-3 sm:gap-3 sm:pb-4 transition-all duration-200 ease-out ${
            open
              ? "pointer-events-auto visible translate-y-0 opacity-100"
              : "pointer-events-none invisible translate-y-1 opacity-0"
          }`}
        >
          {actions.map((action) => (
            <div key={action.id} className="relative shrink-0">
              <span
                className={`pointer-events-none absolute top-1/2 ${labelSide} -translate-y-1/2 whitespace-nowrap rounded-lg bg-white px-2.5 py-1 text-xs font-medium text-gray-700 shadow-md`}
              >
                {action.label}
              </span>

              {action.href ? (
                <Link
                  href={action.href}
                  target={action.external ? "_blank" : undefined}
                  rel={action.external ? "noopener noreferrer" : undefined}
                  aria-label={action.label}
                  className={`${btnClass} ${action.className}`}
                >
                  <action.icon className={iconClass} />
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={action.onClick}
                  aria-label={action.label}
                  className={`${btnClass} ${action.className}`}
                >
                  <action.icon className={iconClass} />
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          type="button"
          aria-label={t.contact}
          aria-expanded={open}
          aria-grabbed={dragging}
          onClick={handleFabClick}
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className={`${btnClass} touch-none bg-[#143087] hover:bg-[#0f2470] ${
            dragging ? "scale-100 cursor-grabbing hover:scale-100" : "cursor-grab"
          }`}
        >
          {open ? (
            <X className={iconClass} />
          ) : (
            <MessagesSquare className={iconClass} />
          )}
        </button>
      </div>
    </div>
  );
}
