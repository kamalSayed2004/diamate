import React, { Suspense } from "react";
import { cookies } from "next/headers";
import ProfileForm from "./_components/ProfileForm";
import ChangePasswordForm from "./_components/ChangePasswordForm";
import { AlertCircle, Loader2 } from "lucide-react";

async function ProfileFormWrapper() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value || "";
  const patientIdStr = cookieStore.get("patientId")?.value || cookieStore.get("DiamateTokenId")?.value || "0";
  const patientId = Number(patientIdStr);

  let initialData = {
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: 0,
    address: "",
    phone: "",
    homePhone: "",
    email: "",
    profileImage: "",
    dateOfDiagnosis: "",
    diabetesType: 1,
    weight: 0,
    height: 0,
    notes: "",
  };

  let error = null;

  if (patientId > 0 && token) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/Patients/GetPatient/${patientId}`, {
        headers: { "Authorization": `Bearer ${token}` },
        cache: 'no-store'
      });
      if (res.ok) {
        const data = await res.json();
        initialData = {
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          dateOfBirth: (data.dateOfBirth && !data.dateOfBirth.startsWith('0001-01-01')) ? data.dateOfBirth.split('T')[0] : "",
          gender: typeof data.gender === "number" ? data.gender : 0,
          address: data.address || "",
          phone: data.phone || "",
          homePhone: data.homePhone || "",
          email: data.email || "",
          profileImage: data.profileImage || "",
          dateOfDiagnosis: (data.dateOfDiagnosis && !data.dateOfDiagnosis.startsWith('0001-01-01')) ? data.dateOfDiagnosis.split('T')[0] : "",
          diabetesType: typeof data.diabetesType === "number" ? data.diabetesType : 1,
          weight: data.weight || 0,
          height: data.height || 0,
          notes: data.notes || "",
        };
      } else {
        error = "Failed to load patient data.";
      }
    } catch (err) {
      error = "Error connecting to server. Cannot load patient data.";
    }
  } else {
    error = "Patient ID not found. Please log in again.";
  }

  if (error) {
    return (
      <div className="flex-1 p-4 md:p-8 flex items-center justify-center">
        <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 rounded-2xl text-red-600 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="xl:flex-1 p-4 md:p-8 xl:overflow-y-auto w-full">
      <div className="max-w-5xl mx-auto space-y-8 pb-10">
        <ProfileForm patientId={patientId} token={token} initialData={initialData} />
        <ChangePasswordForm token={token} />
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={
      <div className="xl:flex-1 p-4 md:p-8 xl:overflow-y-auto w-full flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="w-10 h-10 animate-spin text-slate-400" />
        <p className="mt-4 font-semibold text-slate-500">Loading Profile Details...</p>
      </div>
    }>
      <ProfileFormWrapper />
    </Suspense>
  );
}
