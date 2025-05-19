import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function Socials({ className }: { className?: string }) {
  const socials = [
    { img: "../assets/images/whatsup.svg", link: "/", alt: "whatsup" },
    { img: "../assets/images/x.svg", link: "/", alt: "x" },
    { img: "../assets/images/facebook.svg", link: "/", alt: "facebook" },
    { img: "../assets/images/linked-in.svg", link: "/", alt: "linked-in" },
  ];
  return (
    <div className="w-full">
      <div
        className={(cn("w-full flex -center gap -12 bg-red-300 "), className)}
      >
        {socials?.map((social) => (
          <Link
            target="_blank"
            key={social?.link}
            href={social?.link}
            className="w-10 h-10  bg-green-400 inline border border-red-400"
          >
            <Image
              alt={social?.alt}
              src={social?.img}
              width={40}
              height={40}
              className="object-contain"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Socials;
