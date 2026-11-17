import type { Metadata } from "next";
import MealCard from "@/components/MealCard";
import SearchBox from "@/components/SearchBox";
import { searchMeals } from "@/lib/mealdb";

export const metadata: Metadata = {
  title: "Search recipes",
  description: "Search recipes from around the world.",
};

type SearchPageProps = {
  searchParams: Promise<{ q?: string | string[] }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const queryValue = Array.isArray(params.q) ? params.q[0] : params.q;
  const query = queryValue?.trim() ?? "";
  const meals = query.length >= 2 ? await searchMeals(query) : [];

  return (
    <main className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
      <div className="mb-10 max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-800">
          Find your next favorite
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
          Search recipes
        </h1>
        <p className="mt-4 text-lg leading-8 text-stone-600">
          Search by recipe name. Your query stays in the URL so you can share
          the results.
        </p>
        <div className="mt-6">
          <SearchBox initialValue={query} />
        </div>
      </div>

      {query.length < 2 ? (
        <p className="rounded-2xl border border-stone-200 bg-white p-6 text-stone-600">
          Enter at least two characters to search.
        </p>
      ) : (
        <section aria-live="polite">
          <h2 className="mb-6 text-2xl font-bold tracking-tight">
            {meals.length > 0
              ? `Results for “${query}”`
              : `No recipes found for “${query}”`}
          </h2>
          {meals.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {meals.map((meal) => (
                <MealCard key={meal.idMeal} meal={meal} />
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  );
}
