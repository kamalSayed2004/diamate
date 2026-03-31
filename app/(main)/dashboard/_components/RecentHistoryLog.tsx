import React from "react";

interface BloodGlucoseReading {
  id?: number;
  patientId: number;
  reading_value: number;
  measurementTime: string;
  measurementType: number;
  notes: string;
}

interface RecentHistoryLogProps {
  patientId: number;
  token: string;
}

export default async function RecentHistoryLog({ patientId, token }: RecentHistoryLogProps) {
  let readings: BloodGlucoseReading[] = [];

  if (patientId > 0 && token) {
    try {
      const headers = { "Authorization": `Bearer ${token}` };
      const bgRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/BloodGlucoseReading/GetAllReadingsForPatient/${patientId}`, { headers, cache: 'no-store' }).catch(() => null);

      if (bgRes && bgRes.ok) {
        let data = await bgRes.json();
        if (data && Array.isArray(data)) {
           readings = data.sort((a: any, b: any) => new Date(b.measurementTime).getTime() - new Date(a.measurementTime).getTime());
        }
      }
    } catch (err) {
      console.error("Failed to fetch history data", err);
    }
  }
  const getMeasurementTypeLabel = (type: number) => {
    switch (type) {
      case 1: return "Fasting";
      case 2: return "After Meal";
      case 3: return "Random";
      default: return "Other";
    }
  };

  const getReadingColor = (value: number) => {
    if (value < 70) return "text-red-500 bg-red-100 dark:bg-red-900/40 border-red-200 dark:border-red-800";
    if (value > 150) return "text-orange-600 bg-orange-100 dark:bg-orange-900/40 border-orange-200 dark:border-orange-800";
    return "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/40 border-emerald-200 dark:border-emerald-800";
  };

  return (
    <div className="w-full bg-white/90 dark:bg-slate-900/70 border border-slate-200/90 dark:border-slate-800 backdrop-blur-sm rounded-[2rem] shadow-sm flex flex-col animate-in fade-in duration-500 delay-500 fill-mode-both overflow-hidden">
      <div className="px-5 sm:px-6 md:px-8 py-4 sm:py-5 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-10 shrink-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Recent Log History</h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Your past blood glucose entries and notes</p>
      </div>

      <div className="flex-1 overflow-y-auto max-h-[350px] sm:max-h-[400px] p-3 sm:p-5 md:p-6 space-y-3 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full dark:[&::-webkit-scrollbar-thumb]:bg-slate-600">
        {readings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-500">
            <span className="material-icons text-5xl sm:text-6xl mb-3 opacity-20">history</span>
            <p className="text-sm sm:text-base font-semibold px-4 text-center">No readings logged yet.</p>
          </div>
        ) : (
          readings.map((reading, idx) => (
            <div key={reading.id || idx} className="p-3 sm:p-4 rounded-xl flex flex-col sm:flex-row justify-between sm:items-center gap-3 sm:gap-4 border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 hover:border-[#259ee4]/30 transition-colors group">
              <div className="flex items-center gap-3 sm:gap-4">
                {/* Left color box */}
                <div className={`shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl border flex flex-col items-center justify-center ${getReadingColor(reading.reading_value)}`}>
                  <span className="text-lg sm:text-xl font-black">{reading.reading_value.toFixed(0)}</span>
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-800 dark:text-white truncate">
                    {getMeasurementTypeLabel(reading.measurementType)} Phase
                  </h3>
                  <div className="flex items-center gap-1 mt-0.5 sm:mt-1 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
                    <span className="material-icons text-[12px] sm:text-[14px]">event</span>
                    {new Date(reading.measurementTime).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                  </div>
                </div>
              </div>
              
              {reading.notes && (
                <div className="w-full sm:w-auto sm:max-w-[200px] md:max-w-xs bg-blue-50/50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 px-3 py-2 rounded-lg flex items-start gap-2 mt-2 sm:mt-0">
                  <p className="text-[11px] sm:text-sm text-slate-600 dark:text-slate-300 italic leading-snug">
                    "{reading.notes}"
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
