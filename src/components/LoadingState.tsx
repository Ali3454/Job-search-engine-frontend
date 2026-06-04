"use client";

interface Props {
  step: "analyzing" | "searching" | "rating";
}

const MESSAGES = {
  analyzing: {
    title: "Analyzing your CV...",
    subtitle: "Our AI is reading your experience, skills, and positioning",
    steps: ["Parsing resume content", "Identifying best-fit roles", "Scoring ATS compatibility", "Building role fit analysis"],
  },
  searching: {
    title: "Searching 11 job platforms...",
    subtitle: "Scraping LinkedIn, Indeed, Dice, Wellfound, and more",
    steps: ["LinkedIn & Indeed via JSearch", "USAJobs.gov federal roles", "Dice tech jobs", "Wellfound startups", "Simplify, FlexJobs, CareerBuilder..."],
  },
  rating: {
    title: "Rating job matches...",
    subtitle: "AI is scoring each job against your CV profile",
    steps: ["Comparing job requirements", "Checking skill alignment", "Estimating interview probability", "Categorizing A/B/C priority"],
  },
};

export default function LoadingState({ step }: Props) {
  const { title, subtitle, steps } = MESSAGES[step];

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="w-full max-w-md text-center">
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
          <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center text-2xl">
            {step === "analyzing" ? "🧠" : step === "searching" ? "🔍" : "⭐"}
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-500 mb-8">{subtitle}</p>

        <div className="space-y-3 text-left">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              </div>
              <span className="text-sm text-gray-600">{s}</span>
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-400 mt-6">
          {step === "analyzing" ? "This may take 30–60 seconds" : "This may take 60–120 seconds"}
        </p>
      </div>
    </div>
  );
}
