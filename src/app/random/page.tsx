import { notFound, redirect } from "next/navigation";
import { getRandomMeal } from "@/lib/mealdb";

export const metadata = {
  title: "Random recipe",
};

export default async function RandomRecipePage() {
  const meal = await getRandomMeal();
  if (!meal) {
    notFound();
  }

  redirect(`/meal/${meal.idMeal}`);
}
