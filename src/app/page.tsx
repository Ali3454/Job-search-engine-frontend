"use client";
import { useState } from "react";
import { Job, CVAnalysis, AppStep } from "@/types";
import { uploadCV, analyzeCV, searchJobs, rateJobs } from "@/lib/api";
import CVUpload from "@/components/CVUpload";
import AnalysisPanel from "@/components/AnalysisPanel";
import JobList from "@/components/JobList";
import LoadingState from "@/components/LoadingState";

export default function Home() {
  const [step, setStep] = useState<AppStep>("upload");
  const [loadingStage, setLoadingStage] = useState<"analyzing" | "searching" | "rating">("analyzing");
  const [error, setError] = useState<string | null>(null);

  const [filename, setFilename] = useState("");
  const [analysis, setAnalysis] = useState<CVAnalysis | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);

  const handleUpload = async (file: File) => {
    setError(null);
    setStep("analyzing");
    setLoadingStage("analyzing");

    try {
      // Step 1: Parse CV
      const uploaded = await uploadCV(file);
      setFilename(uploaded.filename);

      // Step 2: Analyze with Claude
      const cvAnalysis = await analyzeCV(uploaded.cv_text);
      setAnalysis(cvAnalysis);

      // Step 3: Search jobs using best-fit roles
      setLoadingStage("searching");
      setStep("searching");

      const searchRoles = [
        ...cvAnalysis.best_fit_roles.slice(0, 3),
        ...cvAnalysis.secondary_roles.slice(0, 2),
      ].filter(Boolean);

      const foundJobs = await searchJobs(searchRoles, "United States", []);

      // Step 4: Rate jobs with Claude
      setLoadingStage("rating");

      const ratedJobs = await rateJobs(
        cvAnalysis.full_analysis || "",
        foundJobs
      );

      setJobs(ratedJobs as Job[]);
      setStep("results");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(message);
      setStep("upload");
    }
  };

  const handleReset = () => {
    setStep("upload");
    setAnalysis(null);
    setJobs([]);
    setFilename("");
    setError(null);
  };

  return (
    <div>
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-3">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="font-medium">Error</p>
            <p className="mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {step === "upload" && (
        <CVUpload onUpload={handleUpload} isLoading={false} />
      )}

      {(step === "analyzing" || step === "searching") && (
        <LoadingState step={loadingStage} />
      )}

      {step === "results" && analysis && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Job Matches</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Found {jobs.length} jobs across 11 platforms · Ranked by AI match score
              </p>
            </div>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:border-gray-400 hover:text-gray-800 transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Upload New CV
            </button>
          </div>

          <AnalysisPanel analysis={analysis} filename={filename} />

          <JobList jobs={jobs} />
        </div>
      )}
    </div>
  );
}
