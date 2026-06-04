"use client";
import { useState } from "react";
import { CVAnalysis } from "@/types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Props {
  analysis: CVAnalysis;
  filename: string;
}

const LEVEL_COLORS: Record<string, string> = {
  "Entry level": "bg-green-100 text-green-800",
  "Mid level": "bg-blue-100 text-blue-800",
  "Senior": "bg-purple-100 text-purple-800",
  "Executive": "bg-red-100 text-red-800",
  "Specialized expert": "bg-orange-100 text-orange-800",
  "Career transition": "bg-yellow-100 text-yellow-800",
};

export default function AnalysisPanel({ analysis, filename }: Props) {
  const [expanded, setExpanded] = useState(false);

  const levelColor = LEVEL_COLORS[analysis.career_level || ""] || "bg-gray-100 text-gray-800";

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">CV Analysis Complete</h3>
          <p className="text-sm text-gray-500 mt-0.5">{filename}</p>
        </div>
        {analysis.career_level && (
          <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${levelColor}`}>
            {analysis.career_level}
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <RoleGroup label="Best Fit" roles={analysis.best_fit_roles} color="blue" />
        <RoleGroup label="Secondary" roles={analysis.secondary_roles} color="gray" />
        <RoleGroup label="Avoid" roles={analysis.avoid_roles} color="red" />
      </div>

      {analysis.full_analysis && (
        <div>
          <button
            onClick={() => setExpanded((p) => !p)}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
          >
            {expanded ? "Hide" : "Show"} full AI analysis
            <svg className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {expanded && (
            <div className="mt-4 p-4 bg-gray-50 rounded-xl text-sm prose prose-sm max-w-none overflow-auto max-h-[500px]">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {analysis.full_analysis}
              </ReactMarkdown>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function RoleGroup({
  label,
  roles,
  color,
}: {
  label: string;
  roles: string[];
  color: "blue" | "gray" | "red";
}) {
  const tag = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    gray: "bg-gray-50 text-gray-600 border-gray-200",
    red: "bg-red-50 text-red-700 border-red-200",
  }[color];

  const heading = {
    blue: "text-blue-700",
    gray: "text-gray-600",
    red: "text-red-700",
  }[color];

  return (
    <div>
      <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${heading}`}>{label}</p>
      <div className="flex flex-col gap-1.5">
        {roles.length > 0 ? (
          roles.slice(0, 5).map((r) => (
            <span key={r} className={`text-xs px-2 py-1 rounded border ${tag} truncate`} title={r}>
              {r}
            </span>
          ))
        ) : (
          <span className="text-xs text-gray-400 italic">None</span>
        )}
      </div>
    </div>
  );
}
