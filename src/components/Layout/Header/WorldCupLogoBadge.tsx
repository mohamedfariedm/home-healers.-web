import Image from "next/image";

export default function WorldCupLogoBadge() {
  return (
    <div className="pointer-events-none absolute left-full top-1/2 z-[42] ms-2 -translate-y-1/2 sm:ms-3">
      <Image
        src="/world cup logo.png"
        alt=""
        width={1024}
        height={1536}
        className="world-cup-logo-trophy h-[56px] w-auto object-contain drop-shadow-[0_4px_12px_rgba(212,175,55,0.35)] sm:h-[64px]"
        aria-hidden
      />
    </div>
  );
}
