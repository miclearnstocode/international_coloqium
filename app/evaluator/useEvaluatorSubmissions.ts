"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiFetch } from "@/app/lib/api";

export interface Submission {
  id: number;
  research_title: string;
  author: string;
  co_author: string | null;
  university_agency: string;
  selected_track: string;
  specific_track: string;
  presentation_type: string | null;
  abstract_drive_view_url: string | null;
  abstract_drive_download_url: string | null;
  keywords: string;
  status: string;
  created_at?: string | null;
  rejection_reason?: string;
  rejection_email?: "pending" | "sent";
  acceptance_email?: "pending" | "sent";
}

export function useEvaluatorSubmissions() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    let inFlight = false;

    async function load() {
      if (controller.signal.aborted || inFlight || document.hidden) return;
      inFlight = true;
      try {
        const response = await apiFetch("/api/evaluator/submissions", {
          cache: "no-store",
          signal: controller.signal,
        });
        if (response.status === 401 || response.status === 422) {
          router.replace("/login");
          return;
        }
        if (response.status === 403) {
          setSubmissions([]);
          setLoaded(false);
          throw new Error("Evaluator access is required.");
        }
        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || "Could not load submissions.");
        if (controller.signal.aborted) return;
        setSubmissions(data.submissions);
        setLoaded(true);
        setError("");
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : "Could not load submissions.");
        }
      } finally {
        inFlight = false;
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void load();
    const interval = window.setInterval(load, 5000);
    window.addEventListener("focus", load);
    document.addEventListener("visibilitychange", load);
    return () => {
      controller.abort();
      window.clearInterval(interval);
      window.removeEventListener("focus", load);
      document.removeEventListener("visibilitychange", load);
    };
  }, [router, attempt]);

  function refresh() {
    setAttempt((current) => current + 1);
  }

  return { submissions, setSubmissions, loading, loaded, error, refresh };
}
