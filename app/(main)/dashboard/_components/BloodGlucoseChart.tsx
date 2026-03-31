import React from "react";
import { HeartPulse, Activity } from "lucide-react";

interface BloodGlucoseReading {
  id?: number;
  patientId: number;
  reading_value: number;
  measurementTime: string;
  measurementType: number;
  notes: string;
}

interface BloodGlucoseChartProps {
  patientId: number;
  token: string;
}

export default async function BloodGlucoseChart({ patientId, token }: BloodGlucoseChartProps) {
  let chartData: BloodGlucoseReading[] = [];

  if (patientId > 0 && token) {
    try {
      const headers = { "Authorization": `Bearer ${token}` };
      const bgRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/BloodGlucoseReading/GetAllReadingsForPatient/${patientId}`, { headers, cache: 'no-store' }).catch(() => null);

      if (bgRes && bgRes.ok) {
        let data = await bgRes.json();
        if (data && Array.isArray(data)) {
           data = data.sort((a: any, b: any) => new Date(b.measurementTime).getTime() - new Date(a.measurementTime).getTime());
           chartData = data.slice(0, 10).reverse();
        }
      }
    } catch (err) {
      console.error("Failed to fetch chart data", err);
    }
  }
  const hasChartData = chartData.length > 1;
  const maxBgValue = hasChartData ? Math.max(...chartData.map(d => d.reading_value)) : 200;
  const chartCeiling = Math.max(maxBgValue * 1.2, 200);

  return (
    <div className="w-full bg-white/90 dark:bg-slate-900/70 border border-slate-200/90 dark:border-slate-800 backdrop-blur-sm rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300 fill-mode-both relative overflow-hidden group">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 sm:mb-10 gap-2 relative z-10">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <HeartPulse className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500 animate-pulse" /> Blood Glucose Trend Diagram
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Categorical visualization of your past 10 readings</p>
        </div>
        <div className="hidden min-[360px]:flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs font-semibold text-slate-600 dark:text-slate-300 mt-2 sm:mt-0">
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded bg-emerald-400"></div> Normal</div>
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded bg-orange-400"></div> High</div>
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded bg-red-400"></div> Low</div>
        </div>
      </div>

      <div className="w-full relative min-h-[220px] sm:min-h-[260px]">
        {!hasChartData ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
            <Activity className="w-8 h-8 sm:w-10 sm:h-10 mb-3 opacity-30" />
            <p className="text-sm sm:text-base font-semibold px-4 text-center">Not enough data to graph.</p>
            <p className="text-[10px] sm:text-xs mt-1 text-center px-6">Input at least 2 readings using the form.</p>
          </div>
        ) : (
          <div className="w-full h-[180px] sm:h-[220px] flex items-end justify-between gap-1 sm:gap-2 pb-5 sm:pb-6 border-b border-slate-200 dark:border-slate-700 relative">
            {/* Background grid guides */}
            <div className="absolute inset-x-0 inset-y-0 flex flex-col justify-between opacity-10 pointer-events-none pb-5 sm:pb-6">
              {[1, 2, 3, 4, 5].map(l => <div key={l} className="w-full border-t-2 border-slate-500 dark:border-slate-400 border-dashed"></div>)}
            </div>

            {/* HTML Native Resonsive Bar Generation */}
            {chartData.map((d, i) => {
              const heightPct = Math.min((d.reading_value / chartCeiling) * 100, 100);
              const isHigh = d.reading_value > 150;
              const isLow = d.reading_value < 70;
              const barColor = isHigh 
                ? 'bg-gradient-to-t from-orange-500 to-amber-400 shadow-orange-500/20' 
                : isLow 
                  ? 'bg-gradient-to-t from-red-500 to-rose-400 shadow-red-500/20' 
                  : 'bg-gradient-to-t from-[#259ee4] to-cyan-400 shadow-[#259ee4]/20';

              return (
                <div key={i} className="relative flex-1 group/bar flex justify-center h-full items-end z-10 animate-in slide-in-from-bottom duration-700 hover:z-20" style={{ animationDelay: `${i * 100}ms` }}>
                  
                  {/* Hover Tooltip Popup */}
                  <div className="absolute -top-8 sm:-top-10 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-slate-800 text-white text-[10px] sm:text-xs font-bold py-1 px-1.5 sm:px-2 rounded pointer-events-none whitespace-nowrap z-50 shadow-lg scale-95 group-hover/bar:scale-100 ease-out">
                     {d.reading_value.toFixed(1)} mg/dL
                  </div>

                  {/* Solid Diagram Bar */}
                  <div 
                     className={`w-full max-w-[50px] rounded-t-lg transition-all duration-300 md:group-hover/bar:opacity-80 shadow-lg ${barColor}`} 
                     style={{ height: `${heightPct}%` }}
                  />
                  
                  {/* X-axis Footer Label */}
                  <div className="absolute -bottom-5 sm:-bottom-6 text-[8px] sm:text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap -rotate-45 origin-top-left translate-y-1 sm:translate-y-0 sm:rotate-0 sm:truncate w-full text-center">
                     {new Date(d.measurementTime).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
