"use client";

import React, { useState, useRef } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface LabTestFormProps {
  patientId: number;
  token: string;
}

export default function LabTestForm({ patientId, token }: LabTestFormProps) {
  const router = useRouter();
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [testName, setTestName] = useState("");
  const [resultValue, setResultValue] = useState("");
  const [normalRange, setNormalRange] = useState("");
  const [labNotes, setLabNotes] = useState("");
  const [testDate, setTestDate] = useState("");
  const [reportImageBase64, setReportImageBase64] = useState("");
  const labImageInputRef = useRef<HTMLInputElement>(null);

  const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      let encoded = reader.result?.toString() || "";
      const commaIndex = encoded.indexOf(",");
      if (commaIndex !== -1) {
        encoded = encoded.substring(commaIndex + 1);
      }
      resolve(encoded);
    };
    reader.onerror = error => reject(error);
  });

  const handleLabImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      try {
        const base64Str = await toBase64(file);
        setReportImageBase64(base64Str);
      } catch (err) {
        console.error(err);
        setError("Failed to process lab test image.");
      }
    }
  };

  const handleCancelLabTest = () => {
    setTestName("");
    setResultValue("");
    setNormalRange("");
    setLabNotes("");
    setTestDate("");
    setReportImageBase64("");
    if (labImageInputRef.current) labImageInputRef.current.value = "";
    setError(null);
  };

  const handleSaveLabTest = async () => {
    if (!testName.trim()) return setError("Please provide a test name.");
    if (!resultValue.trim()) return setError("Please provide a result value.");
    if (!testDate) return setError("Please select a test date.");
    if (!reportImageBase64) return setError("Report image is required.");

    setLoadingSubmit(true);
    setError(null);

    const payload = {
      patientId,
      testName,
      result_value: Number(resultValue),
      normalRange,
      notes: labNotes,
      testDate: new Date(testDate).toISOString(),
      report_Image: reportImageBase64
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/LabTest/AddNewLabTestForPatient`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to add Lab Test");

      handleCancelLabTest();
      router.refresh();
      
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 space-y-4 sm:space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300 [&_input[type=number]::-webkit-inner-spin-button]:appearance-none">
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-600 text-sm font-medium">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 sm:mb-2">Test Name</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <span className="material-icons text-xl">biotech</span>
              </span>
              <input
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all placeholder-slate-400 dark:text-white"
                placeholder="e.g., Glucose, HbA1c..."
                type="text"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 sm:mb-2">Result Value</label>
            <input
              className="w-full px-4 py-2.5 sm:py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none dark:text-white"
              placeholder="e.g., 45"
              type="number"
              value={resultValue}
              onChange={(e) => setResultValue(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 sm:mb-2">Normal Range</label>
            <input
              className="w-full px-4 py-2.5 sm:py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none dark:text-white"
              placeholder="e.g., 80-120"
              type="text"
              value={normalRange}
              onChange={(e) => setNormalRange(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 sm:mb-2">Test Date</label>
            <div className="relative border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 overflow-hidden">
              <input
                className="w-full px-4 py-2.5 sm:py-3 bg-transparent focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all dark:text-white [color-scheme:light] dark:[color-scheme:dark]"
                type="date"
                value={testDate}
                onChange={(e) => setTestDate(e.target.value)}
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 sm:mb-2">Report Image <span className="text-red-500">*</span></label>
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-4 sm:p-6 text-center bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="lab-upload"
                ref={labImageInputRef}
                onChange={handleLabImageChange}
              />
              <label htmlFor="lab-upload" className="cursor-pointer flex flex-col items-center w-full">
                {!reportImageBase64 ? (
                  <>
                    <span className="material-icons text-3xl text-slate-400 mb-2 block">cloud_upload</span>
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Click to upload report image</span>
                    <span className="text-xs text-slate-400 mt-1">Supports JPG, PNG</span>
                  </>
                ) : (
                  <div className="relative w-full h-32 md:h-40 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-black/5 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`data:image/jpeg;base64,${reportImageBase64}`} alt="Report Preview" className="h-full w-full object-contain" />
                    <div className="absolute top-2 right-2 bg-violet-600 text-white rounded-full p-1.5 shadow-md flex items-center justify-center">
                      <span className="material-icons text-[16px]">edit</span>
                    </div>
                  </div>
                )}
              </label>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 sm:mb-2">Notes</label>
            <textarea
              className="w-full px-4 py-2.5 sm:py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all dark:text-white resize-none"
              rows={3}
              placeholder="e.g., Blood sugar too low..."
              value={labNotes}
              onChange={(e) => setLabNotes(e.target.value)}
            ></textarea>
          </div>
        </div>
      </div>

      <div className="mt-6 sm:mt-8 flex flex-col-reverse sm:flex-row justify-end items-stretch sm:items-center gap-3">
        <button 
          type="button" 
          onClick={handleCancelLabTest} 
          className="px-6 py-2.5 sm:py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-sm transition-colors text-center w-full sm:w-auto"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSaveLabTest}
          disabled={loadingSubmit}
          className="px-8 py-2.5 sm:py-2.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm shadow-md shadow-violet-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed w-full sm:w-auto"
        >
          {loadingSubmit ? <Loader2 className="w-5 h-5 animate-spin" /> : <span className="material-icons text-lg">check</span>}
          Save Test
        </button>
      </div>
    </div>
  );
}
