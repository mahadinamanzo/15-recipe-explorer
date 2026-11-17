import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-800">
        404
      </p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight">
        Category not found
      </h1>
      <p className="mt-4 text-stone-600">
        That recipe category doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex rounded-full bg-emerald-800 px-5 py-3 font-semibold text-white hover:bg-emerald-900"
      >
        Back to categories
      </Link>
    </main>
  );
}
