export default function Skeleton({
  variant = "grid",
}: {
  variant?: "grid" | "meal";
}) {
  if (variant === "meal") {
    return (
      <div
        aria-label="Loading recipe"
        role="status"
        className="mx-auto max-w-7xl animate-pulse px-6 py-12"
      >
        <span className="sr-only">Loading recipe...</span>
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="aspect-square rounded-3xl bg-stone-200" />
          <div className="space-y-5 py-4">
            <div className="h-4 w-28 rounded bg-stone-200" />
            <div className="h-12 w-4/5 rounded bg-stone-200" />
            <div className="h-5 w-2/3 rounded bg-stone-200" />
            <div className="mt-10 h-40 rounded-3xl bg-stone-200" />
          </div>
        </div>
        <div className="mt-12 h-8 w-56 rounded bg-stone-200" />
        <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <div
              key={index}
              className="aspect-square rounded-3xl bg-stone-200"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      aria-label="Loading recipes"
      role="status"
      className="mx-auto max-w-7xl animate-pulse px-6 py-12"
    >
      <span className="sr-only">Loading recipes...</span>
      <div className="mb-10 space-y-4">
        <div className="h-4 w-32 rounded bg-stone-200" />
        <div className="h-12 w-64 rounded bg-stone-200" />
        <div className="h-5 w-2/3 max-w-xl rounded bg-stone-200" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="overflow-hidden rounded-3xl bg-white">
            <div className="aspect-square bg-stone-200" />
            <div className="h-16 bg-stone-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
