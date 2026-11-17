import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import IngredientsChecklist from "@/components/IngredientsChecklist";
import FavoriteButton from "@/components/FavoriteButton";
import Skeleton from "@/components/Skeleton";
import { getMeal } from "@/lib/mealdb";
import RelatedMeals from "./RelatedMeals";

type MealPageProps = {
  params: Promise<{ id: string }>;
};

function getYoutubeEmbedUrl(videoUrl: string | null): string | null {
  if (!videoUrl) {
    return null;
  }

  try {
    const url = new URL(videoUrl);
    if (url.protocol !== "https:" || url.username || url.password) {
      return null;
    }

    let videoId: string | null = null;
    if (
      ["youtube.com", "www.youtube.com", "m.youtube.com"].includes(
        url.hostname,
      ) &&
      url.pathname === "/watch"
    ) {
      videoId = url.searchParams.get("v");
    } else if (url.hostname === "youtu.be") {
      videoId = url.pathname.slice(1);
    }

    if (!videoId || !/^[A-Za-z0-9_-]{11}$/.test(videoId)) {
      return null;
    }

    return `https://www.youtube-nocookie.com/embed/${videoId}`;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: MealPageProps): Promise<Metadata> {
  const { id } = await params;
  const meal = await getMeal(id);

  if (!meal) {
    return { title: "Recipe not found" };
  }

  return {
    title: meal.strMeal,
    description: `${meal.strMeal}, a ${meal.strArea} recipe in ${meal.strCategory}.`,
  };
}

export default async function MealPage({ params }: MealPageProps) {
  const { id } = await params;
  const meal = await getMeal(id);

  if (!meal) {
    notFound();
  }

  const instructions = meal.strInstructions
    .split(/\r?\n/)
    .map((step) => step.trim())
    .filter(Boolean);
  const youtubeEmbedUrl = getYoutubeEmbedUrl(meal.strYoutube);

  return (
    <main className="mx-auto max-w-7xl px-6 py-10 sm:py-14">
      <Link
        href={`/category/${encodeURIComponent(meal.strCategory)}`}
        className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 hover:text-emerald-950"
      >
        <span aria-hidden="true">←</span> {meal.strCategory} recipes
      </Link>

      <section className="grid items-start gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
        <div className="relative aspect-square overflow-hidden rounded-3xl bg-stone-200">
          <Image
            src={meal.strMealThumb}
            alt={meal.strMeal}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-cover"
          />
        </div>
        <div className="py-2">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-800">
            Recipe
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            {meal.strMeal}
          </h1>
          <div className="mt-4">
            <FavoriteButton mealId={meal.idMeal} />
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {meal.strArea && (
              <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-sm text-emerald-950">
                <span className="font-semibold">Area:</span> {meal.strArea}
              </span>
            )}
            {meal.strCategory && (
              <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-sm text-emerald-950">
                <span className="font-semibold">Category:</span>{" "}
                {meal.strCategory}
              </span>
            )}
            {meal.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-900"
              >
                {tag}
              </span>
            ))}
          </div>

          <section className="mt-9 rounded-3xl border border-stone-200 bg-white p-6 sm:p-8">
            <div className="mb-3 flex items-baseline justify-between gap-4">
              <h2 className="text-2xl font-bold tracking-tight">Ingredients</h2>
              <span className="text-sm text-stone-500">
                {meal.ingredients.length} items
              </span>
            </div>
            {meal.ingredients.length > 0 ? (
              <IngredientsChecklist ingredients={meal.ingredients} />
            ) : (
              <p className="text-sm text-stone-600">
                Ingredient details are not available for this recipe.
              </p>
            )}
          </section>
        </div>
      </section>

      <section className="mt-12">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-800">
          Let&apos;s get cooking
        </p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight">
          Step-by-step instructions
        </h2>
        {instructions.length > 0 ? (
          <ol className="mt-7 space-y-5">
            {instructions.map((instruction, index) => (
              <li
                key={`${index}-${instruction.slice(0, 32)}`}
                className="flex gap-4 rounded-2xl border border-stone-200 bg-white p-5 sm:p-6"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-emerald-800 text-sm font-bold text-white">
                  {index + 1}
                </span>
                <p className="pt-1 text-base leading-7 text-stone-700">
                  {instruction}
                </p>
              </li>
            ))}
          </ol>
        ) : (
          <p className="mt-5 rounded-2xl border border-stone-200 bg-white p-6 text-stone-600">
            Instructions are not available for this recipe.
          </p>
        )}
      </section>

      {youtubeEmbedUrl && (
        <section className="mt-12">
          <h2 className="mb-5 text-3xl font-bold tracking-tight">
            Watch the recipe
          </h2>
          <div className="aspect-video overflow-hidden rounded-3xl bg-stone-200">
            <iframe
              src={youtubeEmbedUrl}
              title={`${meal.strMeal} recipe video`}
              className="size-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </section>
      )}

      <div className="mt-16 border-t border-stone-200 pt-12">
        <Suspense fallback={<Skeleton />}>
          <RelatedMeals category={meal.strCategory} currentMealId={meal.idMeal} />
        </Suspense>
      </div>
    </main>
  );
}
