"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import type { MealSearchResult } from "@/lib/mealdb";

interface SearchResponse {
  results: MealSearchResult[];
}

export default function HeaderSearch() {
  const router = useRouter();
  const listboxId = useId();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MealSearchResult[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const trimmedQuery = query.trim();
    if (trimmedQuery.length < 2) {
      setResults([]);
      setIsLoading(false);
      setHasError(false);
      return;
    }

    const controller = new AbortController();
    setResults([]);
    setIsLoading(true);
    setHasError(false);
    setActiveIndex(-1);
    timer.current = setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(trimmedQuery)}`,
          { signal: controller.signal },
        );
        if (!response.ok) {
          throw new Error(`Search suggestions failed (${response.status}).`);
        }

        const data = (await response.json()) as SearchResponse;
        setResults(data.results);
        setActiveIndex(-1);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        setResults([]);
        setHasError(true);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }, 250);

    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
      controller.abort();
    };
  }, [query]);

  function goToSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedQuery = query.trim();
    if (trimmedQuery.length >= 2) {
      setIsOpen(false);
      router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
    }
  }

  function selectResult(result: MealSearchResult) {
    setIsOpen(false);
    router.push(`/meal/${result.id}`);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setIsOpen(false);
      setActiveIndex(-1);
      return;
    }

    if (event.key === "ArrowDown" && results.length > 0) {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((index) => (index + 1) % results.length);
    } else if (event.key === "ArrowUp" && results.length > 0) {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((index) =>
        index <= 0 ? results.length - 1 : index - 1,
      );
    } else if (
      event.key === "Enter" &&
      isOpen &&
      activeIndex >= 0 &&
      results[activeIndex]
    ) {
      event.preventDefault();
      selectResult(results[activeIndex]);
    }
  }

  const showListbox = isOpen && query.trim().length >= 2;

  return (
    <form
      onSubmit={goToSearch}
      className="relative w-full max-w-sm"
      role="search"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsOpen(false);
          setActiveIndex(-1);
        }
      }}
    >
      <label htmlFor="header-recipe-search" className="sr-only">
        Search recipes
      </label>
      <input
        id="header-recipe-search"
        type="search"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder="Search recipes..."
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={showListbox}
        aria-controls={
          showListbox && results.length > 0 ? listboxId : undefined
        }
        aria-activedescendant={
          showListbox && activeIndex >= 0
            ? `${listboxId}-option-${activeIndex}`
            : undefined
        }
        className="w-full rounded-full border border-stone-300 bg-stone-50 px-4 py-2.5 text-sm outline-none transition placeholder:text-stone-400 focus:border-emerald-800 focus:bg-white focus:ring-2 focus:ring-emerald-800/15"
      />
      {showListbox && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xl">
          {isLoading ? (
            <p role="status" className="px-4 py-3 text-sm text-stone-500">
              Finding recipes...
            </p>
          ) : hasError ? (
            <p role="status" className="px-4 py-3 text-sm text-rose-700">
              Suggestions couldn&apos;t be loaded.
            </p>
          ) : results.length > 0 ? (
            <div
              id={listboxId}
              role="listbox"
              aria-label="Recipe suggestions"
              className="max-h-80 overflow-y-auto"
            >
              {results.map((result, index) => (
                <button
                  type="button"
                  role="option"
                  key={result.id}
                  id={`${listboxId}-option-${index}`}
                  aria-selected={index === activeIndex}
                  onClick={() => selectResult(result)}
                  className={`flex w-full items-center gap-3 px-3 py-2 text-left transition ${
                    index === activeIndex ? "bg-emerald-50" : "hover:bg-stone-50"
                  }`}
                >
                  <Image
                    src={result.thumb}
                    alt=""
                    width={44}
                    height={44}
                    className="size-11 rounded-lg object-cover"
                  />
                  <span className="line-clamp-2 text-sm font-medium text-stone-800">
                    {result.name}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <p className="px-4 py-3 text-sm text-stone-500">
              No matching recipes.
            </p>
          )}
        </div>
      )}
    </form>
  );
}
