import { NextResponse } from "next/server";
import { searchMeals } from "@/lib/mealdb";

const errorHeaders = {
  "Cache-Control": "no-store",
};

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.trim() ?? "";

  if (query.length < 2) {
    return NextResponse.json(
      { error: "Search query must be at least 2 characters." },
      { status: 400, headers: errorHeaders },
    );
  }

  const meals = await searchMeals(query);

  return NextResponse.json(
    {
      results: meals.slice(0, 8).map((meal) => ({
        id: meal.idMeal,
        name: meal.strMeal,
        thumb: meal.strMealThumb,
      })),
    },
    {
      headers: {
        "Cache-Control":
          "public, max-age=0, s-maxage=60, stale-while-revalidate=300",
      },
    },
  );
}
