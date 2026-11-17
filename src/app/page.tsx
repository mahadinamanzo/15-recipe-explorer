import type { Metadata } from "next";
import CategoryCard from "@/components/CategoryCard";
import { getCategories } from "@/lib/mealdb";

export const metadata: Metadata = {
  title: "Explore recipes",
  description: "Choose a category and find your next favorite recipe.",
};

export default async function HomePage() {
  const categories = await getCategories();

  return (
    <main className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
      <div className="mb-10 max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-800">
          A world of flavor
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
          What are you craving?
        </h1>
        <p className="mt-4 text-lg leading-8 text-stone-600">
          Explore recipes by category, from quick comfort food to global
          favorites.
        </p>
      </div>
      {categories.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.idCategory} category={category} />
          ))}
        </div>
      ) : (
        <p className="rounded-2xl border border-stone-200 bg-white p-6 text-stone-600">
          No recipe categories are available right now.
        </p>
      )}
    </main>
  );
}
