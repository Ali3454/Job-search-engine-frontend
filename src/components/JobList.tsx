"use client";
import { useState, useMemo } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { Job } from "@/types";
import JobCard from "./JobCard";
import PlatformFilter from "./PlatformFilter";

interface Props {
  jobs: Job[];
}

export default function JobList({ jobs: initialJobs }: Props) {
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [platformFilter, setPlatformFilter] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"rank" | "score" | "date">("score");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setJobs((items) => {
      const oldIndex = items.findIndex((j) => j.id === active.id);
      const newIndex = items.findIndex((j) => j.id === over.id);
      return arrayMove(items, oldIndex, newIndex);
    });
  };

  const filtered = useMemo(() => {
    let result = [...jobs];

    if (platformFilter.length > 0) {
      result = result.filter((j) =>
        platformFilter.some((p) => j.platform.toLowerCase().includes(p.toLowerCase()))
      );
    }

    if (categoryFilter !== "All") {
      result = result.filter((j) => j.category === categoryFilter);
    }

    if (remoteOnly) {
      result = result.filter((j) => j.is_remote);
    }

    if (sortBy === "score") {
      result.sort((a, b) => (b.match_score ?? 0) - (a.match_score ?? 0));
    } else if (sortBy === "date") {
      result.sort((a, b) => (b.posted_date ?? "").localeCompare(a.posted_date ?? ""));
    }

    return result;
  }, [jobs, platformFilter, categoryFilter, remoteOnly, sortBy]);

  const counts = useMemo(() => ({
    total: jobs.length,
    A: jobs.filter((j) => j.category === "A").length,
    B: jobs.filter((j) => j.category === "B").length,
    C: jobs.filter((j) => j.category === "C").length,
    remote: jobs.filter((j) => j.is_remote).length,
  }), [jobs]);

  return (
    <div className="space-y-4">
      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: "Total Jobs", value: counts.total, color: "text-gray-700" },
          { label: "Apply Now", value: counts.A, color: "text-green-600" },
          { label: "Minor Tweak", value: counts.B, color: "text-yellow-600" },
          { label: "Low Priority", value: counts.C, color: "text-red-500" },
          { label: "Remote", value: counts.remote, color: "text-purple-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-3 text-center">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <PlatformFilter
        selected={platformFilter}
        onChange={setPlatformFilter}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        remoteOnly={remoteOnly}
        onRemoteChange={setRemoteOnly}
      />

      {/* Sort + count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing <span className="font-semibold text-gray-800">{filtered.length}</span> jobs
        </p>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Sort:</span>
          {(["score", "date", "rank"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                sortBy === s ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
              }`}
            >
              {s === "score" ? "Match Score" : s === "date" ? "Newest" : "My Order"}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">No jobs match your filters</p>
          <p className="text-sm mt-1">Try removing some filters</p>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={filtered.map((j) => j.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {filtered.map((job, idx) => (
                <JobCard key={job.id} job={job} rank={idx + 1} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
