import React from "react";
import { Activity, TestTubeDiagonal, Syringe, Pill } from "lucide-react";

interface DashboardStatsProps {
  patientId: number;
  token: string;
}

export default async function DashboardStats({ patientId, token }: DashboardStatsProps) {
  let avgBg: string | number = "--";
  let labCount = 0;
  let ulcerCount = 0;
  let medCount = 0;

  if (patientId > 0 && token) {
    try {
      const headers = { "Authorization": `Bearer ${token}` };

      const [bgRes, labRes, ulcerRes, medRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_BASE_API}/BloodGlucoseReading/GetAllReadingsForPatient/${patientId}`, { headers, cache: 'no-store' }).catch(() => null),
        fetch(`${process.env.NEXT_PUBLIC_BASE_API}/LabTest/GetAllTestsForPatient/${patientId}`, { headers, cache: 'no-store' }).catch(() => null),
        fetch(`${process.env.NEXT_PUBLIC_BASE_API}/FootUlcerImage/GetAllFootUlcerImagesForPatient/${patientId}`, { headers, cache: 'no-store' }).catch(() => null),
        fetch(`${process.env.NEXT_PUBLIC_BASE_API}/Medicine/GetAllMedicinesForPatient/${patientId}`, { headers, cache: 'no-store' }).catch(() => null),
      ]);

      if (bgRes && bgRes.ok) {
        let data = await bgRes.json();
        if (data && Array.isArray(data)) {
           data = data.sort((a: any, b: any) => new Date(b.measurementTime).getTime() - new Date(a.measurementTime).getTime());
           const recentBg = data.slice(0, 10);
           if (recentBg.length > 0) {
              avgBg = (recentBg.reduce((acc: number, curr: any) => acc + curr.reading_value, 0) / recentBg.length).toFixed(1);
           }
        }
      }
      
      if (labRes && labRes.ok) { const d = await labRes.json(); labCount = d?.length || 0; }
      if (ulcerRes && ulcerRes.ok) { const d = await ulcerRes.json(); ulcerCount = d?.length || 0; }
      if (medRes && medRes.ok) { const d = await medRes.json(); medCount = d?.length || 0; }
      
    } catch (err) {
      console.error("Failed to fetch dashboard stats", err);
    }
  }
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6">
      {/* Metric 1 */}
      <div className="bg-white/90 dark:bg-slate-900/70 border border-slate-200/90 dark:border-slate-800 backdrop-blur-sm rounded-2xl p-4 sm:p-5 shadow-sm hover:border-emerald-300 dark:hover:border-emerald-500/50 transition-all group animate-in zoom-in-95 duration-500 delay-100 fill-mode-both">
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <h3 className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">Avg Glucose</h3>
          <div className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 p-1.5 sm:p-2 rounded-xl group-hover:scale-110 transition-transform">
            <Activity className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>
        <div className="flex items-baseline gap-1 sm:gap-2">
          <span className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white">{avgBg}</span>
          <span className="text-[10px] sm:text-sm font-medium text-slate-400 truncate">mg/dL</span>
        </div>
      </div>

      {/* Metric 2 */}
      <div className="bg-white/90 dark:bg-slate-900/70 border border-slate-200/90 dark:border-slate-800 backdrop-blur-sm rounded-2xl p-4 sm:p-5 shadow-sm hover:border-blue-300 dark:hover:border-blue-500/50 transition-all group animate-in zoom-in-95 duration-500 delay-150 fill-mode-both">
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <h3 className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">Lab Tests</h3>
          <div className="bg-blue-100 dark:bg-blue-900/40 text-blue-600 p-1.5 sm:p-2 rounded-xl group-hover:scale-110 transition-transform">
            <TestTubeDiagonal className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>
        <div className="flex items-baseline gap-1 sm:gap-2">
          <span className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white">{labCount}</span>
          <span className="text-[10px] sm:text-sm font-medium text-slate-400 truncate">tests</span>
        </div>
      </div>

      {/* Metric 3 */}
      <div className="bg-white/90 dark:bg-slate-900/70 border border-slate-200/90 dark:border-slate-800 backdrop-blur-sm rounded-2xl p-4 sm:p-5 shadow-sm hover:border-purple-300 dark:hover:border-purple-500/50 transition-all group animate-in zoom-in-95 duration-500 delay-200 fill-mode-both">
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <h3 className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">Ulcers</h3>
          <div className="bg-purple-100 dark:bg-purple-900/40 text-purple-600 p-1.5 sm:p-2 rounded-xl group-hover:scale-110 transition-transform">
            <Syringe className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>
        <div className="flex items-baseline gap-1 sm:gap-2">
          <span className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white">{ulcerCount}</span>
          <span className="text-[10px] sm:text-sm font-medium text-slate-400 truncate">images</span>
        </div>
      </div>

      {/* Metric 4 */}
      <div className="bg-white/90 dark:bg-slate-900/70 border border-slate-200/90 dark:border-slate-800 backdrop-blur-sm rounded-2xl p-4 sm:p-5 shadow-sm hover:border-orange-300 dark:hover:border-orange-500/50 transition-all group animate-in zoom-in-95 duration-500 delay-300 fill-mode-both">
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <h3 className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">Medicines</h3>
          <div className="bg-orange-100 dark:bg-orange-900/40 text-orange-600 p-1.5 sm:p-2 rounded-xl group-hover:scale-110 transition-transform">
            <Pill className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>
        <div className="flex items-baseline gap-1 sm:gap-2">
          <span className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white">{medCount}</span>
          <span className="text-[10px] sm:text-sm font-medium text-slate-400 truncate">active</span>
        </div>
      </div>
    </div>
  );
}
