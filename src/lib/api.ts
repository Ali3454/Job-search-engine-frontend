import axios from "axios";
import { CVUploadResponse, CVAnalysis, Job } from "@/types";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  timeout: 300000, // default 5 min for slow calls
});

export async function uploadCV(file: File): Promise<CVUploadResponse> {
  const form = new FormData();
  form.append("file", file);
  const { data } = await api.post<CVUploadResponse>("/api/cv/upload", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function analyzeCV(cvText: string): Promise<CVAnalysis> {
  const { data } = await api.post<CVAnalysis>(
    "/api/analysis/analyze",
    { cv_text: cvText },
    { timeout: 300000 } // 5 min — Claude deep analysis takes time
  );
  return data;
}

export async function searchJobs(
  roles: string[],
  location: string = "United States",
  platforms: string[] = []
): Promise<Job[]> {
  const { data } = await api.post<Job[]>(
    "/api/jobs/search",
    { roles, location, platforms },
    { timeout: 300000 } // 5 min — JSearch sequential + multiple scrapers
  );
  return data;
}

export async function rateJobs(
  cvAnalysis: string,
  jobs: Job[]
): Promise<Job[]> {
  const { data } = await api.post<Job[]>(
    "/api/jobs/rate",
    { cv_analysis: cvAnalysis, jobs },
    { timeout: 300000 } // 5 min — Claude Haiku rating
  );
  return data;
}

export async function getPlatforms(): Promise<string[]> {
  const { data } = await api.get<{ platforms: string[] }>("/api/jobs/platforms");
  return data.platforms;
}
