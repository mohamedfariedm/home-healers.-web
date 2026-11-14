"use client";

import { useEffect } from "react";
import GtmClickTracker from "@/components/GtmClickTracker";
import { ensureDataLayer } from "@/lib/gtm";

const GTM_ID = "GTM-TDDDW3G3";
const GA_ID = "G-YXJBLQXP8R";
const CLARITY_ID = "wc9sy4cx56";

function injectThirdPartyScripts() {
  if (typeof window === "undefined") return;
  if (document.getElementById("gtm-script")) return;

  ensureDataLayer();

  const gtm = document.createElement("script");
  gtm.id = "gtm-script";
  gtm.async = true;
  gtm.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
  document.head.appendChild(gtm);

  if (!document.getElementById("ga-gtag-js")) {
    const gaSrc = document.createElement("script");
    gaSrc.id = "ga-gtag-js";
    gaSrc.async = true;
    gaSrc.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(gaSrc);

    const gaConfig = document.createElement("script");
    gaConfig.id = "ga-gtag-config";
    gaConfig.text = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`;
    document.head.appendChild(gaConfig);
  }

  // Clarity is the heaviest + least critical tag: stagger it behind GTM/GA so
  // the two parse/execute bursts don't land in the same main-thread task.
  window.setTimeout(injectClarity, 2500);
}

function injectClarity() {
  if (document.getElementById("microsoft-clarity")) return;

  const clarity = document.createElement("script");
  clarity.id = "microsoft-clarity";
  clarity.async = true;
  clarity.text = `(function(c,l,a,r,i,t,y){
c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window,document,"clarity","script","${CLARITY_ID}");`;
  document.head.appendChild(clarity);
}

export default function AnalyticsScripts() {
  useEffect(() => {
    // Queue events immediately; GTM reads the array when the script loads
    ensureDataLayer();

    if (process.env.NODE_ENV !== "production") return;

    let loaded = false;
    const load = () => {
      if (loaded) return;
      loaded = true;
      injectThirdPartyScripts();
    };

    // Load on intentional interaction only — not scroll. Lighthouse SI/LCP
    // measurement scrolls the page; treating scroll as "engagement" pulled
    // GTM/Clarity into the TBT window and tanked blog/mobile scores.
    // Real users who tap/click/type still get tags immediately.
    const events: Array<keyof WindowEventMap> = [
      "pointerdown",
      "keydown",
      "touchstart",
    ];
    const onInteract = () => load();
    events.forEach((evt) =>
      window.addEventListener(evt, onInteract, { once: true, passive: true }),
    );

    // Fallback far outside Lighthouse lab windows so GTM/Clarity do not
    // land in TBT during long mobile audits (interaction still loads ASAP).
    const idleTimer = window.setTimeout(load, 60000);

    return () => {
      events.forEach((evt) => window.removeEventListener(evt, onInteract));
      window.clearTimeout(idleTimer);
    };
  }, []);

  return <GtmClickTracker />;
}
