"use client";
import { useRef, useState, DragEvent } from "react";

interface Props {
  onUpload: (file: File) => void;
  isLoading: boolean;
}

export default function CVUpload({ onUpload, isLoading }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (file: File) => {
    const allowed = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"];
    if (!allowed.includes(file.type) && !file.name.match(/\.(pdf|docx|txt)$/i)) {
      alert("Please upload a PDF, DOCX, or TXT file.");
      return;
    }
    onUpload(file);
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="w-full max-w-xl">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">
          Upload Your CV
        </h2>
        <p className="text-gray-500 text-center mb-8">
          We'll analyze it with AI and find matching jobs across 11 platforms
        </p>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => !isLoading && inputRef.current?.click()}
          className={`
            border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all
            ${dragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"}
            ${isLoading ? "opacity-60 cursor-not-allowed" : ""}
          `}
        >
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept=".pdf,.docx,.txt"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            disabled={isLoading}
          />

          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-medium text-gray-700">
                {dragging ? "Drop your CV here" : "Drag & drop your CV"}
              </p>
              <p className="text-sm text-gray-400 mt-1">or click to browse</p>
              <p className="text-xs text-gray-400 mt-2">PDF, DOCX, or TXT</p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          {[
            { icon: "🔍", label: "AI Analysis", desc: "Deep CV diagnostics" },
            { icon: "🌐", label: "11 Platforms", desc: "LinkedIn, Indeed & more" },
            { icon: "⭐", label: "Job Scoring", desc: "Ranked by fit" },
          ].map((f) => (
            <div key={f.label} className="p-4 bg-gray-50 rounded-xl">
              <div className="text-2xl mb-1">{f.icon}</div>
              <div className="text-sm font-medium text-gray-700">{f.label}</div>
              <div className="text-xs text-gray-400">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
