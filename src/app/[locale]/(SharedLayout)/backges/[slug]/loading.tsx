export default function OfferDetailsLoading() {
  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 py-10">
      <div className="mb-6 h-4 w-48 animate-pulse rounded bg-[#e5eefc]" />
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="aspect-[4/3] animate-pulse rounded-3xl bg-[#e5eefc]" />
        <div className="flex flex-col gap-4">
          <div className="h-10 w-3/4 animate-pulse rounded bg-[#e5eefc]" />
          <div className="h-6 w-1/3 animate-pulse rounded bg-[#e5eefc]" />
          <div className="h-8 w-1/2 animate-pulse rounded bg-[#e5eefc]" />
          <div className="h-12 w-40 animate-pulse rounded-xl bg-[#e5eefc]" />
        </div>
      </div>
      <div className="mt-10 grid gap-4">
        <div className="h-32 animate-pulse rounded-2xl bg-[#e5eefc]" />
        <div className="h-32 animate-pulse rounded-2xl bg-[#e5eefc]" />
        <div className="h-32 animate-pulse rounded-2xl bg-[#e5eefc]" />
      </div>
    </div>
  );
}
