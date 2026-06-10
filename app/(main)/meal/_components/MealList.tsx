import React from "react";
import { Utensils } from "lucide-react";
import { BASE_API } from "@/app/config";

interface Meal {
  id?: number;
  patientId: number;
  name: string;
  read_date: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  notes: string;
}

interface MealListProps {
  patientId: number;
  token: string;
}

export default async function MealList({ patientId, token }: MealListProps) {
  let meals: Meal[] = [];

  if (patientId > 0 && token) {
    try {
      const res = await fetch(
        `${BASE_API}/Meal/GetAllMealsForPatient/${patientId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        },
      );
      if (res.ok) {
        const data = await res.json();
        meals = data.sort(
          (a: Meal, b: Meal) =>
            new Date(b.read_date).getTime() - new Date(a.read_date).getTime(),
        );
      }
    } catch (err) {
      console.error("Failed to fetch meals", err);
    }
  }

  return (
    <div className="w-full h-full bg-white/90 dark:bg-slate-900/70 border border-slate-200/90 dark:border-slate-800 backdrop-blur-sm rounded-[2rem] shadow-sm flex flex-col animate-in fade-in duration-500 fill-mode-both overflow-hidden">
      <div className="px-5 sm:px-6 md:px-8 py-4 sm:py-5 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-10 shrink-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
          Recent Meal History
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Your dietary intake and nutritional logs
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-3 sm:p-5 md:p-6 space-y-3 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full dark:[&::-webkit-scrollbar-thumb]:bg-slate-600">
        {meals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-500">
            <span className="material-icons text-5xl sm:text-6xl mb-3 opacity-20">
              restaurant_menu
            </span>
            <p className="text-sm sm:text-base font-semibold px-4 text-center">
              No meals logged yet.
            </p>
          </div>
        ) : (
          meals.map((meal, idx) => (
            <div
              key={meal.id || idx}
              className="p-3 sm:p-4 rounded-xl flex flex-col justify-between gap-3 border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 hover:border-[#259ee4]/30 transition-colors group"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                {/* Left value box (Calories) */}
                <div className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl border flex flex-col items-center justify-center text-[#259ee4] bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800/50">
                  <span className="text-lg sm:text-xl font-black">
                    {Math.round(meal.calories)}
                  </span>
                  <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest -mt-1 opacity-60">
                    kcal
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-sm sm:text-base font-bold text-slate-800 dark:text-white truncate">
                    {meal.name}
                  </h3>
                  <div className="flex items-center gap-1 mt-0.5 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
                    <span className="material-icons text-[12px] sm:text-[14px]">
                      schedule
                    </span>
                    {new Date(meal.read_date).toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </div>
                </div>
              </div>

              {/* Macros Row */}
              <div className="grid grid-cols-3 gap-2 border-t border-slate-100 dark:border-slate-800/50 pt-2.5">
                {[
                  {
                    label: "Protein",
                    val: meal.protein,
                    unit: "g",
                    color: "text-blue-500",
                  },
                  {
                    label: "Carbs",
                    val: meal.carbs,
                    unit: "g",
                    color: "text-emerald-500",
                  },
                  {
                    label: "Fats",
                    val: meal.fats,
                    unit: "g",
                    color: "text-amber-500",
                  },
                ].map((macro) => (
                  <div key={macro.label} className="flex flex-col text-center">
                    <span className="text-[9px] font-bold uppercase text-slate-400 tracking-tighter">
                      {macro.label}
                    </span>
                    <span className={`text-xs font-bold ${macro.color}`}>
                      {macro.val}
                      {macro.unit}
                    </span>
                  </div>
                ))}
              </div>

              {meal.notes && (
                <div className="bg-slate-100/50 dark:bg-white/5 border border-slate-200/50 dark:border-slate-700/50 px-2.5 py-1.5 rounded-lg">
                  <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 italic line-clamp-1">
                    "{meal.notes}"
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
