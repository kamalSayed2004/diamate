import React from "react";
import { BASE_API } from "@/app/config";

interface LabTest {
  id?: number;
  testName: string;
  result_value: number;
  normalRange: string;
  notes: string;
  testDate: string;
  report_Image: string;
}

interface LabTestListProps {
  patientId: number;
  token: string;
}

// Helper to determine if pure base64 is a PDF using magic bytes "%PDF-" -> "JVBERi0"
const isBase64Pdf = (base64String: string) => {
  if (!base64String) return false;
  if (base64String.startsWith("data:application/pdf")) return true;
  if (base64String.startsWith("JVBERi0")) return true;
  return false;
};

export default async function LabTestList({
  patientId,
  token,
}: LabTestListProps) {
  let labTests: LabTest[] = [];

  if (patientId > 0 && token) {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await fetch(
        `${BASE_API}/LabTest/GetAllTestsForPatient/${patientId}`,
        { headers, cache: "no-store" },
      );
      if (res.ok) {
        labTests = (await res.json()) || [];
      }
    } catch (err) {
      console.error("Failed to fetch lab tests", err);
    }
  }

  return (
    <>
      {labTests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-500">
          <span className="material-icons text-6xl mb-3 opacity-20">
            biotech
          </span>
          <p className="font-semibold px-4 text-center">No lab tests found.</p>
          <p className="text-xs mt-1 text-center px-6">
            Add a result to track history.
          </p>
        </div>
      ) : (
        labTests.map((test, idx) => {
          const isPdf = isBase64Pdf(test.report_Image);
          const mimeType = isPdf ? "application/pdf" : "image/jpeg";
          const fileExtension = isPdf ? "pdf" : "jpg";

          // Reconstruct Data URL for downloading/displaying
          const fileDataUrl = test.report_Image?.startsWith("data:")
            ? test.report_Image
            : `data:${mimeType};base64,${test.report_Image}`;

          // Format clean filename based on Test Name and Date
          const safeDateStr = new Date(test.testDate || Date.now())
            .toISOString()
            .split("T")[0];
          const downloadFileName = `LabReport_${test.testName.replace(/\s+/g, "_")}_${safeDateStr}.${fileExtension}`;

          return (
            <div
              key={test.id || idx}
              className="p-4 rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 hover:border-violet-500/30 transition-colors group"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-800 dark:text-white truncate max-w-[160px] sm:max-w-[200px]">
                    {test.testName}
                  </h3>
                  <p className="text-xs sm:text-sm font-medium text-violet-500">
                    Result: {test.result_value}
                  </p>
                </div>
                <div className="bg-white dark:bg-slate-800 px-2 py-1 rounded text-[10px] sm:text-xs font-semibold text-slate-600 dark:text-slate-300 shadow-sm border border-slate-200 dark:border-slate-700 whitespace-nowrap">
                  Nor. {test.normalRange}
                </div>
              </div>
              <div className="mt-3 flex flex-col gap-2">
                <div className="flex items-center justify-between text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1">
                    <span className="material-icons text-[12px] sm:text-[14px]">
                      event
                    </span>
                    {new Date(test.testDate || Date.now()).toLocaleDateString(
                      "en-US",
                    )}
                  </div>
                  {test.notes && (
                    <div
                      className="flex items-center gap-1 truncate max-w-[120px]"
                      title={test.notes}
                    >
                      <span className="material-icons text-[12px] sm:text-[14px]">
                        info
                      </span>
                      <span className="truncate">{test.notes}</span>
                    </div>
                  )}
                </div>
                {test.report_Image && (
                  <div className="mt-2 relative rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex justify-center items-center h-28 p-1 group/img">
                    {isPdf ? (
                      <div className="flex flex-col items-center justify-center opacity-80">
                        <span className="material-icons text-4xl text-red-500 mb-1">
                          picture_as_pdf
                        </span>
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                          PDF Document
                        </span>
                      </div>
                    ) : (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={fileDataUrl}
                        alt="Lab Report"
                        className="h-full w-full object-cover rounded-md"
                      />
                    )}

                    {/* Hover Download Overlay */}
                    <a
                      href={fileDataUrl}
                      download={downloadFileName}
                      className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-all duration-200 z-10"
                      title={`Download ${isPdf ? "PDF" : "Image"}`}
                    >
                      <div className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-full p-2.5 shadow-lg transform scale-90 group-hover/img:scale-100 transition-transform flex items-center gap-2">
                        <span className="material-icons text-xl text-violet-500">
                          file_download
                        </span>
                        <span className="text-xs font-bold pr-2">Download</span>
                      </div>
                    </a>
                  </div>
                )}
              </div>
            </div>
          );
        })
      )}
    </>
  );
}
