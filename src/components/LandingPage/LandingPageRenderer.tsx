"use client";

import React from "react";
import LandingHero from "./sections/LandingHero";
import LandingSection from "./sections/LandingSection";
import LandingBanner from "./sections/LandingBanner";
import LandingForm from "./sections/LandingForm";
import LandingSlider from "./sections/LandingSlider";

interface LandingPageRendererProps {
  sections: any[];
  locale: string;
  settings?: any;
}

export default function LandingPageRenderer({
  sections,
  locale,
  settings,
}: LandingPageRendererProps) {
  console.log("🎨 Rendering landing page with sections:", sections.length);
  console.log("🌐 Locale:", locale);
  
  if (!sections || sections.length === 0) {
    console.warn("⚠️ No sections to render!");
    return (
      <div className="w-full max-w-7xl mx-auto py-16 px-4 text-center">
        <p className="text-gray-600">No sections found for this landing page.</p>
      </div>
    );
  }

  return (
    <>
      {sections.map((section, index) => {
        const key = `${section.type}-${section.order}-${index}`;
        console.log(`📦 Rendering section ${index + 1}/${sections.length}:`, {
          type: section.type,
          order: section.order,
          display_mode: section.display_mode,
          hasTitle: !!section.title?.[locale],
          hasContent: !!section.content?.[locale],
          hasImage: !!(section.image || section.attachment?.original),
        });

        switch (section.type) {
          case "hero":
            return (
              <LandingHero
                key={key}
                section={section}
                locale={locale}
              />
            );

          case "section":
            // Check if it's a slider display mode
            if (section.display_mode === "slider") {
              return (
                <LandingSlider
                  key={key}
                  section={section}
                  locale={locale}
                />
              );
            }
            // Regular section
            return (
              <LandingSection
                key={key}
                section={section}
                locale={locale}
              />
            );

          case "banner":
            return (
              <LandingBanner
                key={key}
                section={section}
                locale={locale}
              />
            );

          case "form":
            return (
              <LandingForm
                key={key}
                section={section}
                locale={locale}
                settings={settings}
              />
            );

          default:
            console.warn(`Unknown section type: ${section.type}`);
            return null;
        }
      })}
    </>
  );
}
