"use client";

import { useFavoritesLimit } from "@/components/FavoritesLimitProvider";

export default function FavoritesLimitSetting() {
  const { policy, setPolicy } = useFavoritesLimit();

  return (
    <label className="flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:gap-4">
      <span className="font-medium text-stone-700">
        When your list reaches 50:
      </span>
      <select
        value={policy}
        onChange={(event) => {
          const value = event.target.value;
          if (value === "reject" || value === "replace-oldest") {
            setPolicy(value);
          }
        }}
        className="rounded-xl border border-stone-300 bg-white px-3 py-2 text-stone-800 outline-none focus:border-emerald-800 focus:ring-2 focus:ring-emerald-800/15"
      >
        <option value="reject">Keep existing; reject new favourite</option>
        <option value="replace-oldest">Remove oldest; add new favourite</option>
      </select>
    </label>
  );
}
