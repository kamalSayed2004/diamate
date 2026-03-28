"use client";

import React, { useState, useRef } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface FootUlcerFormProps {
  patientId: number;
  token: string;
}

export default function FootUlcerForm({ patientId, token }: FootUlcerFormProps) {
  const router = useRouter();
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [ulcerUploadDate, setUlcerUploadDate] = useState("");
  const [aiDetectionResult, setAiDetectionResult] = useState("");
  const [aiConfidence, setAiConfidence] = useState("");
  const [ulcerNotes, setUlcerNotes] = useState("");
  const [ulcerImageBase64, setUlcerImageBase64] = useState("");
  const ulcerImageInputRef = useRef<HTMLInputElement>(null);

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

  const handleUlcerImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      try {
        const base64Str = await toBase64(file);
        setUlcerImageBase64(base64Str);
      } catch (err) {
        console.error(err);
        setError("Failed to process ulcer image.");
      }
    }
  };

  const handleCancelUlcer = () => {
    setUlcerUploadDate("");
    setAiDetectionResult("");
    setAiConfidence("");
    setUlcerNotes("");
    setUlcerImageBase64("");
    if (ulcerImageInputRef.current) ulcerImageInputRef.current.value = "";
    setError(null);
  };

  const handleSaveUlcer = async () => {
    if (!ulcerImageBase64) return setError("Foot ulcer image is required.");
    if (!ulcerUploadDate) return setError("Please select an upload date.");

    setLoadingSubmit(true);
    setError(null);

    const payload = {
      patientId,
      image: ulcerImageBase64,
      uploadDate: new Date(ulcerUploadDate).toISOString(),
      ai_detectionResult: aiDetectionResult,
      aiConfidence: Number(aiConfidence),
      notes: ulcerNotes
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/FootUlcerImage/AddFootUlcerImageForPatient`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to add Foot Ulcer Image");

      handleCancelUlcer();
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
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 sm:mb-2">Ulcer Image <span className="text-red-500">*</span></label>
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-6 sm:p-8 text-center bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="ulcer-upload"
                ref={ulcerImageInputRef}
                onChange={handleUlcerImageChange}
              />
              <label htmlFor="ulcer-upload" className="cursor-pointer flex flex-col items-center w-full">
                {!ulcerImageBase64 ? (
                  <>
                    <span className="material-icons text-4xl text-slate-400 mb-3 block">cloud_upload</span>
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Drop an image here or click to browse</span>
                    <span className="text-xs text-slate-400 mt-1">Supports JPG, PNG</span>
                  </>
                ) : (
                  <div className="relative w-full h-40 md:h-48 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-black/5 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`data:image/jpeg;base64,${ulcerImageBase64}`} alt="Ulcer Preview" className="h-full w-full object-contain" />
                    <div className="absolute top-2 right-2 bg-violet-600 text-white rounded-full p-1.5 shadow-md flex items-center justify-center">
                      <span className="material-icons text-[16px]">edit</span>
                    </div>
                  </div>
                )}
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 sm:mb-2">Upload Date</label>
            <div className="relative border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 overflow-hidden">
              <input
                className="w-full px-4 py-2.5 sm:py-3 bg-transparent focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all dark:text-white [color-scheme:light] dark:[color-scheme:dark]"
                type="date"
                value={ulcerUploadDate}
                onChange={(e) => setUlcerUploadDate(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 sm:mb-2">AI Detection Result</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <span className="material-icons text-xl">psychology</span>
              </span>
              <input
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all dark:text-white placeholder-slate-400"
                placeholder="e.g., strange points..."
                type="text"
                value={aiDetectionResult}
                onChange={(e) => setAiDetectionResult(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 sm:mb-2">AI Confidence</label>
            <input
              className="w-full px-4 py-2.5 sm:py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none dark:text-white"
              placeholder="e.g., 0.9"
              type="number"
              step="0.01"
              min="0"
              max="1"
              value={aiConfidence}
              onChange={(e) => setAiConfidence(e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 sm:mb-2">Notes</label>
            <textarea
              className="w-full px-4 py-2.5 sm:py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all dark:text-white resize-none"
              rows={3}
              placeholder="e.g., Patient feedback..."
              value={ulcerNotes}
              onChange={(e) => setUlcerNotes(e.target.value)}
            ></textarea>
          </div>
        </div>
      </div>

      <div className="mt-6 sm:mt-8 flex flex-col-reverse sm:flex-row justify-end items-stretch sm:items-center gap-3">
        <button 
          type="button" 
          onClick={handleCancelUlcer} 
          className="px-6 py-2.5 sm:py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-sm transition-colors w-full sm:w-auto text-center"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSaveUlcer}
          disabled={loadingSubmit}
          className="px-8 py-2.5 sm:py-2.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm shadow-md shadow-violet-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed w-full sm:w-auto"
        >
          {loadingSubmit ? <Loader2 className="w-5 h-5 animate-spin" /> : <span className="material-icons text-lg">check</span>}
          Save Image
        </button>
      </div>
    </div>
  );
}
