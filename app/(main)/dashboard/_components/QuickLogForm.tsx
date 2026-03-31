"use client";

import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface QuickLogFormProps {
  patientId: number;
  token: string;
}

export default function QuickLogForm({ patientId, token }: QuickLogFormProps) {
  const router = useRouter();

  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [readingValue, setReadingValue] = useState("");
  const [measurementTime, setMeasurementTime] = useState("");
  const [measurementType, setMeasurementType] = useState<number>(3);
  const [notes, setNotes] = useState("");

  React.useEffect(() => {
    if (!measurementTime) {
      const now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      setMeasurementTime(now.toISOString().slice(0, 16));
    }
  }, []);

  const handleCancel = () => {
    setReadingValue("");
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    setMeasurementTime(now.toISOString().slice(0, 16));
    setMeasurementType(3);
    setNotes("");
    setError(null);
  };

  const handleSave = async () => {
    if (!readingValue) return setError("Please provide a reading value.");
    if (!measurementTime) return setError("Please select a measurement time.");

    setLoadingSubmit(true);
    setError(null);

    const payload = {
      patientId,
      reading_value: parseFloat(readingValue),
      measurementTime: new Date(measurementTime).toISOString(),
      measurementType: measurementType,
      notes
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/BloodGlucoseReading/AddReadingForPatient`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to add reading");

      handleCancel();
      router.refresh();

    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoadingSubmit(false);
    }
  };

  if (patientId === 0) return null;

  return (
    <div className="group relative w-full overflow-hidden rounded-[2rem] border shadow-lg shadow-slate-200/50 dark:shadow-none transition duration-300 border-slate-200/90 bg-white dark:border-slate-700/80 dark:bg-slate-900/90 backdrop-blur-sm flex flex-col">
      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-blue-500 via-sky-400 to-blue-600 z-20" />

      <div className="px-4 sm:px-6 md:px-8 py-5 sm:py-6 border-b border-slate-100 dark:border-slate-800 bg-transparent shrink-0">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Quick Log</h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">Record a new glucose reading</p>
        </div>
      </div>

      <div className="p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6 bg-slate-50/50 dark:bg-transparent xl:flex-1 [&_input[type=number]::-webkit-inner-spin-button]:appearance-none">
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-xl text-red-600 text-[11px] sm:text-sm font-medium">
            {error}
          </div>
        )}

        <div className="space-y-4 sm:space-y-5">
          <div>
            <label className="block text-[11px] sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 sm:mb-2">Reading Value (mg/dL) <span className="text-red-500">*</span></label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#259ee4]">
                <span className="material-icons text-lg sm:text-xl shadow-sm">water_drop</span>
              </span>
              <input
                className="w-full pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#259ee4] focus:border-transparent outline-none transition-all placeholder-slate-400 dark:text-white shadow-sm"
                placeholder="e.g., 95"
                type="number"
                step="0.1"
                value={readingValue}
                onChange={(e) => setReadingValue(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 sm:mb-2">Timing Protocol</label>
            <div className="relative">
              <select
                className="block w-full pl-4 pr-10 py-2.5 sm:py-3 text-[13px] sm:text-sm sm:text-base border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-[#259ee4] focus:border-[#259ee4] rounded-xl bg-white dark:bg-slate-900 dark:text-white appearance-none border shadow-sm"
                value={measurementType}
                onChange={(e) => setMeasurementType(Number(e.target.value))}
              >
                <option value={1}>Fasting</option>
                <option value={2}>After Meal</option>
                <option value={3}>Random</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                <span className="material-icons text-lg">expand_more</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 sm:mb-2">Time Recorded <span className="text-red-500">*</span></label>
            <div className="relative border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
              <input
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-transparent focus:ring-2 focus:ring-[#259ee4] focus:border-transparent outline-none transition-all dark:text-white [color-scheme:light] dark:[color-scheme:dark]"
                type="datetime-local"
                value={measurementTime}
                onChange={(e) => setMeasurementTime(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 sm:mb-2">Additional Notes</label>
            <textarea
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#259ee4] focus:border-transparent outline-none transition-all dark:text-white resize-none shadow-sm"
              rows={2}
              placeholder="E.g., Felt a bit dizzy..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            ></textarea>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-5 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-700 flex flex-col gap-2.5 sm:gap-3 shrink-0">
        <button
          type="button"
          onClick={handleSave}
          disabled={loadingSubmit}
          className="w-full py-3 sm:py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-[#259ee4] hover:from-blue-600 hover:to-blue-500 text-white font-bold text-[13px] sm:text-md shadow-md shadow-[#259ee4]/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {loadingSubmit ? <Loader2 className="w-5 h-5 animate-spin" /> : <span className="material-icons text-lg sm:text-xl">add_circle</span>}
          Log Reading
        </button>
        <button 
          type="button" 
          onClick={handleCancel} 
          className="w-full py-2 sm:py-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-[11px] sm:text-sm transition-colors text-center"
        >
          Clear Form
        </button>
      </div>
    </div>
  );
}
