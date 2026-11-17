import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MealCard from "@/components/MealCard";
import {
  getCategories,
  getMealsByCategory,
} from "@/lib/mealdb";

type CategoryPageProps = {
  params: Promise<{ name: string }>;
};

async function findCategory(name: string) {
  const categories = await getCategories();
  return categories.find(
    (category) =>
      category.strCategory.toLocaleLowerCase() ===
      name.toLocaleLowerCase(),
  );
}

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({
    name: category.strCategory,
  }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { name } = await params;
  const category = await findCategory(name);

  if (!category) {
    return { title: "Category not found" };
  }

  return {
    title: `${category.strCategory} recipes`,
    description: `Explore ${category.strCategory.toLowerCase()} recipes on Recipe Explorer.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { name } = await params;
  const category = await findCategory(name);

  if (!category) {
    notFound();
  }

  const meals = await getMealsByCategory(category.strCategory);

  return (
    <main className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
      <div className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-800">
          Recipe collection
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
          {category.strCategory}
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-stone-600">
          {category.strCategoryDescription}
        </p>
      </div>
      {meals.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {meals.map((meal) => (
            <MealCard key={meal.idMeal} meal={meal} />
          ))}
        </div>
      ) : (
        <p className="rounded-2xl border border-stone-200 bg-white p-6 text-stone-600">
          No recipes are available in this category right now.
        </p>
      )}
    </main>
  );
}
