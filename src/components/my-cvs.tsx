"use client";

import { CVItem } from "@/lib/type";
import { useEffect, useState } from "react";
import GetJobs from "./jobs/get_jobs";
import { Loader2, FileText } from "lucide-react";

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL ||
  `http://localhost:${process.env.PORT || 3000}`;

async function fetchMyCvs(): Promise<CVItem[]> {
  const res = await fetch(`${baseUrl}/api/getCvs`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch CVs: ${res.status}`);
  }

  const data = await res.json();
  return data.cvCover || [];
}

const cvs_cache = new Set<number>();
const cvs_data_cache: CVItem[] = [];

export default function MyCvs() {
  const [cvs, setCvs] = useState<CVItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCv, setSelectedCv] = useState<CVItem | null>(null);

  useEffect(() => {
    const loadCvs = async () => {
      if (cvs_data_cache.length > 0) {
        setCvs(cvs_data_cache);
        setLoading(false);
        return;
      }

      try {
        const list = await fetchMyCvs();
        list.forEach((cv) => {
          if (!cvs_cache.has(cv.id)) {
            cvs_cache.add(cv.id);
            cvs_data_cache.push(cv);
          }
        });
        setCvs(cvs_data_cache);
      } catch (err) {
        console.error(err);
        setError("Could not load your CVs. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadCvs();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        Loading your CVs...
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
     {/* Sidebar */}
      <aside className="w-72 bg-white shadow-md border-r hidden md:flex flex-col">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Your CVs</h2>
          <p className="text-sm text-gray-500">Select a CV to view related jobs</p>
        </div>

        {/* Make list scrollable with Tailwind */}
        <div className="flex-1 overflow-y-auto p-4">
          {cvs.length === 0 ? (
            <div className="text-gray-500 text-center mt-6">
              No CVs found. Upload one to get started.
            </div>
          ) : (
            <div className="space-y-3">
              {cvs.map((cv) => (
                <div
                  key={cv.id}
                  className={`cursor-pointer border rounded-lg p-3 transition hover:shadow-md ${
                    selectedCv?.id === cv.id ? "border-blue-500 shadow-lg" : "border-gray-200"
                  }`}
                  onClick={() => setSelectedCv(cv)}
                >
                  <div className="font-medium text-gray-900">CV #{cv.id}</div>
                  <div className="text-sm text-gray-500">{cv.cvType}</div>
                  {cv.keywords && (
                    <p className="text-sm mt-1">💡 {cv.keywords}</p>
                  )}
                  {cv.location && (
                    <p className="text-sm text-gray-500">📍 {cv.location}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>


      {/* Main content */}
      <main className="flex-1 p-6">
        {!selectedCv ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <FileText className="h-12 w-12 mb-2 text-gray-400" />
            <p className="text-lg">Select a CV from the left to continue</p>
          </div>
        ) : (
          <>

            <GetJobs
              keywords={selectedCv.keywords || ""}
              location={selectedCv.location || ""}
              cvLatex={selectedCv.cvlatex || ""}
            />
          </>
        )}
      </main>
    </div>
  );
}
