import React from "react";
import { Loader2, Utensils } from "lucide-react";

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
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/Meal/GetAllMealsForPatient/${patientId}`, {
        headers: { "Authorization": `Bearer ${token}` },
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        meals = data.sort((a: Meal, b: Meal) => new Date(b.read_date).getTime() - new Date(a.read_date).getTime());
      }
    } catch (err) {
      console.error("Failed to fetch meals", err);
    }
  }
  return (
    <div className="group relative w-full shrink-0 xl:shrink xl:flex-1 xl:max-w-md overflow-hidden rounded-[2rem] border shadow-sm transition duration-300 border-slate-200/90 bg-white/90 dark:border-slate-700/80 dark:bg-slate-900/70 backdrop-blur-sm hover:border-emerald-200 dark:hover:border-emerald-400/45 flex flex-col min-h-[400px] xl:max-h-[calc(100vh-8rem)]">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-emerald-400 to-green-500 opacity-90 z-20" />
      <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-10 shrink-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-[family-name:var(--font-geist-sans)]">Recent Meals</h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 sm:mt-0">Diet history and nutritional tracking</p>
      </div>

      <div className="xl:flex-1 xl:overflow-y-auto p-4 flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 xl:flex-col [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full dark:[&::-webkit-scrollbar-thumb]:bg-slate-600">
        {meals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-500 w-full shrink-0">
            <Utensils className="w-16 h-16 mb-3 opacity-20" />
            <p className="font-semibold px-4 text-center">No meals found.</p>
            <p className="text-xs mt-1 text-center px-6">Add your first meal using the form to start tracking.</p>
          </div>
        ) : (
          meals.map((meal, idx) => (
            <div key={meal.id || idx} className="p-4 rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 hover:border-emerald-500/30 transition-colors group w-full sm:flex-1 sm:min-w-[240px] xl:flex-none xl:w-full">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white truncate max-w-[200px]">{meal.name}</h3>
                  <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">{meal.calories} kcal</p>
                </div>
                <div className="bg-white dark:bg-slate-800 px-2 py-1 rounded text-xs font-semibold text-slate-600 dark:text-slate-300 shadow-sm border border-slate-200 dark:border-slate-700">
                  {new Date(meal.read_date).toLocaleDateString()}
                </div>
              </div>
              
              {/* Macros summary */}
              <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-center border-t border-slate-200 dark:border-slate-700 pt-2">
                <div className="flex flex-col">
                  <span className="text-slate-400">Protein</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{meal.protein}g</span>
                </div>
                <div className="flex flex-col border-x border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400">Carbs</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{meal.carbs}g</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-400">Fats</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{meal.fats}g</span>
                </div>
              </div>

              {meal.notes && (
                <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 bg-black/5 dark:bg-white/5 p-2 rounded truncate">
                  {meal.notes}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
