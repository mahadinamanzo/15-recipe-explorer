"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";

export default function SearchBox({
  initialValue,
}: {
  initialValue: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState(initialValue);
  const [isPending, startTransition] = useTransition();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateUrl = useCallback(
    (value: string) => {
      const trimmedQuery = value.trim();
      const href = trimmedQuery
        ? `/search?q=${encodeURIComponent(trimmedQuery)}`
        : "/search";

      startTransition(() => {
        router.replace(href, { scroll: false });
      });
    },
    [router],
  );

  useEffect(() => {
    if (query.trim() === initialValue) {
      return;
    }

    timer.current = setTimeout(() => updateUrl(query), 300);
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, [initialValue, query, updateUrl]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (timer.current) {
      clearTimeout(timer.current);
    }
    updateUrl(query);
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <label htmlFor="recipe-search" className="sr-only">
        Search recipes
      </label>
      <div className="flex gap-2">
        <input
          id="recipe-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Try chicken, pasta, curry..."
          className="min-w-0 flex-1 rounded-full border border-stone-300 bg-white px-5 py-3 outline-none transition placeholder:text-stone-400 focus:border-emerald-800 focus:ring-2 focus:ring-emerald-800/15"
        />
        <button
          type="submit"
          className="rounded-full bg-emerald-800 px-5 py-3 font-semibold text-white transition hover:bg-emerald-900"
        >
          Search
        </button>
      </div>
      {isPending && (
        <span
          role="status"
          className="absolute right-0 mt-2 text-sm text-stone-500"
        >
          Updating results…
        </span>
      )}
    </form>
  );
}
