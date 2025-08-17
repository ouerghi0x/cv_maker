import { Job, Key } from "@/lib/type";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL ||
  `http://localhost:${process.env.PORT || 3000}`;

// Cache across re-renders
const jobCache: { [key: string]: Job[] } = {};

export default function GetJobs({ keywords, location, cvLatex }: Key) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState<{
    [key: number]: boolean;
  }>({});
  const [minScore, setMinScore] = useState(0);
  const [sortBy, setSortBy] = useState<
    "score_desc" | "score_asc" | "title_asc" | "title_desc"
  >("score_desc");
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 9;

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError(null);

      const cacheKey = `${keywords}-${location}`;

      if (jobCache[cacheKey]) {
        setJobs(jobCache[cacheKey]);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `/api/jobs?keywords=${encodeURIComponent(
            keywords
          )}&location=${encodeURIComponent(location)}`
        );
        const existJobs = await res.json();

        if (existJobs.length > 0) {
          const sorted = [...existJobs].sort(
            (a: Job, b: Job) => (b.score || 0) - (a.score || 0)
          );
          jobCache[cacheKey] = sorted;
          setJobs(sorted);
          setLoading(false);
          return;
        }

        const externalRes = await fetch(
          `http://localhost:5000/get_jobs/${encodeURIComponent(
            keywords
          )}/${encodeURIComponent(location)}`
        );
        if (!externalRes.ok) throw new Error("Failed to fetch jobs");
        const jobs: Job[] = await externalRes.json();

        const summarizedJobs = await Promise.all(
          jobs.map(async (job) => {
            const prompt = `
              You are an expert career advisor.
              I will give you:
              1. A candidate's CV in LaTeX format.
              2. A job posting in JSON format.
              Your task:
              - Summarize the job posting in 1–2 sentences.
              - Estimate the candidate’s chances of being interviewed (percentage).
              Return ONLY valid JSON with the keys:
              {
                "newDescription": "short summary of the job",
                "score": "75%"
              }
              Candidate CV:
              ${cvLatex}
              Job Posting:
            `;

            try {
              const response = await fetch(`${baseUrl}/api/analyse_job_score`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  prompt,
                  description: job.description,
                }),
              });

              const { newDescription, score: rawScore } = await response.json();
              const score = parseFloat(rawScore.replace("%", "")) || 0;

              return { ...job, newDescription, score };
            } catch (err) {
              console.error("AI summarization failed:", err);
              return {
                ...job,
                newDescription: "Error summarizing job",
                score: 0,
              };
            }
          })
        );

        await fetch(`${baseUrl}/api/jobs`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jobs: summarizedJobs,
            keywords,
            location,
          }),
        });

        const sorted = [...summarizedJobs].sort(
          (a, b) => (b.score || 0) - (a.score || 0)
        );
        jobCache[cacheKey] = sorted;
        setJobs(sorted);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "An unknown error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [keywords, location, cvLatex]);

  const toggleDescription = (index: number) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as typeof sortBy);
    setCurrentPage(1);
  };

  const sortJobs = (jobsToSort: Job[]) => {
    const sorted = [...jobsToSort];
    switch (sortBy) {
      case "score_desc":
        sorted.sort((a, b) => (b.score || 0) - (a.score || 0));
        break;
      case "score_asc":
        sorted.sort((a, b) => (a.score || 0) - (b.score || 0));
        break;
      case "title_asc":
        sorted.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
        break;
      case "title_desc":
        sorted.sort((a, b) => (b.title || "").localeCompare(a.title || ""));
        break;
    }
    return sorted;
  };

  const filteredJobs = jobs.filter((job) => (job.score || 0) >= minScore);
  const sortedJobs = sortJobs(filteredJobs);
  const totalPages = Math.ceil(sortedJobs.length / jobsPerPage);
  const paginatedJobs = sortedJobs.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage
  );

  const getScoreColor = (score: number | undefined) => {
    const safeScore = score || 0;
    if (safeScore >= 80) return "green-500";
    if (safeScore >= 50) return "yellow-500";
    return "red-500";
  };

  if (error) return <p className="text-center text-red-500">Error: {error}</p>;
  if (!loading && jobs.length === 0)
    return (
      <p className="text-center text-gray-500 dark:text-gray-400">
        No jobs found.
      </p>
    );

  return (
    <div className="container mx-auto p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h2 className="text-3xl font-extrabold mb-8 text-gray-800 dark:text-gray-100 text-center">
        Available Jobs ({filteredJobs.length} found)
      </h2>

      {/* Filters and Sorting */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <div className="w-full sm:w-1/2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Minimum Match Score: {minScore}%
          </label>
          <input
            type="range"
            min={0}
            max={100}
            value={minScore}
            onChange={(e) => {
              setMinScore(parseInt(e.target.value));
              setCurrentPage(1);
            }}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
        </div>
        <div className="w-full sm:w-1/4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Sort By
          </label>
          <select
            value={sortBy}
            onChange={handleSortChange}
            className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:ring-2 focus:ring-blue-500"
          >
            <option value="score_desc">Score (High to Low)</option>
            <option value="score_asc">Score (Low to High)</option>
            <option value="title_asc">Title (A-Z)</option>
            <option value="title_desc">Title (Z-A)</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 animate-pulse"
            >
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full mr-4"></div>
                <div className="flex-1">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full mb-3"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedJobs.map((job, index) => (
            <motion.div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col justify-between transition duration-300 hover:shadow-2xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <div>
                <div className="flex items-center mb-4">
                  {job.logo_url && (
                    <Image
                      src={job.logo_url}
                      alt={job.company || "Company Logo"}
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded-full mr-4 object-contain border border-gray-200 dark:border-gray-600 p-1"
                    />
                  )}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                      {job.title || "Untitled Job"}
                    </h3>
                    <h4 className="text-md text-gray-600 dark:text-gray-400">
                      {job.company || "Unknown Company"}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      {location || "Remote"}
                    </p>
                  </div>
                </div>

                {/* Animated score */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Match Score: {job.score || 0}%
                  </p>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <motion.div
                      className={`bg-${getScoreColor(
                        job.score
                      )} h-3 rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${job.score || 0}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>

                <p
                  className={`text-gray-700 dark:text-gray-300 mb-4 text-sm leading-relaxed ${
                    expandedDescriptions[index] ? "" : "line-clamp-3"
                  }`}
                >
                  {job.newDescription || "No description available"}
                </p>
                {(job.newDescription || "").length > 150 && (
                  <button
                    onClick={() => toggleDescription(index)}
                    className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium focus:outline-none transition"
                  >
                    {expandedDescriptions[index] ? "Show Less" : "Show More"}
                  </button>
                )}
              </div>
              <a
                href={job.link || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block bg-blue-600 text-white font-bold py-2 px-4 rounded-lg text-center hover:bg-blue-700 transition duration-300 disabled:bg-gray-400"
                onClick={(e) => !job.link && e.preventDefault()}
              >
                View Job
              </a>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-2">
          {Array.from({ length: totalPages }).map((_, pageIndex) => (
            <button
              key={pageIndex}
              onClick={() => setCurrentPage(pageIndex + 1)}
              className={`px-4 py-2 rounded-md ${
                currentPage === pageIndex + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              } hover:bg-blue-500 hover:text-white transition duration-200`}
            >
              {pageIndex + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}