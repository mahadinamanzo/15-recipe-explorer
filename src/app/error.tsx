"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-800">
        Something went wrong
      </p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight">
        We couldn&apos;t load these recipes.
      </h1>
      <p className="mt-4 text-stone-600">
        Please try again. Your place in the kitchen is saved.
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="mt-8 rounded-full bg-emerald-800 px-5 py-3 font-semibold text-white hover:bg-emerald-900"
      >
        Try again
      </button>
    </main>
  );
}
