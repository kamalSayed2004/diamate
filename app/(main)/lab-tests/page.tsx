import React, { Suspense } from "react";
import { cookies } from "next/headers";
import { Loader2 } from "lucide-react";
import LabTestsClient from "./_components/LabTestsClient";
import LabTestList from "./_components/LabTestList";
import FootUlcerList from "./_components/FootUlcerList";

export default async function LabTestsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value || "";
  const patientIdStr = cookieStore.get("patientId")?.value || cookieStore.get("DiamateTokenId")?.value || "0";
  const patientId = Number(patientIdStr);

  return (
    <LabTestsClient 
      patientId={patientId} 
      token={token} 
      labTestList={
        <Suspense fallback={
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
          </div>
        }>
          <LabTestList patientId={patientId} token={token} />
        </Suspense>
      }
      footUlcerList={
        <Suspense fallback={
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
          </div>
        }>
          <FootUlcerList patientId={patientId} token={token} />
        </Suspense>
      }
    />
  );
}
