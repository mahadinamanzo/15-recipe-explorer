import type { Metadata } from "next";
import FavoritesLimitSetting from "@/components/FavoritesLimitSetting";
import MealCard from "@/components/MealCard";
import { cookies } from "next/headers";
import {
  FAVORITES_COOKIE,
  parseFavoriteIds,
} from "@/lib/favorites";
import type { Meal } from "@/lib/mealdb";
import { getMeal } from "@/lib/mealdb";

export const metadata: Metadata = {
  title: "Your favourites",
  description: "Recipes you have saved to your favourites.",
};

export default async function FavouritesPage() {
  const cookieStore = await cookies();
  const mealIds = parseFavoriteIds(
    cookieStore.get(FAVORITES_COOKIE)?.value,
  );
  const fetchedMeals = await Promise.all(mealIds.map((id) => getMeal(id)));
  const meals = fetchedMeals.filter((meal): meal is Meal => meal !== null);

  return (
    <main className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
      <div className="mb-9">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-800">
          Saved for later
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
          Your favourites
        </h1>
        <p className="mt-4 text-stone-600">
          {meals.length} of 50 recipes saved in this browser.
        </p>
      </div>

      <div className="mb-8 rounded-2xl border border-stone-200 bg-white p-5">
        <FavoritesLimitSetting />
      </div>

      {meals.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {meals.map((meal) => (
            <MealCard key={meal.idMeal} meal={meal} />
          ))}
        </div>
      ) : (
        <p className="rounded-2xl border border-stone-200 bg-white p-6 text-stone-600">
          You haven&apos;t saved any recipes yet. Tap the heart on a recipe to
          add it here.
        </p>
      )}
    </main>
  );
}
