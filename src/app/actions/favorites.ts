"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import {
  FAVORITES_COOKIE,
  getFavoriteIds,
  isValidMealId,
  MAX_FAVORITES,
  parseFavoriteIds,
} from "@/lib/favorites";

export type FavoritesLimitPolicy = "reject" | "replace-oldest";

export type FavoriteActionResult =
  | { ok: true; ids: string[] }
  | { ok: false; reason: "invalid" | "limit" };

export async function loadFavoriteIds(): Promise<string[]> {
  return getFavoriteIds();
}

export async function setFavorite(
  mealId: string,
  shouldBeFavorite: boolean,
  limitPolicy: FavoritesLimitPolicy,
): Promise<FavoriteActionResult> {
  if (
    !isValidMealId(mealId) ||
    typeof shouldBeFavorite !== "boolean" ||
    (limitPolicy !== "reject" && limitPolicy !== "replace-oldest")
  ) {
    return { ok: false, reason: "invalid" };
  }

  const cookieStore = await cookies();
  const ids = parseFavoriteIds(cookieStore.get(FAVORITES_COOKIE)?.value);
  const alreadyFavorite = ids.includes(mealId);

  if (shouldBeFavorite && !alreadyFavorite) {
    if (ids.length >= MAX_FAVORITES) {
      if (limitPolicy === "reject") {
        return { ok: false, reason: "limit" };
      }
      ids.shift();
    }
    ids.push(mealId);
  } else if (!shouldBeFavorite && alreadyFavorite) {
    ids.splice(ids.indexOf(mealId), 1);
  } else {
    return { ok: true, ids };
  }

  cookieStore.set(FAVORITES_COOKIE, JSON.stringify(ids), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  revalidatePath("/favourites");

  return { ok: true, ids };
}
