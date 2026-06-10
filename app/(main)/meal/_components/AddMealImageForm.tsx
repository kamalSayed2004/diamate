"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { BASE_API, FOOD_API, ING_API } from "@/app/config";

interface AddMealImageFormProps {
  patientId: number;
  token: string;
}

export default function AddMealImageForm({
  patientId,
  token,
}: AddMealImageFormProps) {
  const router = useRouter();
  const [loadingSave, setLoadingSave] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [readDate, setReadDate] = useState(
    () => new Date().toISOString().split("T")[0],
  );
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [detectedItems, setDetectedItems] = useState<string[]>([]);
  const [ingredientsAmounts, setIngredientsAmounts] = useState<
    Record<string, string>
  >({});

  const previewUrl = useMemo(() => {
    if (!imageFile) return "";
    return URL.createObjectURL(imageFile);
  }, [imageFile]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleCancel = () => {
    const today = new Date();
    setReadDate(today.toISOString().split("T")[0]);
    setName("");
    setNotes("");
    setImageFile(null);
    setDetectedItems([]);
    setIngredientsAmounts({});
    setError(null);
    setSuccess(null);
  };

  const handleSave = async () => {
    if (!imageFile) {
      return setError("Please upload a meal image.");
    }

    setLoadingSave(true);
    setError(null);
    setSuccess(null);
    setDetectedItems([]);
    setIngredientsAmounts({});

    try {
      const formData = new FormData();
      formData.append("file", imageFile, imageFile.name);

      const res = await fetch(FOOD_API || "http://127.0.0.1:5050/detect-food", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to analyze image. Please try again.");
      }

      const data = await res.json();

      if (data.food_detected && data.detected_items?.length > 0) {
        const items = data.detected_items.map((i: any) => i.class_name);
        setDetectedItems(items);
        const initialAmounts: Record<string, string> = {};
        items.forEach((item: string) => {
          initialAmounts[item] = "";
        });
        setIngredientsAmounts(initialAmounts);
        setSuccess("Food detected! Please specify the amount for each item.");
      } else {
        setSuccess("Image analyzed, but no food was detected.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during analysis.");
    } finally {
      setLoadingSave(false);
    }
  };

  const handleSubmitMeal = async () => {
    if (!name.trim()) return setError("Please provide a meal name.");
    if (detectedItems.length === 0) return setError("No ingredients detected.");

    for (const item of detectedItems) {
      if (!ingredientsAmounts[item] || Number(ingredientsAmounts[item]) <= 0) {
        return setError(`Please provide a valid amount for ${item}.`);
      }
    }

    setLoadingSave(true);
    setError(null);
    setSuccess(null);

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

    try {
      const savedMeals = [];

      // Process each ingredient individually
      for (const item of detectedItems) {
        const amountKg = Number(ingredientsAmounts[item]);

        // Fetch macronutrient data from macros API
        const macrosRes = await fetch(`${ING_API}${encodeURIComponent(item)}`, {
          method: "GET",
        });

        if (!macrosRes.ok) {
          console.warn(`Failed to fetch macros for ${item}`);
          continue;
        }

        const macrosData = await macrosRes.json();

        // Calculate nutritional values based on amount in kg (1kg = 1000g)
        const caloriesPer100g = macrosData.calories_per_100g || 0;
        const proteinG = macrosData.protein_g || 0;
        const carbsG = macrosData.carbs_g || 0;
        const fatG = macrosData.fat_g || 0;

        // Convert kg to grams and calculate total nutrients
        const totalGrams = amountKg * 1000;
        const calories = Math.round((caloriesPer100g / 100) * totalGrams);
        const protein = Math.round((proteinG / 100) * totalGrams * 100) / 100;
        const carbs = Math.round((carbsG / 100) * totalGrams * 100) / 100;
        const fats = Math.round((fatG / 100) * totalGrams * 100) / 100;

        // Create meal payload for each ingredient
        const mealPayload = {
          patientId,
          name: `${name} - ${item}`,
          read_date: formattedDate,
          calories,
          protein,
          carbs,
          fats,
          notes: `${notes || ""}${notes ? " | " : ""}Amount: ${amountKg} kg`,
        };

        // Save each ingredient as a separate meal
        const saveMealRes = await fetch(`${BASE_API}/Meal/AddNewMeal`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(mealPayload),
        });

        if (!saveMealRes.ok) {
          throw new Error(`Failed to save meal for ingredient: ${item}`);
        }

        savedMeals.push(item);
      }

      if (savedMeals.length === 0) {
        throw new Error("No ingredients were saved successfully");
      }

      setSuccess(
        `AI Meal saved successfully! ${savedMeals.length} ingredient(s) added.`,
      );
      handleCancel();
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoadingSave(false);
    }
  };

  if (patientId === 0) return null;

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Scrollable Content area */}
      <div className="flex-1 space-y-8 sm:space-y-10 pb-10">
        {/* Feedback Messages */}
        <div className="space-y-3">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-xl text-red-600 text-[11px] sm:text-sm font-medium flex items-center gap-2">
              <span className="material-icons text-lg">info</span>
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/50 rounded-xl text-emerald-700 dark:text-emerald-400 text-[11px] sm:text-sm font-medium flex items-center gap-2">
              <span className="material-icons text-lg">check_circle</span>
              {success}
            </div>
          )}
        </div>

        {/* Upload Section */}
        <div className="space-y-5">
          {!imageFile ? (
            <div className="relative group">
              <input
                id="meal-image-upload"
                type="file"
                accept=".png,.jpg,.jpeg"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setImageFile(file);
                    setError(null);
                  }
                }}
              />
              <label
                htmlFor="meal-image-upload"
                className="flex flex-col items-center justify-center gap-6 p-10 sm:p-20 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-[#259ee4] transition-all duration-300 cursor-pointer shadow-sm"
              >
                <div className="w-20 h-20 rounded-2xl bg-[#259ee4]/10 flex items-center justify-center text-[#259ee4]">
                  <span className="material-icons text-5xl">cloud_upload</span>
                </div>
                <div className="text-center">
                  <p className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100">
                    Upload Meal Photo
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    PNG, JPG, JPEG (Max 10MB)
                  </p>
                </div>
              </label>
            </div>
          ) : (
            <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 group shadow-xl max-h-[500px]">
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Meal preview"
                  className="w-full h-full object-contain mx-auto"
                />
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <button
                  onClick={() => setImageFile(null)}
                  className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110"
                >
                  <span className="material-icons text-2xl">delete</span>
                </button>
              </div>
            </div>
          )}

          {imageFile && detectedItems.length === 0 && (
            <button
              onClick={handleSave}
              disabled={loadingSave}
              className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl shadow-md shadow-blue-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loadingSave ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <span className="material-icons">auto_awesome</span>
              )}
              Analyze Ingredients
            </button>
          )}
        </div>

        {/* Ingredients List */}
        {detectedItems.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 animate-in fade-in slide-in-from-top-2 duration-500">
            {detectedItems.map((item) => (
              <div
                key={item}
                className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm space-y-3"
              >
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#259ee4] capitalize">
                  {item}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className="w-full pl-3 pr-10 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-[#259ee4] outline-none transition-all dark:text-white font-mono font-bold text-lg"
                    value={ingredientsAmounts[item] || ""}
                    onChange={(e) =>
                      setIngredientsAmounts((prev) => ({
                        ...prev,
                        [item]: e.target.value,
                      }))
                    }
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 uppercase">
                    kg
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Final Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="space-y-2">
            <label className="block text-[11px] sm:text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
              Meal Label
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#259ee4]">
                <span className="material-icons text-xl">label</span>
              </span>
              <input
                className="w-full pl-12 pr-4 py-3 sm:py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#259ee4] outline-none transition-all dark:text-white shadow-sm font-medium"
                placeholder="e.g., Healthy Lunch"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[11px] sm:text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
              Consumption Date
            </label>
            <div className="relative border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
              <input
                className="w-full px-4 py-3 sm:py-4 text-sm sm:text-base bg-transparent focus:ring-2 focus:ring-[#259ee4] outline-none transition-all dark:text-white [color-scheme:light] dark:[color-scheme:dark]"
                type="date"
                value={readDate}
                onChange={(e) => setReadDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-[11px] sm:text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
            Context Notes
          </label>
          <textarea
            className="w-full px-4 py-4 sm:py-5 text-sm sm:text-base bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#259ee4] outline-none transition-all dark:text-white resize-none shadow-sm"
            rows={3}
            placeholder="Any extra context about this meal..."
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
          Reset Analysis
        </button>
        <button
          type="button"
          onClick={handleSubmitMeal}
          disabled={loadingSave || detectedItems.length === 0}
          className="w-full sm:w-auto justify-center px-8 py-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm shadow-md shadow-blue-500/30 transition-all flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {loadingSave ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <span className="material-icons text-lg">task_alt</span>
          )}
          Finalize AI Entry
        </button>
      </div>
    </div>
  );
}
