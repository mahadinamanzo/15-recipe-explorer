"use client";

import { useOptimistic, useState, useTransition } from "react";
import { setFavorite } from "@/app/actions/favorites";
import { useFavoritesLimit } from "@/components/FavoritesLimitProvider";

export default function FavoriteButton({
  mealId,
}: {
  mealId: string;
}) {
  const { policy, favoriteIds, setFavoriteIds, favoritesReady } =
    useFavoritesLimit();
  const isFavorite = favoriteIds.includes(mealId);
  const [optimisticFavorite, setOptimisticFavorite] = useOptimistic(isFavorite);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  function toggleFavorite() {
    const nextValue = !optimisticFavorite;
    setMessage("");

    startTransition(async () => {
      setOptimisticFavorite(nextValue);
      try {
        const result = await setFavorite(mealId, nextValue, policy);
        if (!result.ok) {
          setMessage(
            result.reason === "limit"
              ? "Your favourites are full. Change the limit setting to add this recipe."
              : "This recipe could not be saved.",
          );
        } else {
          setFavoriteIds(result.ids);
        }
      } catch {
        setMessage("This recipe could not be saved. Please try again.");
      }
    });
  }

  return (
    <span className="relative inline-flex flex-col items-center">
      <button
        type="button"
        onClick={toggleFavorite}
        disabled={isPending || !favoritesReady}
        aria-pressed={optimisticFavorite}
        aria-label={
          optimisticFavorite ? "Remove from favourites" : "Add to favourites"
        }
        className={`grid size-11 place-items-center rounded-full border border-white/70 bg-white/95 text-2xl shadow-md transition hover:scale-105 disabled:cursor-wait disabled:opacity-70 ${
          optimisticFavorite ? "text-rose-600" : "text-stone-500"
        }`}
      >
        {optimisticFavorite ? "♥" : "♡"}
      </button>
      {message && (
        <span
          role="status"
          className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl bg-white p-3 text-left text-xs leading-5 text-rose-800 shadow-lg ring-1 ring-stone-200"
        >
          {message}
        </span>
      )}
    </span>
  );
}
