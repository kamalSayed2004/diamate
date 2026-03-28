import React, { Suspense } from "react";
import { cookies } from "next/headers";
import { Loader2 } from "lucide-react";
import AddMedicineForm from "./_components/AddMedicineForm";
import MedicineList from "./_components/MedicineList";

export default async function MedicinePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value || "";
  const patientIdStr = cookieStore.get("patientId")?.value || cookieStore.get("DiamateTokenId")?.value || "0";
  const patientId = Number(patientIdStr);

  return (
    <div className="w-full xl:h-full p-3 sm:p-4 md:p-8 flex flex-col xl:flex-row gap-4 sm:gap-6 md:gap-8 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full dark:[&::-webkit-scrollbar-thumb]:bg-slate-600">
      <AddMedicineForm patientId={patientId} token={token} />
      <Suspense fallback={
        <div className="group relative w-full xl:flex-1 xl:w-auto xl:max-w-md shrink-0 xl:shrink overflow-hidden rounded-[2rem] border shadow-sm transition duration-300 border-slate-200/90 bg-white/90 dark:border-slate-700/80 dark:bg-slate-900/70 backdrop-blur-sm flex flex-col min-h-[400px] xl:max-h-[calc(100vh-8rem)]">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 opacity-90 z-20" />
          <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Current Medications</h2>
          </div>
          <div className="flex-1 flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
          </div>
        </div>
      }>
        <MedicineList patientId={patientId} token={token} />
      </Suspense>
    </div>
  );
}
