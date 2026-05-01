"use client";

import React, { useState } from "react";
import AddMealForm from "./AddMealForm";
import AddMealImageForm from "./AddMealImageForm";

interface MealClientProps {
  patientId: number;
  token: string;
  mealList: React.ReactNode;
}

export default function MealClient({
  patientId,
  token,
  mealList,
}: MealClientProps) {
  const [activeTab, setActiveTab] = useState<"manual" | "image">("manual");

  if (patientId === 0) return null;

  return (

    <div className="w-full h-full p-3 sm:p-5 md:p-8 flex flex-col sm:flex-col-reverse gap-4 sm:gap-6 md:gap-8 lg:h-full lg:overflow-hidden">

      <div className="flex flex-col xl:flex-row gap-5 sm:gap-6 md:gap-8 flex-1 min-h-0 overflow-y-auto xl:overflow-hidden">
        {/* Main Log Column */}
        <div className="flex-1 flex flex-col min-h-0 order-1 animate-in fade-in slide-in-from-left-4 duration-700">
          <div className="group relative w-full h-full overflow-hidden rounded-[2rem] border shadow-lg shadow-slate-200/50 dark:shadow-none transition duration-300 border-slate-200/90 bg-white dark:border-slate-700/80 dark:bg-slate-900/90 backdrop-blur-sm flex flex-col">
            <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-blue-500 via-[#259ee4] to-blue-600 z-20" />

            {/* Tab Header */}
            <div className="px-4 sm:px-6 md:px-8 py-5 sm:py-6 border-b border-slate-100 dark:border-slate-800 bg-transparent shrink-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                    {activeTab === "manual" ? "Manual Entry" : "AI Vision Log"}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {activeTab === "manual"
                      ? "Enter your meal details manually"
                      : "Snap a photo to automatically detect ingredients"}
                  </p>
                </div>

                <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl self-start sm:self-center">
                  <button
                    onClick={() => setActiveTab("manual")}
                    className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all duration-300 ${activeTab === "manual"
                      ? "bg-white dark:bg-slate-700 text-[#259ee4] shadow-sm"
                      : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                      }`}
                  >
                    <span className="material-icons text-lg">edit_note</span>
                    Manual
                  </button>
                  <button
                    onClick={() => setActiveTab("image")}
                    className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all duration-300 ${activeTab === "image"
                      ? "bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm"
                      : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                      }`}
                  >
                    <span className="material-icons text-lg">auto_awesome</span>
                    AI Vision
                  </button>
                </div>
              </div>
            </div>

            {/* Content area - scrollable */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-slate-50/30 dark:bg-transparent [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full dark:[&::-webkit-scrollbar-thumb]:bg-slate-600">
              {activeTab === "manual" ? (
                <AddMealForm patientId={patientId} token={token} />
              ) : (
                <AddMealImageForm patientId={patientId} token={token} />
              )}
            </div>
          </div>
        </div>

        {/* History Sidebar - fixed height on desktop */}
        <div className="w-full xl:w-[420px] xl:h-full shrink-0 order-2 animate-in fade-in slide-in-from-right-8 duration-[800ms] delay-200 fill-mode-both">
          {mealList}
        </div>
      </div>
    </div>
  );
}
