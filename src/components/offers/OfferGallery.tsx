"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type OfferGalleryProps = {
  images: string[];
  alt: string;
  label: string;
};

export default function OfferGallery({ images, alt, label }: OfferGalleryProps) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  if (!images.length) return null;

  const current = images[index] || images[0];

  function go(delta: number) {
    setIndex((prev) => (prev + delta + images.length) % images.length);
  }

  return (
    <div className="flex min-w-0 flex-col gap-3" aria-label={label}>
      <div className="relative aspect-[16/11] w-full overflow-hidden rounded-2xl bg-[#eef4ff] sm:aspect-[4/3] sm:rounded-3xl">
        <button
          type="button"
          className="absolute inset-0 hidden md:block"
          onClick={() => setOpen(true)}
          aria-label={alt}
        >
          <Image
            src={current}
            alt={alt}
            fill
            priority
            fetchPriority="high"
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </button>
        <div className="relative h-full w-full md:hidden">
          <Image
            src={current}
            alt={alt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        {images.length > 1 ? (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              className="absolute start-2 top-1/2 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#143087] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:start-3 sm:size-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="size-5 rtl:rotate-180" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="absolute end-2 top-1/2 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#143087] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:end-3 sm:size-10"
              aria-label="Next image"
            >
              <ChevronRight className="size-5 rtl:rotate-180" />
            </button>
          </>
        ) : null}
      </div>
      {images.length > 1 ? (
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {images.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => setIndex(i)}
              className={cn(
                "relative size-16 shrink-0 overflow-hidden rounded-xl border-2",
                i === index ? "border-primary" : "border-transparent",
              )}
              aria-label={`${alt} ${i + 1}`}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="64px"
                className="object-cover"
                loading="lazy"
                decoding="async"
              />
            </button>
          ))}
        </div>
      ) : null}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl border-0 bg-black p-0">
          <DialogTitle className="sr-only">{alt}</DialogTitle>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute end-3 top-3 z-10 rounded-full bg-white/90 p-2 text-[#143087]"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
          <div className="relative aspect-video w-full">
            <Image
              src={current}
              alt={alt}
              fill
              sizes="(max-width: 1024px) 100vw, 896px"
              className="object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
