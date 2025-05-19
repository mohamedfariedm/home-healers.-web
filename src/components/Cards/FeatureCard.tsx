"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { IFeatureCard } from "@/types";

export default function FeatureCard({
  feature,
  className,
  index,
}: {
  feature: IFeatureCard;
  index: number;
  className?: string;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [isContentVisible, setIsContentVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const isEven = index % 2 === 0;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
            setTimeout(() => setIsContentVisible(true), 500); // Start content animation after card animation
          }, index * 200); // Stagger effect
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, [index]);

  return (
    <div
      ref={cardRef}
      className={cn(
        "w-full h-[510px] transition-all duration-500 ease-out",
        isVisible
          ? "opacity-100 translate-x-0"
          : isEven
          ? "opacity-0 translate-x-[-50px] rtl:translate-x-[50px]"
          : "opacity-0 translate-x-[50px] rtl:translate-x-[-50px]",
        className
      )}
    >
      <Card
        className={cn(
          "overflow-hidden rounded-2xl border border-border-secondary w-full h-full flex flex-col justify-between"
        )}
        style={{ background: feature?.gradientStyle }}
      >
        <CardHeader className="w-full px-10 pt-10 space-y-2.5 shrink-0">
          <div
            className={cn(
              "transition-all duration-500 ease-out",
              isContentVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-[-20px]"
            )}
          >
            <CardTitle className="text-xl font-medium text-text-primary-900 leading-7">
              {feature?.heading}
            </CardTitle>
          </div>
          <div
            className={cn(
              "transition-all duration-500 ease-out delay-100",
              isContentVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-[-20px]"
            )}
          >
            <CardDescription className="text-text-secondary-700 text-base">
              {feature?.subheading}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent
          className={cn(
            "transition-all duration-500 ease-out delay-200 w-full flex h-[340px]  ",
            isContentVisible ? "opacity-100 scale-100" : "opacity-0 scale-90",
            index === 0 || index === 2
              ? "justify-center pb-5"
              : index === 1
              ? "justify-end pb-5"
              : index === 3
              ? "justify-center  items-end"
              : index === 4
              ? "justify-center"
              : index === 5
              ? "justify-end pb-5 pl-5"
              : ""
          )}
        >
          <Image
            src={feature?.image}
            alt={feature?.heading}
            width={800}
            height={500}
            className={cn(
              "w-auto h-full object-contain ",
              index === 0 && "rounded-lg"
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
}
