import React from "react";

export type HeroBreadcrumbItem = {
  label: string;
  href?: string;
  isActive?: boolean;
};

export function HeroBreadcrumb({ items }: { items: HeroBreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mt-4">
      <ol className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5">
        {items.map((item, index) => (
          <React.Fragment key={`${item.label}-${index}`}>
            {index > 0 ? (
              <li
                aria-hidden
                className="text-white/70 text-sm leading-none"
              >
                /
              </li>
            ) : null}
            <li className="max-w-[min(100%,18rem)] truncate sm:max-w-[32rem]">
              {item.href && !item.isActive ? (
                <a
                  href={item.href}
                  className="rounded-full bg-white/10 px-3 py-1 text-sm font-semibold text-white/90 backdrop-blur-sm transition hover:bg-white/20 hover:text-white"
                >
                  {item.label}
                </a>
              ) : (
                <span
                  className={`rounded-full px-3 py-1 text-sm font-semibold ${
                    item.isActive
                      ? "bg-[#62a0f6] text-white"
                      : "text-white"
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
