import React, { Suspense } from "react";
import { cookies } from "next/headers";
import { Loader2 } from "lucide-react";
import MealClient from "./_components/MealClient";
import MealList from "./_components/MealList";

export default async function MealPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value || "";
  const patientIdStr =
    cookieStore.get("patientId")?.value ||
    cookieStore.get("DiamateTokenId")?.value ||
    "0";
  const patientId = Number(patientIdStr);

  return (
    <MealClient
      patientId={patientId}
      token={token}
      mealList={
        <Suspense
          fallback={
            <div className="w-full xl:w-[420px] h-[600px] xl:h-full bg-white/50 dark:bg-slate-900/50 backdrop-blur-md rounded-[2rem] border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            </div>
          }
        >
          <MealList patientId={patientId} token={token} />
        </Suspense>
      }
    />
  );
}
