import "server-only";
import { cookies } from "next/headers";

export const FAVORITES_COOKIE = "recipe-favorites";
export const MAX_FAVORITES = 50;

export function isValidMealId(value: unknown): value is string {
  return typeof value === "string" && /^\d{1,20}$/.test(value);
}

export function parseFavoriteIds(value: string | undefined): string[] {
  if (!value) {
    return [];
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(value);
  } catch {
    return [];
  }

  if (!Array.isArray(parsed) || parsed.length > MAX_FAVORITES) {
    return [];
  }

  const ids: string[] = [];
  for (const id of parsed) {
    if (!isValidMealId(id)) {
      return [];
    }
    if (!ids.includes(id)) {
      ids.push(id);
    }
  }
  return ids;
}

export async function getFavoriteIds(): Promise<string[]> {
  const cookieStore = await cookies();
  return parseFavoriteIds(cookieStore.get(FAVORITES_COOKIE)?.value);
}
