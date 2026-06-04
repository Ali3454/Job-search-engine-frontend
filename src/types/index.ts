export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  platform: string;
  posted_date?: string;
  salary_range?: string;
  description?: string;
  apply_url: string;
  apply_form_url?: string;   // direct ATS form link (Greenhouse, Lever, Workday…)
  is_direct_apply: boolean;  // true when apply_url goes straight to a form
  match_score?: number;
  match_reason?: string;
  category?: "A" | "B" | "C";
  is_remote: boolean;
  employment_type?: string;
}

export interface CVAnalysis {
  raw_text: string;
  executive_summary?: string;
  best_fit_roles: string[];
  secondary_roles: string[];
  avoid_roles: string[];
  career_level?: string;
  ats_score?: number;
  full_analysis?: string;
}

export interface CVUploadResponse {
  cv_text: string;
  filename: string;
  char_count: number;
}

export type AppStep = "upload" | "analyzing" | "searching" | "results";

export type SortField = "match_score" | "posted_date" | "platform" | "category";
