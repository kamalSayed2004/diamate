"use client";

import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface AddMedicineFormProps {
  patientId: number;
  token: string;
}

export default function AddMedicineForm({ patientId, token }: AddMedicineFormProps) {
  const router = useRouter();
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("Once daily");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");

  const handleCancel = () => {
    setName("");
    setDosage("");
    setFrequency("Once daily");
    setStartDate("");
    setEndDate("");
    setNotes("");
    setError(null);
  };

  const handleSave = async () => {
    if (!name.trim()) return setError("Please provide a drug name.");
    if (!dosage.trim()) return setError("Please provide a dosage amount.");
    if (!startDate) return setError("Please select a start date.");
    if (!endDate) return setError("Please select an end date.");

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) return setError("Start date cannot be in the past.");
    if (end < start) return setError("End date cannot be before the start date.");

    setLoadingSubmit(true);
    setError(null);

    const payload = {
      patientId,
      name,
      dosage,
      frequency,
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      notes
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/Medicine/AddNewMedicine`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to add medication");

      // Reset form briefly
      handleCancel();
      
      // Refresh the page data smoothly
      router.refresh();
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingSubmit(false);
    }
  };

  if (patientId === 0) {
    return null; // Return nothing if no patientId
  }

  return (
    <div className="group relative w-full shrink-0 xl:shrink xl:flex-1 mx-auto xl:mx-0 max-w-3xl overflow-hidden rounded-[2rem] border shadow-sm transition duration-300 border-slate-200/90 bg-white/90 dark:border-slate-700/80 dark:bg-slate-900/70 backdrop-blur-sm hover:border-emerald-200 dark:hover:border-emerald-400/45 flex flex-col xl:max-h-[calc(100vh-8rem)]">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 opacity-90 z-20" />

      {/* Header */}
      <div className="px-5 sm:px-8 py-5 sm:py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center sticky top-0 z-10 shrink-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Add Medication</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">Track your daily intake and schedules</p>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-4 sm:p-5 md:p-8 space-y-6 sm:space-y-8 xl:overflow-y-auto xl:flex-1 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full dark:[&::-webkit-scrollbar-thumb]:bg-slate-600 [&_input[type=number]::-webkit-inner-spin-button]:appearance-none">
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-600 text-sm font-medium">
            {error}
          </div>
        )}

        {/* Form Fields Mapping API Schema */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 sm:mb-2">Drug Name</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <span className="material-icons text-xl">search</span>
              </span>
              <input
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all placeholder-slate-400 dark:text-white"
                placeholder="e.g., Catafly, Aspirin..."
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 sm:mb-2">Dosage</label>
            <input
              className="flex-1 min-w-0 block w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none dark:text-white"
              placeholder="e.g., 500mg"
              type="text"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 sm:mb-2">Frequency</label>
            <div className="relative">
              <select
                className="block w-full pl-3 pr-10 py-3 text-base border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-lg bg-slate-50 dark:bg-slate-900 dark:text-white appearance-none border"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
              >
                <option>Once daily</option>
                <option>Twice daily</option>
                <option>Three times daily</option>
                <option>Every 4 hours</option>
                <option>As needed</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                <span className="material-icons">expand_more</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 sm:mb-2">Start Date</label>
            <div className="relative border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 overflow-hidden">
              <input
                className="w-full px-4 py-3 bg-transparent focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all dark:text-white [color-scheme:light] dark:[color-scheme:dark]"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 sm:mb-2">End Date</label>
            <div className="relative border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 overflow-hidden">
              <input
                className="w-full px-4 py-3 bg-transparent focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all dark:text-white [color-scheme:light] dark:[color-scheme:dark]"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 sm:mb-2">Notes</label>
            <textarea
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all dark:text-white resize-none"
              rows={3}
              placeholder="e.g., Take with food"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            ></textarea>
          </div>
        </div>

      </div>

      {/* Footer Actions */}
      <div className="shrink-0 px-5 sm:px-8 py-5 sm:py-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-700 flex flex-col-reverse sm:flex-row justify-end items-stretch sm:items-center gap-3">
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
          Save Medication
        </button>
      </div>
    </div>
  );
}
