"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { FavoritesLimitPolicy } from "@/app/actions/favorites";
import { loadFavoriteIds } from "@/app/actions/favorites";

type FavoritesLimitContextValue = {
  policy: FavoritesLimitPolicy;
  setPolicy: (policy: FavoritesLimitPolicy) => void;
  favoriteIds: string[];
  setFavoriteIds: (ids: string[]) => void;
  favoritesReady: boolean;
};

const FavoritesLimitContext =
  createContext<FavoritesLimitContextValue | null>(null);
const STORAGE_KEY = "recipe-favorites-limit-policy";

export function FavoritesLimitProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [policy, setPolicyState] = useState<FavoritesLimitPolicy>("reject");
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [favoritesReady, setFavoritesReady] = useState(false);
  const [favoriteLoadFailed, setFavoriteLoadFailed] = useState(false);

  useEffect(() => {
    const storedPolicy = window.localStorage.getItem(STORAGE_KEY);
    if (storedPolicy === "reject" || storedPolicy === "replace-oldest") {
      setPolicyState(storedPolicy);
    }

    let active = true;
    loadFavoriteIds()
      .then((ids) => {
        if (active) {
          setFavoriteIds(ids);
        }
      })
      .catch(() => {
        if (active) {
          setFavoriteLoadFailed(true);
        }
      })
      .finally(() => {
        if (active) {
          setFavoritesReady(true);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const setPolicy = useCallback((nextPolicy: FavoritesLimitPolicy) => {
    setPolicyState(nextPolicy);
    window.localStorage.setItem(STORAGE_KEY, nextPolicy);
  }, []);

  return (
    <FavoritesLimitContext.Provider
      value={{
        policy,
        setPolicy,
        favoriteIds,
        setFavoriteIds,
        favoritesReady,
      }}
    >
      {favoriteLoadFailed && (
        <p
          role="alert"
          className="border-b border-rose-200 bg-rose-50 px-6 py-3 text-center text-sm text-rose-800"
        >
          Saved favourites could not be loaded. You can still update them by
          using a recipe&apos;s heart button.
        </p>
      )}
      {children}
    </FavoritesLimitContext.Provider>
  );
}

export function useFavoritesLimit() {
  const context = useContext(FavoritesLimitContext);
  if (!context) {
    throw new Error(
      "useFavoritesLimit must be used within a FavoritesLimitProvider.",
    );
  }
  return context;
}
