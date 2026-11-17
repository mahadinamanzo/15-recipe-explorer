import Image from "next/image";
import Link from "next/link";
import FavoriteButton from "@/components/FavoriteButton";
import type { MealSummary } from "@/lib/mealdb";

export default function MealCard({
  meal,
}: {
  meal: MealSummary;
}) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-stone-200 bg-white transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-square overflow-hidden bg-stone-100">
        <Link
          href={`/meal/${meal.idMeal}`}
          aria-label={`View ${meal.strMeal} recipe`}
          className="absolute inset-0"
        >
          <Image
            src={meal.strMealThumb}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        </Link>
        <div className="absolute right-3 top-3">
          <FavoriteButton mealId={meal.idMeal} />
        </div>
      </div>
      <Link
        href={`/meal/${meal.idMeal}`}
        className="block p-5 text-lg font-semibold tracking-tight"
      >
        {meal.strMeal}
      </Link>
    </article>
  );
}
