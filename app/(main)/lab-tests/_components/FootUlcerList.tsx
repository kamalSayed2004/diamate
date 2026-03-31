import React from "react";

interface FootUlcer {
  id?: number;
  image: string;
  uploadDate: string;
  ai_detectionResult: string;
  aiConfidence: number;
  notes: string;
}

interface FootUlcerListProps {
  patientId: number;
  token: string;
}

export default async function FootUlcerList({ patientId, token }: FootUlcerListProps) {
  let footUlcers: FootUlcer[] = [];

  if (patientId > 0 && token) {
    try {
      const headers = { "Authorization": `Bearer ${token}` };
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/FootUlcerImage/GetAllFootUlcerImagesForPatient/${patientId}`, { headers, cache: 'no-store' });
      if (res.ok) {
        footUlcers = await res.json() || [];
      }
    } catch (err) {
      console.error("Failed to fetch foot ulcers", err);
    }
  }
  return (
    <>
      {footUlcers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-500">
          <span className="material-icons text-6xl mb-3 opacity-20">healing</span>
          <p className="font-semibold px-4 text-center">No ulcer images found.</p>
          <p className="text-xs mt-1 text-center px-6">Upload to check with AI.</p>
        </div>
      ) : (
        footUlcers.map((ulcer, idx) => (
          <div key={ulcer.id || idx} className="p-4 rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 hover:border-violet-500/30 transition-colors group">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-800 dark:text-white truncate max-w-[200px] capitalize">
                  {ulcer.ai_detectionResult || "Detection Result"}
                </h3>
                <p className="text-xs sm:text-sm font-medium text-violet-500">Confidence: {ulcer.aiConfidence}</p>
              </div>
            </div>
            <div className="mt-3 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1">
                  <span className="material-icons text-[14px]">event</span>
                  {new Date(ulcer.uploadDate || Date.now()).toLocaleDateString('en-US')}
                </div>
              </div>
              {ulcer.image && (
                <div className="mt-2 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-black/5 flex justify-center items-center h-36 p-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={ulcer.image.startsWith("data:") ? ulcer.image : `data:image/jpeg;base64,${ulcer.image}`} alt="Foot Ulcer" className="h-full w-full object-cover rounded-md" />
                </div>
              )}
              {ulcer.notes && (
                <div className="mt-1 bg-violet-50/50 dark:bg-violet-900/20 border border-violet-100 dark:border-violet-800/50 px-3 py-2 rounded-lg flex items-start gap-2">
                  <span className="material-icons text-[16px] text-violet-500 mt-0.5" aria-hidden="true">chat_bubble_outline</span>
                  <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-snug">
                    "{ulcer.notes}"
                  </p>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </>
  );
}
