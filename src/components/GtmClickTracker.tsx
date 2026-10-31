"use client";

import { useEffect } from "react";
import {
  GTM_EVENTS,
  eventNameFromPath,
  trackEvent,
  type GtmEventName,
} from "@/lib/gtm";

const INTERACTIVE_SELECTOR = [
  "a[href]",
  "button",
  "[role='button']",
  "input[type='submit']",
  "input[type='button']",
  "input[type='reset']",
  "summary",
  "label[for]",
  "[data-gtm-event]",
].join(", ");

function closestInteractive(target: EventTarget | null): HTMLElement | null {
  if (!(target instanceof Element)) return null;
  return target.closest<HTMLElement>(INTERACTIVE_SELECTOR);
}

function hrefOf(el: HTMLElement): string {
  if (el instanceof HTMLAnchorElement) {
    return el.href || el.getAttribute("href") || "";
  }
  const nested = el.closest("a[href]") || el.querySelector("a[href]");
  if (nested instanceof HTMLAnchorElement) {
    return nested.href || nested.getAttribute("href") || "";
  }
  return el.getAttribute("href") || "";
}

function pathOf(href: string): string {
  try {
    return new URL(href, window.location.origin).pathname;
  } catch {
    return href;
  }
}

function stripLocale(pathname: string): string {
  return pathname.replace(/^\/(ar|en)(?=\/|$)/, "") || "/";
}

function isWhatsAppHref(href: string): boolean {
  const lower = href.toLowerCase();
  return (
    lower.includes("api.whatsapp.com") ||
    lower.includes("wa.me/") ||
    lower.includes("whatsapp.com") ||
    lower.startsWith("whatsapp:")
  );
}

function isPhoneHref(href: string): boolean {
  return href.toLowerCase().startsWith("tel:");
}

function isEmailHref(href: string): boolean {
  return href.toLowerCase().startsWith("mailto:");
}

function isAppStoreHref(href: string): boolean {
  const lower = href.toLowerCase();
  return (
    lower.includes("apps.apple.com") ||
    lower.includes("play.google.com") ||
    lower.includes("appgallery.huawei.com")
  );
}

function isSocialHref(href: string): boolean {
  const lower = href.toLowerCase();
  return [
    "facebook.com",
    "fb.com",
    "instagram.com",
    "twitter.com",
    "x.com",
    "linkedin.com",
    "youtube.com",
    "youtu.be",
    "tiktok.com",
    "snapchat.com",
  ].some((host) => lower.includes(host));
}

function resolveNamedEvent(
  el: HTMLElement,
  href: string,
  pathname: string,
): GtmEventName {
  const explicit = el.getAttribute("data-gtm-event")?.trim();
  if (explicit) return explicit;

  if (href && isWhatsAppHref(href)) return GTM_EVENTS.WHATSAPP_CLICK;
  if (href && isPhoneHref(href)) return GTM_EVENTS.PHONE_CLICK;
  if (href && isEmailHref(href)) return GTM_EVENTS.EMAIL_CLICK;
  if (href && isAppStoreHref(href)) return GTM_EVENTS.DOWNLOAD_APP_CLICK;
  if (href && isSocialHref(href)) return GTM_EVENTS.SOCIAL_CLICK;

  const fromPath = href ? eventNameFromPath(pathname) : null;
  if (fromPath) return fromPath;

  const text = (
    el.getAttribute("data-gtm-label") ||
    el.getAttribute("aria-label") ||
    el.textContent ||
    ""
  )
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

  if (
    text.includes("app store") ||
    text.includes("google play") ||
    text.includes("حمل التطبيق") ||
    text.includes("download the app") ||
    text.includes("download app")
  ) {
    return GTM_EVENTS.DOWNLOAD_APP_CLICK;
  }

  if (
    text.includes("whatsapp") ||
    text.includes("واتساب") ||
    text.includes("واتس")
  ) {
    return GTM_EVENTS.WHATSAPP_CLICK;
  }

  return GTM_EVENTS.CTA_CLICK;
}

function clickPayload(el: HTMLElement, href: string, pathname: string) {
  const label =
    el.getAttribute("data-gtm-label") ||
    el.getAttribute("aria-label") ||
    el.textContent?.replace(/\s+/g, " ").trim().slice(0, 120) ||
    undefined;

  return {
    click_text: label,
    click_url: href || undefined,
    click_path: pathname || undefined,
    click_location:
      el.getAttribute("data-gtm-location") ||
      document.body?.dataset?.page ||
      undefined,
    click_tag: el.tagName.toLowerCase(),
    page_path: stripLocale(window.location.pathname),
    page_url: window.location.href,
  };
}

/**
 * Captures every interactive click + form submit and pushes them to dataLayer.
 * Always fires `ui_click` / `form_submit`, plus a specific named event when known.
 */
export default function GtmClickTracker() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      // Ignore non-primary clicks
      if (e.button !== 0) return;

      const el = closestInteractive(e.target);
      if (!el) return;
      if (el.hasAttribute("disabled") || el.getAttribute("aria-disabled") === "true") {
        return;
      }

      const href = hrefOf(el);
      const pathname = href ? stripLocale(pathOf(href)) : "";
      const base = clickPayload(el, href, pathname);
      const named = resolveNamedEvent(el, href, pathname);

      // Catch-all so GTM can listen to every action
      trackEvent(GTM_EVENTS.UI_CLICK, {
        ...base,
        action_event: named,
      });

      // Specific named event (WhatsApp, booking, blog, …)
      if (named !== GTM_EVENTS.UI_CLICK) {
        trackEvent(named, base);
      }
    };

    const onSubmit = (e: Event) => {
      const form = e.target;
      if (!(form instanceof HTMLFormElement)) return;

      const explicit =
        form.getAttribute("data-gtm-event")?.trim() || GTM_EVENTS.FORM_SUBMIT;
      const name = form.getAttribute("name") || form.id || undefined;

      trackEvent(GTM_EVENTS.FORM_SUBMIT, {
        form_name: name,
        form_id: form.id || undefined,
        click_location:
          form.getAttribute("data-gtm-location") ||
          document.body?.dataset?.page ||
          undefined,
        page_path: stripLocale(window.location.pathname),
        page_url: window.location.href,
      });

      if (explicit !== GTM_EVENTS.FORM_SUBMIT) {
        trackEvent(explicit, {
          form_name: name,
          page_path: stripLocale(window.location.pathname),
        });
      }
    };

    document.addEventListener("click", onClick, true);
    document.addEventListener("submit", onSubmit, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("submit", onSubmit, true);
    };
  }, []);

  return null;
}
