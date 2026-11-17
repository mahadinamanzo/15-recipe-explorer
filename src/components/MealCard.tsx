import Image from "next/image";
import Link from "next/link";
import type { MealSummary } from "@/lib/mealdb";

export default function MealCard({ meal }: { meal: MealSummary }) {
  return (
    <Link
      href={`/meal/${meal.idMeal}`}
      className="group block overflow-hidden rounded-3xl border border-stone-200 bg-white transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-square overflow-hidden bg-stone-100">
        <Image
          src={meal.strMealThumb}
          alt={meal.strMeal}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <h2 className="p-5 text-lg font-semibold tracking-tight">
        {meal.strMeal}
      </h2>
    </Link>
  );
}
