"use client";

import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface AddMealFormProps {
  patientId: number;
  token: string;
}

export default function AddMealForm({ patientId, token }: AddMealFormProps) {
  const router = useRouter();
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [readDate, setReadDate] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fats, setFats] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const now = new Date();
    setReadDate(now.toISOString().split("T")[0]);
  }, []);

  const handleCancel = () => {
    setName("");
    const now = new Date();
    setReadDate(now.toISOString().split("T")[0]);
    setCalories("");
    setProtein("");
    setCarbs("");
    setFats("");
    setNotes("");
    setError(null);
  };

  const handleSave = async () => {
    if (!name.trim()) return setError("Please provide a meal name.");
    if (!readDate) return setError("Please select a date.");

    let formattedDate = new Date().toISOString();
    try {
      const selectedDate = new Date(readDate);
      if (selectedDate.toDateString() === new Date().toDateString()) {
        formattedDate = new Date().toISOString();
      } else {
        formattedDate = selectedDate.toISOString();
      }
    } catch {
      // ignore
    }

    setLoadingSubmit(true);
    setError(null);

    const payload = {
      patientId,
      name,
      read_date: formattedDate,
      calories: Number(calories) || 0,
      protein: Number(protein) || 0,
      carbs: Number(carbs) || 0,
      fats: Number(fats) || 0,
      notes,
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API}/Meal/AddNewMeal`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      if (!res.ok) throw new Error("Failed to add meal");

      handleCancel();
      router.refresh();
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred",
      );
    } finally {
      setLoadingSubmit(false);
    }
  };

  if (patientId === 0) return null;

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Form Content - Flexible area */}
      <div className="flex-1 space-y-8 sm:space-y-10 pb-10">
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-600 text-[11px] sm:text-sm font-medium">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <div className="space-y-2">
            <label className="block text-[11px] sm:text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
              Meal Description <span className="text-red-500">*</span>
            </label>
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#259ee4]">
                <span className="material-icons text-xl sm:text-2xl">
                  restaurant
                </span>
              </span>
              <input
                className="w-full pl-12 pr-4 py-3 sm:py-4 text-sm sm:text-base bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#259ee4] focus:border-transparent outline-none transition-all placeholder-slate-400 dark:text-white shadow-sm"
                placeholder="e.g., Breakfast Omelette"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[11px] sm:text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
              Date Consumed <span className="text-red-500">*</span>
            </label>
            <div className="relative border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
              <input
                className="w-full px-4 py-3 sm:py-4 text-sm sm:text-base bg-transparent focus:ring-2 focus:ring-[#259ee4] focus:border-transparent outline-none transition-all dark:text-white [color-scheme:light] dark:[color-scheme:dark]"
                type="date"
                value={readDate}
                onChange={(e) => setReadDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-[11px] sm:text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
            Nutritional Breakdown
          </label>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { label: "Calories", unit: "kcal", value: calories, setter: setCalories, icon: "local_fire_department", color: "text-orange-500" },
              { label: "Protein", unit: "g", value: protein, setter: setProtein, icon: "fitness_center", color: "text-blue-500" },
              { label: "Carbs", unit: "g", value: carbs, setter: setCarbs, icon: "bakery_dining", color: "text-emerald-500" },
              { label: "Fats", unit: "g", value: fats, setter: setFats, icon: "opacity", color: "text-amber-500" },
            ].map((macro) => (
              <div key={macro.label} className="space-y-1.5">
                <label className="block text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">
                  {macro.label}
                </label>
                <div className="relative group">
                  <span className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${macro.color} opacity-80 group-focus-within:opacity-100 transition-opacity`}>
                    <span className="material-icons text-lg sm:text-xl">{macro.icon}</span>
                  </span>
                  <input
                    className="w-full pl-10 pr-3 py-3 sm:py-3.5 text-sm sm:text-base bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#259ee4] outline-none transition-all dark:text-white shadow-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="0"
                    type="number"
                    min="0"
                    value={macro.value}
                    onChange={(e) => macro.setter(e.target.value)}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 uppercase">
                    {macro.unit}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-[11px] sm:text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
            Contextual Notes
          </label>
          <textarea
            className="w-full px-4 py-4 sm:py-5 text-sm sm:text-base bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#259ee4] focus:border-transparent outline-none transition-all dark:text-white resize-none shadow-sm"
            rows={4}
            placeholder="Add any specific details about your meal intake..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          ></textarea>
        </div>
      </div>

      {/* Unified Action Footer - Following Medicine Page Structure */}
      <div className="-mx-4 sm:-mx-6 md:-mx-8 px-4 sm:px-6 md:px-8 py-5 sm:py-6 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex flex-col-reverse sm:flex-row justify-end items-stretch sm:items-center gap-3 shrink-0 rounded-b-[2rem]">
        <button
          type="button"
          onClick={handleCancel}
          className="w-full sm:w-auto px-6 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-sm transition-colors text-center"
        >
          Clear All Fields
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={loadingSubmit}
          className="w-full sm:w-auto justify-center px-8 py-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm shadow-md shadow-blue-500/30 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loadingSubmit ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <span className="material-icons text-lg">add_circle</span>
          )}
          Log Meal Entry
        </button>
      </div>
    </div>
  );
}
