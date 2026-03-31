import React from "react";
import { Loader2 } from "lucide-react";

interface Medicine {
  id?: number;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate: string;
  notes: string;
}

interface MedicineListProps {
  patientId: number;
  token: string;
}

export default async function MedicineList({ patientId, token }: MedicineListProps) {
  let medicines: Medicine[] = [];

  if (patientId > 0 && token) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/Medicine/GetAllMedicinesForPatient/${patientId}`, {
        headers: { "Authorization": `Bearer ${token}` },
        cache: "no-store",
      });
      if (res.ok) {
        medicines = await res.json();
      }
    } catch (err) {
      console.error("Failed to fetch medicines", err);
    }
  }
  return (
    <div className="group relative w-full xl:flex-1 xl:w-auto xl:max-w-md shrink-0 xl:shrink overflow-hidden rounded-[2rem] border shadow-sm transition duration-300 border-slate-200/90 bg-white/90 dark:border-slate-700/80 dark:bg-slate-900/70 backdrop-blur-sm hover:border-emerald-200 dark:hover:border-emerald-400/45 flex flex-col min-h-[400px] xl:max-h-[calc(100vh-8rem)]">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 opacity-90 z-20" />
      <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-10 shrink-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-[family-name:var(--font-geist-sans)]">Current Medications</h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">List of your prescribed medicine</p>
      </div>

      <div className="xl:flex-1 xl:overflow-y-auto p-4 space-y-3 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full dark:[&::-webkit-scrollbar-thumb]:bg-slate-600">
        {medicines.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-500">
            <span className="material-symbols-outlined text-5xl sm:text-6xl mb-3 opacity-20">vaccines</span>
            <p className="text-sm sm:text-base font-semibold px-4 text-center">No medications found.</p>
            <p className="text-[10px] sm:text-xs mt-1 text-center px-6">Add your first medicine using the form to start tracking.</p>
          </div>
        ) : (
          medicines.map((med, idx) => (
            <div key={med.id || idx} className="p-3 sm:p-4 rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 hover:border-emerald-500/30 transition-colors group">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-800 dark:text-white truncate max-w-[160px] sm:max-w-[200px]">{med.name}</h3>
                  <p className="text-xs sm:text-sm font-medium text-emerald-600 dark:text-emerald-400">{med.dosage}</p>
                </div>
                <div className="bg-white dark:bg-slate-800 px-2 py-1 rounded text-[10px] sm:text-xs font-semibold text-slate-600 dark:text-slate-300 shadow-sm border border-slate-200 dark:border-slate-700">
                  {med.frequency}
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1">
                  <span className="material-icons text-[12px] sm:text-[14px]">event</span>
                  {new Date(med.startDate).toLocaleDateString('en-US')} - {new Date(med.endDate).toLocaleDateString('en-US')}
                </div>
                {med.notes && (
                  <div className="flex items-center gap-1 truncate max-w-[90px] sm:max-w-[120px]">
                    <span className="material-icons text-[12px] sm:text-[14px]">info</span>
                    <span className="truncate">{med.notes}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
