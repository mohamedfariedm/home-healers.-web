"use client";

import { useEffect } from "react";

const GTM_ID = "GTM-TDDDW3G3";
const CLARITY_ID = "wc9sy4cx56";

function injectThirdPartyScripts() {
  if (typeof window === "undefined") return;
  const w = window as Window & { dataLayer?: unknown[]; clarity?: unknown };
  if (w.dataLayer || document.getElementById("gtm-script")) return;

  w.dataLayer = w.dataLayer || [];
  const gtm = document.createElement("script");
  gtm.id = "gtm-script";
  gtm.async = true;
  gtm.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
  document.head.appendChild(gtm);

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
    if (process.env.NODE_ENV !== "production") return;

    let loaded = false;
    const load = () => {
      if (loaded) return;
      loaded = true;
      injectThirdPartyScripts();
    };

    const onInteract = () => load();
    window.addEventListener("pointerdown", onInteract, {
      once: true,
      passive: true,
    });
    window.addEventListener("keydown", onInteract, { once: true });

    return () => {
      window.removeEventListener("pointerdown", onInteract);
      window.removeEventListener("keydown", onInteract);
    };
  }, []);

  return null;
}
