import MealCard from "@/components/MealCard";
import { getMealsByCategory } from "@/lib/mealdb";

export default async function RelatedMeals({
  category,
  currentMealId,
}: {
  category: string;
  currentMealId: string;
}) {
  if (process.env.NODE_ENV === "development") {
    await new Promise((resolve) => setTimeout(resolve, 1_000));
  }

  const categoryMeals = await getMealsByCategory(category);
  const meals = categoryMeals
    .filter((meal) => meal.idMeal !== currentMealId)
    .slice(0, 3);

  return (
    <section aria-labelledby="more-recipes-heading">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-800">
            Keep exploring
          </p>
          <h2
            id="more-recipes-heading"
            className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl"
          >
            More from this category
          </h2>
        </div>
      </div>
      {meals.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {meals.map((meal) => (
            <MealCard key={meal.idMeal} meal={meal} />
          ))}
        </div>
      ) : (
        <p className="rounded-2xl border border-stone-200 bg-white p-6 text-stone-600">
          No more recipes in this category right now.
        </p>
      )}
    </section>
  );
}
