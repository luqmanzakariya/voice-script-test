"use client";
import { useState } from "react";
import {
  postAssignJobClient,
  getJobsClient,
  patchUpdateJobStatusClient,
  getUserReporterAndEditorClient,
} from "@/service/client/jobs";

type JobStatus = "NEW" | "ASSIGNED" | "TRANSCRIBED" | "REVIEWED" | "COMPLETED";

interface Job {
  id: number;
  caseName: string;
  duration: number;
  city: string;
  locationType: string;
  status: JobStatus;
  reporter: User | null;
  editor: User | null;
}

interface User {
  id: number;
  name: string;
  role: "ADMIN" | "REPORTER" | "EDITOR";
}

interface Props {
  jobs: Job[];
  reporters: User[];
  editors: User[];
}

const STATUS_ORDER: JobStatus[] = [
  "NEW",
  "ASSIGNED",
  "TRANSCRIBED",
  "REVIEWED",
  "COMPLETED",
];

function nextStatus(current: JobStatus): JobStatus | null {
  const idx = STATUS_ORDER.indexOf(current);
  return idx < STATUS_ORDER.length - 1 ? STATUS_ORDER[idx + 1] : null;
}

const STATUS_BADGE: Record<JobStatus, string> = {
  NEW: "bg-zinc-100 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-200",
  ASSIGNED: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200",
  TRANSCRIBED:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200",
  REVIEWED:
    "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200",
  COMPLETED:
    "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200",
};

export default function DashboardPage({
  jobs: initialJobs,
  reporters = [],
  editors = [],
}: Props) {
  const [jobs, setJobs] = useState<Job[]>(initialJobs || []);
  const [reporterList, setReporterList] = useState<User[]>(reporters);
  const [editorList, setEditorList] = useState<User[]>(editors);
  const [selectedUser, setSelectedUser] = useState<Record<number, string>>({});
  async function handleAssign(jobId: number) {
    const userId = selectedUser[jobId];
    if (!userId) return;

    const user = [...reporterList, ...editorList].find(
      (u) => u.id === Number(userId),
    );

    const payload =
      user?.role === "REPORTER"
        ? { jobId, reporterId: Number(userId) }
        : { jobId, editorId: Number(userId) };

    await postAssignJobClient(payload);
    const res = await getJobsClient();
    setJobs(res.data);
    const userRes = await getUserReporterAndEditorClient();
    setReporterList(userRes?.data?.reporters);
    setEditorList(userRes?.data?.editors);
    setSelectedUser(({ [jobId]: _, ...rest }) => rest);
  }

  async function handleUpdateStatus(job: Job) {
    const next = nextStatus(job.status);
    if (!next) return;
    await patchUpdateJobStatusClient({ jobId: job.id, status: next });
    const res = await getJobsClient();
    setJobs(res.data);
    const userRes = await getUserReporterAndEditorClient();
    setReporterList(userRes?.data?.reporters);
    setEditorList(userRes?.data?.editors);
  }

  return (
    <div className="flex flex-col flex-1 bg-zinc-50 dark:bg-black px-6 py-8 font-sans">
      <h1 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 mb-6">
        Available Jobs
      </h1>

      <div className="overflow-x-auto rounded-2xl shadow ring-1 ring-zinc-200 dark:ring-zinc-700">
        <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700 bg-white dark:bg-zinc-900 text-sm">
          <thead className="bg-zinc-100 dark:bg-zinc-800">
            <tr>
              {[
                "Case",
                "Duration (min)",
                "City",
                "Location",
                "Status",
                "Assign User",
                "Assign",
                "Update Status",
              ].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left font-semibold text-zinc-600 dark:text-zinc-300 whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {jobs.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-center text-zinc-400">
                  No jobs found.
                </td>
              </tr>
            )}
            {jobs.map((job) => {
              const next = nextStatus(job.status);
              return (
                <tr
                  key={job.id}
                  className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-zinc-800 dark:text-zinc-100 whitespace-nowrap">
                    {job.caseName}
                  </td>

                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400 text-center">
                    {job.duration}
                  </td>

                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
                    {job.city}
                  </td>

                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
                    {job.locationType}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_BADGE[job.status]}`}
                    >
                      {job.status}
                    </span>
                  </td>

                  {job.status === "ASSIGNED" || job.status === "REVIEWED" ? (
                    <td>On progress</td>
                  ) : (
                    <td className="px-4 py-3">
                      <select
                        value={selectedUser[job.id] ?? ""}
                        onChange={(e) =>
                          setSelectedUser((prev) => ({
                            ...prev,
                            [job.id]: e.target.value,
                          }))
                        }
                        className="rounded-lg border border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-800 px-2 py-1.5 text-sm text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500"
                      >
                        <option value="">Select user…</option>
                        {job?.status === "NEW" &&
                          reporterList.map((u) => (
                            <option key={u.id} value={u.id}>
                              {u.name} ({u.role})
                            </option>
                          ))}
                        {job?.status === "TRANSCRIBED" &&
                          editorList.map((u) => (
                            <option key={u.id} value={u.id}>
                              {u.name} ({u.role})
                            </option>
                          ))}
                      </select>
                    </td>
                  )}

                  <td className="px-4 py-3">
                    <button
                      disabled={
                        !selectedUser[job.id] ||
                        job.status === "ASSIGNED" ||
                        job.status === "REVIEWED"
                      }
                      onClick={() => handleAssign(job.id)}
                      className="rounded-lg bg-zinc-800 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold px-3 py-1.5 text-xs hover:bg-zinc-700 dark:hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Assign
                    </button>
                  </td>

                  <td className="px-4 py-3">
                    <button
                      disabled={
                        !next ||
                        job.status === "NEW" ||
                        job.status === "TRANSCRIBED"
                      }
                      onClick={() => handleUpdateStatus(job)}
                      className="rounded-lg border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 font-semibold px-3 py-1.5 text-xs hover:bg-zinc-100 dark:hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                    >
                      {next ? `→ ${next}` : "Completed"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
