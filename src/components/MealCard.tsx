import Image from "next/image";
import type { MealSummary } from "@/lib/mealdb";

export default function MealCard({ meal }: { meal: MealSummary }) {
  return (
    <article className="overflow-hidden rounded-3xl border border-stone-200 bg-white">
      <div className="relative aspect-square bg-stone-100">
        <Image
          src={meal.strMealThumb}
          alt={meal.strMeal}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
      </div>
      <h2 className="p-5 text-lg font-semibold tracking-tight">
        {meal.strMeal}
      </h2>
    </article>
  );
}
