"use client";

import { useState } from "react";
import type { Ingredient } from "@/lib/mealdb";

export default function IngredientsChecklist({
  ingredients,
}: {
  ingredients: Ingredient[];
}) {
  const [checked, setChecked] = useState<number[]>([]);

  function toggleIngredient(index: number) {
    setChecked((current) =>
      current.includes(index)
        ? current.filter((item) => item !== index)
        : [...current, index],
    );
  }

  return (
    <ul className="divide-y divide-stone-200">
      {ingredients.map((ingredient, index) => {
        const isChecked = checked.includes(index);

        return (
          <li key={`${ingredient.name}-${index}`}>
            <label className="flex cursor-pointer items-center gap-3 py-3">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => toggleIngredient(index)}
                className="size-4 accent-emerald-800"
              />
              <span
                className={`flex-1 text-sm ${
                  isChecked ? "text-stone-400 line-through" : "text-stone-800"
                }`}
              >
                {ingredient.name}
              </span>
              {ingredient.measure && (
                <span className="text-sm text-stone-500">
                  {ingredient.measure}
                </span>
              )}
            </label>
          </li>
        );
      })}
    </ul>
  );
}
