import "server-only";

const API_URL = "https://www.themealdb.com/api/json/v1/1";

export interface MealCategory {
  idCategory: string;
  strCategory: string;
  strCategoryDescription: string;
  strCategoryThumb: string;
}

export interface MealSummary {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

export interface MealSearchResult {
  id: string;
  name: string;
  thumb: string;
}

export interface Ingredient {
  name: string;
  measure: string;
}

export interface Meal extends MealSummary {
  strArea: string;
  strCategory: string;
  strInstructions: string;
  strYoutube: string | null;
  tags: string[];
  ingredients: Ingredient[];
}

interface MealDbCategoriesResponse {
  categories: MealCategory[] | null;
}

interface MealDbMealsResponse {
  meals: MealDbMeal[] | null;
}

interface MealDbMeal extends MealSummary {
  strArea?: string | null;
  strCategory?: string | null;
  strInstructions?: string | null;
  strYoutube?: string | null;
  strTags?: string | null;
  [key: `strIngredient${number}`]: string | null | undefined;
  [key: `strMeasure${number}`]: string | null | undefined;
}

async function fetchMealDb<T>(
  path: string,
  revalidate: number,
): Promise<T> {
  const response = await fetch(`${API_URL}/${path}`, {
    next: { revalidate },
  });

  if (!response.ok) {
    throw new Error(`TheMealDB request failed (${response.status}).`);
  }

  return response.json() as Promise<T>;
}

function normaliseMeal(meal: MealDbMeal): Meal {
  const ingredients = Array.from({ length: 20 }, (_, index) => {
    const number = index + 1;
    return {
      name: meal[`strIngredient${number}`]?.trim() ?? "",
      measure: meal[`strMeasure${number}`]?.trim() ?? "",
    };
  }).filter((ingredient) => ingredient.name.length > 0);

  return {
    idMeal: meal.idMeal,
    strMeal: meal.strMeal,
    strMealThumb: meal.strMealThumb,
    strArea: meal.strArea ?? "",
    strCategory: meal.strCategory ?? "",
    strInstructions: meal.strInstructions ?? "",
    strYoutube: meal.strYoutube ?? null,
    tags: meal.strTags
      ?.split(",")
      .map((tag) => tag.trim())
      .filter(Boolean) ?? [],
    ingredients,
  };
}

export async function getCategories(): Promise<MealCategory[]> {
  const data = await fetchMealDb<MealDbCategoriesResponse>(
    "categories.php",
    86_400,
  );
  return data.categories ?? [];
}

export async function getMealsByCategory(
  category: string,
): Promise<MealSummary[]> {
  const data = await fetchMealDb<MealDbMealsResponse>(
    `filter.php?c=${encodeURIComponent(category)}`,
    3_600,
  );
  return data.meals ?? [];
}

export async function searchMeals(query: string): Promise<MealSummary[]> {
  const data = await fetchMealDb<MealDbMealsResponse>(
    `search.php?s=${encodeURIComponent(query)}`,
    3_600,
  );
  return data.meals ?? [];
}

export async function getMeal(id: string): Promise<Meal | null> {
  const data = await fetchMealDb<MealDbMealsResponse>(
    `lookup.php?i=${encodeURIComponent(id)}`,
    3_600,
  );
  const meal = data.meals?.[0];
  return meal ? normaliseMeal(meal) : null;
}
