"use client";

import { useState } from "react";
import type { OfferFaq } from "@/types/offers";
import { cn } from "@/lib/utils";

type OfferFaqAccordionProps = {
  faqs: OfferFaq[];
  title: string;
};

export default function OfferFaqAccordion({
  faqs,
  title,
}: OfferFaqAccordionProps) {
  const [openId, setOpenId] = useState<number | null>(faqs[0]?.id ?? null);
  if (!faqs.length) return null;

  return (
    <section>
      <h2 className="mb-4 text-2xl font-semibold text-[#143087]">{title}</h2>
      <div className="divide-y rounded-2xl border border-gray-100">
        {faqs.map((faq) => {
          const open = openId === faq.id;
          const panelId = `offer-faq-${faq.id}`;
          const buttonId = `${panelId}-button`;
          return (
            <div key={faq.id}>
              <h3>
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={open}
                  aria-controls={panelId}
                  className="flex w-full items-center justify-between gap-4 px-4 py-4 text-start font-medium text-[#1e1e1e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  onClick={() => setOpenId(open ? null : faq.id)}
                >
                  {faq.question}
                  <span aria-hidden className="text-primary">
                    {open ? "−" : "+"}
                  </span>
                </button>
              </h3>
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                hidden={!open}
                className={cn("px-4 pb-4 text-sm text-[#4a5568]", !open && "hidden")}
              >
                {open ? faq.answer : null}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
