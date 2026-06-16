import Image from "next/image";

export default function WorldCupAside() {
  return (
    <div
      className="pointer-events-none fixed end-[-12%] top-0 z-[1001] hidden h-screen xl:block"
      aria-hidden="true"
    >
      <Image
        src="/worldCup aside.png"
        alt=""
        width={1024}
        height={1536}
        className="h-full w-full object-contain object-left"
        priority={false}
      />
    </div>
  );
}