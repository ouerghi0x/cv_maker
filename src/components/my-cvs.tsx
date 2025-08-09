"use client";

import { CVItem } from "@/lib/type";
import { useEffect, useState } from "react";

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL ||
  `http://localhost:${process.env.PORT || 3000}`;

async function fetchMyCvs(): Promise<CVItem[]> {
  const res = await fetch(`${baseUrl}/api/getCvs`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // ✅ send cookies for auth
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch CVs: ${res.status}`);
  }

  const data = await res.json();
  return data.cvcover || data.cvCover || [];
}

export default function MyCvs() {
  const [cvs, setCvs] = useState<CVItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // ✅ Skip SSR rendering — only run after client mounts
    setMounted(true);

    const loadCvs = async () => {
      try {
        const list = await fetchMyCvs();
        setCvs(list);
      } catch (err) {
        console.error(err);
        setError("Could not load your CVs. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadCvs();
  }, []);

  if (!mounted) return null; // ✅ Prevent hydration mismatch

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">Loading your CVs...</div>
    );
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white shadow-md p-4 border-r">
        <h2 className="text-lg font-semibold mb-4">Your CVs</h2>
        <nav className="space-y-2">
          {cvs.length === 0 ? (
            <div className="text-gray-500">No CVs found</div>
          ) : (
            cvs.map(({ id, cvType }) => (
              <button
                key={id}
                className="block w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 transition"
                onClick={() => alert(`Clicked CV #${id} of type ${cvType}`)}
              >
                <div className="text-gray-900 font-medium">CV #{id}</div>
                <div className="text-gray-500 text-sm">{cvType}</div>
              </button>
            ))
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold">CV & Cover Letter Details</h1>
        <p className="mt-2 text-gray-600">
          Select a CV from the sidebar to view or edit details.
        </p>
      </main>
    </div>
  );
}
