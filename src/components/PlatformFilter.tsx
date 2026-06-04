"use client";

const ALL_PLATFORMS = [
  { key: "linkedin", label: "LinkedIn", color: "bg-blue-600" },
  { key: "indeed", label: "Indeed", color: "bg-indigo-500" },
  { key: "ziprecruiter", label: "ZipRecruiter", color: "bg-green-600" },
  { key: "glassdoor", label: "Glassdoor", color: "bg-teal-600" },
  { key: "adzuna", label: "Adzuna", color: "bg-emerald-600" },
  { key: "themuse", label: "The Muse", color: "bg-rose-500" },
  { key: "remoteok", label: "RemoteOK", color: "bg-lime-600" },
  { key: "remotive", label: "Remotive", color: "bg-sky-600" },
  { key: "jobicy", label: "Jobicy", color: "bg-violet-600" },
  { key: "arbeitnow", label: "Arbeitnow", color: "bg-orange-500" },
  { key: "usajobs", label: "USAJobs.gov", color: "bg-blue-900" },
];

interface Props {
  selected: string[];
  onChange: (platforms: string[]) => void;
  categoryFilter: string;
  onCategoryChange: (cat: string) => void;
  remoteOnly: boolean;
  onRemoteChange: (v: boolean) => void;
}

export default function PlatformFilter({
  selected,
  onChange,
  categoryFilter,
  onCategoryChange,
  remoteOnly,
  onRemoteChange,
}: Props) {
  const allSelected = selected.length === 0;

  const toggle = (key: string) => {
    if (selected.includes(key)) {
      const next = selected.filter((k) => k !== key);
      onChange(next);
    } else {
      onChange([...selected, key]);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Platforms</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onChange([])}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              allSelected ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
            }`}
          >
            All
          </button>
          {ALL_PLATFORMS.map((p) => {
            const active = selected.includes(p.key);
            return (
              <button
                key={p.key}
                onClick={() => toggle(p.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  active ? `${p.color} text-white border-transparent` : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Category</p>
          <div className="flex gap-2">
            {["All", "A", "B", "C"].map((cat) => (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  categoryFilter === cat
                    ? cat === "A" ? "bg-green-600 text-white border-green-600"
                    : cat === "B" ? "bg-yellow-500 text-white border-yellow-500"
                    : cat === "C" ? "bg-red-500 text-white border-red-500"
                    : "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
                }`}
              >
                {cat === "A" ? "A — Apply Now" : cat === "B" ? "B — Minor Tweak" : cat === "C" ? "C — Low Priority" : "All"}
              </button>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-2 cursor-pointer mt-5">
          <div
            onClick={() => onRemoteChange(!remoteOnly)}
            className={`w-10 h-6 rounded-full transition-colors relative ${remoteOnly ? "bg-blue-600" : "bg-gray-200"}`}
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${remoteOnly ? "translate-x-5" : "translate-x-1"}`} />
          </div>
          <span className="text-xs font-medium text-gray-600">Remote only</span>
        </label>
      </div>
    </div>
  );
}
