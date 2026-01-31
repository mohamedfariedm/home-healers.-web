"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
interface LandingHeroProps {
  section: any;
  locale: string;
}

// Helper function to extract image URL from various data structures
const getImageUrl = (section: any): string | null => {
  // Try section.image first (direct string)
  if (section.image) {
    if (typeof section.image === "string" && section.image.trim() !== "") {
      return section.image.trim();
    }
  }
  
  // Try section.attachment.original
  if (section.attachment) {
    if (typeof section.attachment === "object" && section.attachment !== null) {
      if (section.attachment.original && typeof section.attachment.original === "string" && section.attachment.original.trim() !== "") {
        return section.attachment.original.trim();
      }
    }
  }
  
  return null;
};

export default function LandingHero({ section, locale }: LandingHeroProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });

  const title = section.title?.[locale] || "";
  const content = section.content?.[locale] || "";
  const image = getImageUrl(section);
  const buttons = section.buttons || [];

  // Debug: Log image URL for troubleshooting
  useEffect(() => {
    console.log("🖼️ LandingHero Debug:", {
      hasImage: !!section.image,
      hasAttachment: !!section.attachment,
      imageValue: section.image,
      attachmentOriginal: section.attachment?.original,
      extractedImageUrl: image,
      imageType: typeof section.image,
      attachmentType: typeof section.attachment,
    });
  }, [image, section]);

  // Handle slider mode for hero - redirect to LandingSlider
  if (section.display_mode === "slider") {
    // Dynamic import to avoid circular dependency
    const LandingSlider = require("./LandingSlider").default;
    return <LandingSlider section={section} locale={locale} />;
  }

  return (
    <div
      ref={ref}
      className="w-full xl:max-w-[1280px] relative mx-auto pb-8 px-4 lg:px-0"
    >
      <div className="flex relative flex-col-reverse xl:flex-row gap-10 items-center">
        <motion.div
          className="relative w-full xl:w-1/2 flex flex-col gap-8 justify-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div
            className="text-[#1e1e1e] text-2xl sm:text-3xl lg:text-4xl font-semibold leading-snug text-start relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.3 }}
          >
            {title}
          </motion.div>

          {content && (
            <motion.div
              className="text-[#1e1e1e] text-base sm:text-lg leading-relaxed text-start"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.4 }}
            >
              {content}
            </motion.div>
          )}

          {buttons.length > 0 && (
            <motion.div
              className="flex flex-col sm:flex-row gap-4 items-center relative z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.5 }}
            >
              {buttons.map((button: any, idx: number) => {
                const buttonText = button.text?.[locale] || "";
                let buttonLink = button.link || "#";
                // Handle relative links with locale prefix
                if (buttonLink.startsWith("/") && !buttonLink.startsWith("/en") && !buttonLink.startsWith("/ar")) {
                  buttonLink = locale === "ar" ? buttonLink : `/en${buttonLink}`;
                }
                const isPrimary = button.style === "primary";
                const openInNewTab = button.open_in_new_tab || false;

                return (
                  <Link
                    key={idx}
                    href={buttonLink}
                    target={openInNewTab ? "_blank" : "_self"}
                    rel={openInNewTab ? "noopener noreferrer" : undefined}
                    className="rounded-md"
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center gap-3 px-5 py-3 rounded-2xl w-fit transition z-10 relative ${
                        isPrimary
                          ? "bg-[#143087] hover:bg-[#0f245f] text-white"
                          : "bg-transparent border-2 border-[#143087] text-[#143087] hover:bg-[#143087] hover:text-white"
                      }`}
                    >
                      <span className="text-base sm:text-lg font-medium">
                        {buttonText}
                      </span>
                      <ArrowLeft className="w-6 h-6" />
                    </motion.div>
                  </Link>
                );
              })}
            </motion.div>
          )}
        </motion.div>

        {image ? (
          <motion.div
            className="w-full xl:w-1/2 relative z-10 flex justify-center xl:justify-end"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div 
              className="w-full max-w-[727px] h-[400px] sm:h-[500px] lg:h-[624px] relative bg-gray-100 rounded-lg overflow-hidden"
              style={{ minHeight: "400px" }}
            >
              {/* Use regular img tag for better compatibility with external URLs */}
              <img
                src={image}
                alt={title || "Hero image"}
                className="absolute inset-0 w-full h-full object-cover rounded-lg"
                loading="eager"
                onError={(e) => {
                  console.error("❌ Image failed to load:", image);
                  const target = e.target as HTMLImageElement;
                  target.style.backgroundColor = "#f3f4f6";
                  target.style.display = "flex";
                  target.style.alignItems = "center";
                  target.style.justifyContent = "center";
                }}
                onLoad={() => {
                  console.log("✅ Image loaded successfully:", image);
                }}
              />
            </div>
          </motion.div>
        ) : (
          // Debug: Show when image is not found
          <div className="w-full xl:w-1/2 relative z-10 flex justify-center xl:justify-end p-4 border-2 border-dashed border-yellow-300 bg-yellow-50 rounded-lg">
            <p className="text-yellow-800 text-sm">
              ⚠️ Image not found
              <br />
              <span className="text-xs">
                section.image: {section.image ? `"${section.image}"` : "undefined"}
                <br />
                section.attachment: {section.attachment ? JSON.stringify(section.attachment) : "undefined"}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
