"use client";

import { motion } from "framer-motion";
import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

interface LandingSectionProps {
  section: any;
  locale: string;
}

// Helper function to extract image URL from various data structures
const getImageUrl = (section: any): string | null => {
  // Try section.image first (direct string)
  if (section.image && typeof section.image === "string" && section.image.trim() !== "") {
    return section.image.trim();
  }
  
  // Try section.attachment.original
  if (section.attachment) {
    if (typeof section.attachment === "object") {
      if (section.attachment.original && typeof section.attachment.original === "string" && section.attachment.original.trim() !== "") {
        return section.attachment.original.trim();
      }
    }
  }
  
  return null;
};

export default function LandingSection({
  section,
  locale,
}: LandingSectionProps) {
  const ref = useRef(null);
  const [imageError, setImageError] = useState(false);

  const title = section.title?.[locale] || "";
  const content = section.content?.[locale] || "";
  const buttons = section.buttons || [];
  const image = getImageUrl(section);

  return (
    <section
      ref={ref}
      className="w-full max-w-7xl mx-auto py-16 px-4 lg:px-0"
    >
      <motion.div
        className={`flex flex-col gap-8 items-center ${
          image ? "lg:flex-row lg:items-center lg:gap-12" : ""
        }`}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8 }}
      >
        {/* Image Section - Left or Top */}
        {image && typeof image === "string" && image.trim() !== "" && (
          <motion.div
            className={`w-full ${image ? "lg:w-1/2" : ""} relative`}
            initial={{ opacity: 0, x: image ? -40 : 0, y: image ? 0 : 40 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="w-full h-[400px] lg:h-[500px] relative rounded-lg overflow-hidden bg-gray-100">
              {!imageError ? (
                <Image
                  src={image}
                  alt={title || "Section image"}
                  fill
                  className="object-cover rounded-lg"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  unoptimized={image.startsWith("http")}
                  onError={() => {
                    console.error("Section image failed to load:", image);
                    setImageError(true);
                  }}
                />
              ) : (
                <img
                  src={image}
                  alt={title || "Section image"}
                  className="w-full h-full object-cover rounded-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
              )}
            </div>
          </motion.div>
        )}

        {/* Content Section - Right or Bottom */}
        <div className={`flex flex-col gap-6 ${image ? "lg:w-1/2 text-start lg:text-start" : "text-center w-full"}`}>
          {title && (
            <h2 className={`text-3xl sm:text-4xl font-semibold text-[#1e1e1e] ${image ? "" : "text-center"}`}>
              {title}
            </h2>
          )}

          {content && (
            <p className={`text-lg text-[#1e1e1e] leading-relaxed ${image ? "" : "max-w-3xl mx-auto"}`}>
              {content}
            </p>
          )}

          {buttons.length > 0 && (
            <div className={`flex flex-col sm:flex-row gap-4 items-center ${image ? "justify-start" : "justify-center"} mt-4`}>
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
                      className={`flex items-center gap-3 px-5 py-3 rounded-2xl w-fit transition ${
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
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
}
