import React, { Suspense } from "react";
import { cookies } from "next/headers";
import { Loader2 } from "lucide-react";
import DashboardStats from "./_components/DashboardStats";
import BloodGlucoseChart from "./_components/BloodGlucoseChart";
import QuickLogForm from "./_components/QuickLogForm";
import RecentHistoryLog from "./_components/RecentHistoryLog";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value || "";
  const patientIdStr = cookieStore.get("patientId")?.value || cookieStore.get("DiamateTokenId")?.value || "0";
  const patientId = Number(patientIdStr);

  return (
    <div className="w-full h-full p-3 sm:p-5 md:p-8 flex flex-col gap-4 sm:gap-6 md:gap-8 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full dark:[&::-webkit-scrollbar-thumb]:bg-slate-600">
      
      {/* Global Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end animate-in fade-in slide-in-from-top-4 duration-500 delay-75 fill-mode-both shrink-0 px-1 sm:px-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">Main Dashboard</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">Your comprehensive health & trend tracking overview</p>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-5 sm:gap-6 md:gap-8">
        
        {/* LEFT COLUMN: Stats, Chart, History Log */}
        <div className="flex-1 flex flex-col gap-5 sm:gap-6 md:gap-8 order-2 xl:order-1">
          <Suspense fallback={<div className="h-[120px] rounded-2xl flex items-center justify-center border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>}>
            <DashboardStats patientId={patientId} token={token} />
          </Suspense>

          <Suspense fallback={<div className="h-[300px] rounded-3xl flex items-center justify-center border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50"><Loader2 className="w-8 h-8 animate-spin text-rose-500" /></div>}>
            <BloodGlucoseChart patientId={patientId} token={token} />
          </Suspense>

          <Suspense fallback={<div className="h-[400px] rounded-[2rem] flex items-center justify-center border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>}>
            <RecentHistoryLog patientId={patientId} token={token} />
          </Suspense>
        </div>

        {/* RIGHT COLUMN: Actionable Input Form (Moves to top on mobile via order classes) */}
        <div className="w-full xl:w-[420px] shrink-0 flex flex-col gap-6 order-1 xl:order-2 animate-in fade-in slide-in-from-right-8 duration-[800ms] delay-200 fill-mode-both">
          <QuickLogForm patientId={patientId} token={token} />
        </div>
      </div>
    </div>
  );
}
