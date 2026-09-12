import React from "react";

export type HeroBreadcrumbItem = {
  label: string;
  href?: string;
  isActive?: boolean;
};

const ARROW_STYLE = {
  backgroundImage:
    "url(/assets/images/shared/hero-banner/hero-breadcrumb-arrow.svg)",
} as const;

export function HeroBreadcrumb({ items }: { items: HeroBreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mt-2">
      <ol className="flex flex-wrap items-center justify-center gap-2">
        {items.map((item, index) => (
          <React.Fragment key={`${item.label}-${index}`}>
            {index > 0 ? (
              <li
                aria-hidden
                className="h-4 w-4 shrink-0 bg-cover bg-no-repeat ltr:-scale-x-100"
                style={ARROW_STYLE}
              />
            ) : null}
            <li>
              {item.href && !item.isActive ? (
                <a
                  href={item.href}
                  className="text-sm font-semibold text-white hover:underline"
                >
                  {item.label}
                </a>
              ) : (
                <span
                  className={`text-sm font-semibold ${
                    item.isActive ? "text-[#62a0f6]" : "text-white"
                  }`}
                  aria-current={item.isActive ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
}

export default HeroBreadcrumb;
