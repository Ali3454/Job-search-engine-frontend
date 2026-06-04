"use client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Job } from "@/types";

const PLATFORM_COLORS: Record<string, string> = {
  LinkedIn: "bg-blue-600",
  Indeed: "bg-indigo-500",
  ZipRecruiter: "bg-green-600",
  Glassdoor: "bg-teal-600",
  Adzuna: "bg-emerald-600",
  TheMuse: "bg-rose-500",
  RemoteOK: "bg-lime-600",
  Remotive: "bg-sky-600",
  Jobicy: "bg-violet-600",
  Arbeitnow: "bg-orange-500",
  USAJobs: "bg-blue-900",
};

const CATEGORY_STYLES: Record<string, { badge: string; border: string }> = {
  A: { badge: "bg-green-100 text-green-800", border: "border-l-green-500" },
  B: { badge: "bg-yellow-100 text-yellow-800", border: "border-l-yellow-500" },
  C: { badge: "bg-red-100 text-red-800", border: "border-l-red-400" },
};

interface Props {
  job: Job;
  rank: number;
}

export default function JobCard({ job, rank }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: job.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const platformColor = PLATFORM_COLORS[job.platform] || "bg-gray-500";
  const catStyle = job.category ? CATEGORY_STYLES[job.category] : undefined;

  const scoreColor =
    !job.match_score ? "text-gray-400"
    : job.match_score >= 8 ? "text-green-600"
    : job.match_score >= 6 ? "text-yellow-600"
    : "text-red-500";

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all
        ${catStyle ? `border-l-4 ${catStyle.border}` : ""}
        ${isDragging ? "shadow-xl ring-2 ring-blue-300" : ""}
      `}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Drag handle */}
          <button
            {...attributes}
            {...listeners}
            className="mt-1 text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing flex-shrink-0"
            title="Drag to reorder"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M7 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
            </svg>
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-xs text-gray-400 font-mono">#{rank}</span>
              <span className={`px-2 py-0.5 rounded text-white text-xs font-medium ${platformColor}`}>
                {job.platform}
              </span>
              {job.category && (
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${catStyle?.badge}`}>
                  Cat. {job.category}
                </span>
              )}
              {job.is_remote && (
                <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-700 text-xs font-medium">
                  Remote
                </span>
              )}
            </div>

            <h3 className="text-base font-semibold text-gray-900 truncate">{job.title}</h3>
            <p className="text-sm text-gray-600 mt-0.5">{job.company}</p>

            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {job.location}
              </span>
              {job.salary_range && (
                <span className="flex items-center gap-1 text-green-700 font-medium">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {job.salary_range}
                </span>
              )}
              {job.posted_date && (
                <span>{job.posted_date}</span>
              )}
              {job.employment_type && (
                <span className="capitalize">{job.employment_type.toLowerCase().replace(/_/g, " ")}</span>
              )}
            </div>

            {job.match_reason && (
              <p className="mt-2 text-xs text-gray-500 line-clamp-2">{job.match_reason}</p>
            )}
          </div>

          {/* Match score */}
          <div className="flex flex-col items-center flex-shrink-0 ml-2">
            <span className={`text-2xl font-bold ${scoreColor}`}>
              {job.match_score != null ? job.match_score.toFixed(1) : "—"}
            </span>
            <span className="text-[10px] text-gray-400">/ 10</span>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-end gap-2">
          {(job.apply_form_url || job.is_direct_apply) && (
            <a
              href={job.apply_form_url || job.apply_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1"
              title="Direct application form — no redirect"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Apply Form
            </a>
          )}
          <a
            href={job.apply_url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors"
          >
            View Job →
          </a>
        </div>
      </div>
    </div>
  );
}
