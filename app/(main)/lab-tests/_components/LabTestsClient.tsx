"use client";

import React, { useState } from "react";
import LabTestForm from "./LabTestForm";
import FootUlcerForm from "./FootUlcerForm";
import LabTestList from "./LabTestList";
import FootUlcerList from "./FootUlcerList";



interface LabTestsClientProps {
  patientId: number;
  token: string;
  labTestList: React.ReactNode;
  footUlcerList: React.ReactNode;
}

export default function LabTestsClient({ patientId, token, labTestList, footUlcerList }: LabTestsClientProps) {
  const [activeTab, setActiveTab] = useState<"lab" | "ulcer">("lab");

  if (patientId === 0) return null;

  return (
    <div className="w-full xl:h-full p-3 sm:p-4 md:p-8 flex flex-col xl:flex-row gap-6 md:gap-8 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full dark:[&::-webkit-scrollbar-thumb]:bg-slate-600">
      {/* Main Form Container */}
      <div className="group relative w-full shrink-0 xl:shrink xl:flex-1 mx-auto xl:mx-0 max-w-3xl overflow-hidden rounded-[2rem] border shadow-sm transition duration-300 border-slate-200/90 bg-white/90 dark:border-slate-700/80 dark:bg-slate-900/70 backdrop-blur-sm hover:border-violet-200 dark:hover:border-violet-400/45 flex flex-col xl:max-h-[calc(100vh-8rem)]">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-500 via-fuchsia-400 to-violet-600 opacity-90 z-20" />

        {/* Header & Tabs */}
        <div className="px-5 sm:px-8 py-5 sm:py-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:justify-between sm:items-center sticky top-0 z-10 shrink-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Health Records</h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">Manage Lab Tests & Foot Ulcers</p>
          </div>

          <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden shadow-inner w-full sm:w-auto">
            <button
              onClick={() => setActiveTab("lab")}
              className={`flex-1 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                activeTab === "lab"
                  ? "bg-white dark:bg-slate-700 text-violet-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              Lab Tests
            </button>
            <button
              onClick={() => setActiveTab("ulcer")}
              className={`flex-1 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                activeTab === "ulcer"
                  ? "bg-white dark:bg-slate-700 text-violet-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              Foot Ulcers
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-4 sm:p-5 md:p-8 xl:overflow-y-auto xl:flex-1 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full dark:[&::-webkit-scrollbar-thumb]:bg-slate-600">
          {activeTab === "lab" ? (
            <LabTestForm patientId={patientId} token={token} />
          ) : (
            <FootUlcerForm patientId={patientId} token={token} />
          )}
        </div>
      </div>

      {/* Sidebar List Component */}
      <div className="group relative w-full xl:flex-1 xl:w-auto xl:max-w-md shrink-0 xl:shrink overflow-hidden rounded-[2rem] border shadow-sm transition duration-300 border-slate-200/90 bg-white/90 dark:border-slate-700/80 dark:bg-slate-900/70 backdrop-blur-sm hover:border-violet-200 dark:hover:border-violet-400/45 flex flex-col min-h-[400px] xl:max-h-[calc(100vh-8rem)]">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-500 via-fuchsia-400 to-violet-600 opacity-90 z-20" />
        <div className="px-5 sm:px-6 py-5 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-10 shrink-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white capitalize">
            Past {activeTab === "lab" ? "Lab Tests" : "Foot Ulcers"}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {activeTab === "lab" ? "History of your lab results" : "History of uploaded ulcer images"}
          </p>
        </div>

        <div className="xl:flex-1 xl:overflow-y-auto p-4 space-y-3 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full dark:[&::-webkit-scrollbar-thumb]:bg-slate-600">
          {activeTab === "lab" ? labTestList : footUlcerList}
        </div>
      </div>
    </div>
  );
}
