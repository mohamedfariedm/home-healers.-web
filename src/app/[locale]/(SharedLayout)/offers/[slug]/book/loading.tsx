export default function OfferBookLoading() {
  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-5 h-8 w-40 animate-pulse rounded-full bg-[#e5eefc]" />
      <div className="mb-5 grid overflow-hidden rounded-[28px] border border-[#e8eef8] bg-white md:grid-cols-2">
        <div className="min-h-[200px] animate-pulse bg-[#e5eefc] md:min-h-[260px]" />
        <div className="flex flex-col gap-3 p-6">
          <div className="h-6 w-1/3 animate-pulse rounded bg-[#e5eefc]" />
          <div className="h-8 w-2/3 animate-pulse rounded bg-[#e5eefc]" />
          <div className="h-5 w-1/2 animate-pulse rounded bg-[#e5eefc]" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-64 animate-pulse rounded-[28px] bg-[#e5eefc]"
          />
        ))}
      </div>
    </div>
  );
}
