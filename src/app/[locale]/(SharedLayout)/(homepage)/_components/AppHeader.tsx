type AppHeaderProps = {
  title?: string;
  description?: string;
};

export default function AppHeader({ title, description }: AppHeaderProps) {
  // Split the description into characters
  const chars = description?.split(" ") || [];

  return (
    <div className="flex flex-col gap-4 items-start w-full">
      {title && (
        <div className="flex justify-center items-center">
          <span className="text-base font-medium text-[#1e1e1e] whitespace-nowrap">
            {title}
          </span>
        </div>
      )}

      <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-right leading-tight">
        {chars.length >= 3 ? (
          <>
            <span className="text-[#1e1e1e]">{chars[0]} </span>
            <span className="text-[#62a0f6]">{chars[1] + " " + chars[2]} </span>
            <span className="text-[#1e1e1e]">
              {" "}
              {chars.slice(3).join(" ")}
            </span>
          </>
        ) : (
          <span className="text-[#1e1e1e]">{description}</span>
        )}
      </h1>
    </div>
  );
}
