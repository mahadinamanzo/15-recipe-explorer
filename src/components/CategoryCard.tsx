import Image from "next/image";
import Link from "next/link";
import type { MealCategory } from "@/lib/mealdb";

export default function CategoryCard({
  category,
}: {
  category: MealCategory;
}) {
  return (
    <Link
      href={`/category/${encodeURIComponent(category.strCategory)}`}
      className="group overflow-hidden rounded-3xl border border-stone-200 bg-white transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
        <Image
          src={category.strCategoryThumb}
          alt={`${category.strCategory} dishes`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-5">
        <h2 className="text-xl font-semibold tracking-tight">
          {category.strCategory}
        </h2>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-stone-600">
          {category.strCategoryDescription}
        </p>
        <span className="mt-4 inline-block text-sm font-semibold text-emerald-800">
          Browse recipes <span aria-hidden="true">→</span>
        </span>
      </div>
    </Link>
  );
}
