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
    const today = new Date();
    setReadDate(today.toISOString().split("T")[0]);
  }, []);

  const handleCancel = () => {
    setName("");
    const today = new Date();
    setReadDate(today.toISOString().split("T")[0]);
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
    } catch (e) {
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
      notes
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/Meal/AddNewMeal`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to add meal");

      handleCancel();
      router.refresh();

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingSubmit(false);
    }
  };

  if (patientId === 0) {
    return null;
  }

  return (
    <div className="group relative w-full shrink-0 xl:shrink xl:flex-1 mx-auto xl:mx-0 max-w-3xl overflow-hidden rounded-[2rem] border shadow-sm transition duration-300 border-slate-200/90 bg-white/90 dark:border-slate-700/80 dark:bg-slate-900/70 backdrop-blur-sm hover:border-blue-200 dark:hover:border-emerald-400/45 flex flex-col xl:max-h-[calc(100vh-8rem)]">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-emerald-400 to-green-500 opacity-90 z-20" />

      {/* Header */}
      <div className="px-5 py-4 sm:px-8 sm:py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center sticky top-0 z-10 shrink-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Add Meal</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">Track your diet and nutritional intake</p>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-4 sm:p-5 md:p-8 space-y-4 sm:space-y-6 xl:overflow-y-auto xl:flex-1 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full dark:[&::-webkit-scrollbar-thumb]:bg-slate-600 [&_input[type=number]::-webkit-inner-spin-button]:appearance-none">
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-600 text-sm font-medium">
            {error}
          </div>
        )}

        {/* Form Fields */}
        <div className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Meal Name</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <span className="material-icons text-xl">restaurant</span>
              </span>
              <input
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none transition-all placeholder-slate-400 dark:text-white"
                placeholder="e.g., Grilled Chicken Salad..."
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Date</label>
            <div className="relative border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 overflow-hidden">
              <input
                className="w-full px-4 py-2.5 sm:py-3 bg-transparent focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none transition-all dark:text-white [color-scheme:light] dark:[color-scheme:dark]"
                type="date"
                value={readDate}
                onChange={(e) => setReadDate(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Calories</label>
              <input
                className="w-full px-3 py-2.5 sm:py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none dark:text-white"
                placeholder="kcal"
                type="number"
                min="0"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Prot (g)</label>
              <input
                className="w-full px-3 py-2.5 sm:py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none dark:text-white"
                placeholder="g"
                type="number"
                min="0"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Carbs (g)</label>
              <input
                className="w-full px-3 py-2.5 sm:py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none dark:text-white"
                placeholder="g"
                type="number"
                min="0"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Fats (g)</label>
              <input
                className="w-full px-3 py-2.5 sm:py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none dark:text-white"
                placeholder="g"
                type="number"
                min="0"
                value={fats}
                onChange={(e) => setFats(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Notes</label>
            <textarea
              className="w-full px-4 py-2.5 sm:py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none transition-all dark:text-white resize-none"
              rows={2}
              placeholder="e.g., Added extra dressing"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            ></textarea>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="shrink-0 px-5 py-4 sm:px-8 sm:py-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-700 flex flex-col-reverse sm:flex-row justify-end items-stretch sm:items-center gap-3 sm:gap-4">
        <button type="button" onClick={handleCancel} className="w-full sm:w-auto px-6 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-sm transition-colors text-center">
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={loadingSubmit}
          className="w-full sm:w-auto justify-center px-8 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-md shadow-emerald-500/30 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loadingSubmit ? <Loader2 className="w-5 h-5 animate-spin" /> : <span className="material-icons text-lg">check</span>}
          Save Meal
        </button>
      </div>
    </div>
  );
}
