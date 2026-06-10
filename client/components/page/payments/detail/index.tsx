"use client";
import { useState } from "react";
import { formatNumber, formatDate } from "@/lib/helper";
import { useRouter } from "next/navigation";

interface Payment {
  paymentId: number;
  jobId: number;
  caseName: string;
  duration: number;
  rateType: "PER_MINUTE" | "FLAT_FEE";
  rateApplied: number;
  earnings: number;
  calculatedAt: string;
}

interface PaymentDetail {
  userId: number;
  name: string;
  role: "ADMIN" | "REPORTER" | "EDITOR";
  totalEarnings: number;
  jobs: Payment[];
  rateType: "PER_MINUTE" | "FLAT_FEE";
}

interface Props {
  paymentDetail: PaymentDetail;
}

const RATE_TYPE_LABEL: Record<Payment["rateType"], string> = {
  PER_MINUTE: "Per Minute",
  FLAT_FEE: "Flat Fee",
};

export default function PaymentDetailPage({ paymentDetail }: Props) {
  const router = useRouter();
  const [jobList] = useState<Payment[]>(paymentDetail?.jobs);

  return (
    <div className="flex flex-col flex-1 bg-zinc-50 dark:bg-black px-6 py-8 font-sans">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-4 text-xl font-bold mb-6 cursor-pointer rounded-lg bg-zinc-800 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold px-3 py-1.5 text-xs hover:bg-zinc-700 dark:hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <div>&#8592;</div>
          <div>Back</div>
        </button>
      </div>

      <div className="mb-8 w-fit px-4 overflow-x-auto rounded-2xl shadow ring-1 ring-zinc-200 dark:ring-zinc-700">
        <div className="flex gap-[40px]">
          <div className="p-2 min-w-[120px]">Name</div>
          <div className="p-2">: {paymentDetail.name}</div>
        </div>
        <div className="flex gap-[40px]">
          <div className="p-2 min-w-[120px]">Role</div>
          <div className="p-2">: {paymentDetail.role}</div>
        </div>
        <div className="flex gap-[40px]">
          <div className="p-2 min-w-[120px]">Total Earnings</div>
          <div className="p-2">
            : IDR {formatNumber(paymentDetail.totalEarnings)}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl shadow ring-1 ring-zinc-200 dark:ring-zinc-700">
        <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700 bg-white dark:bg-zinc-900 text-sm">
          <thead className="bg-zinc-100 dark:bg-zinc-800">
            <tr>
              {[
                "Case",
                "Duration (min)",
                "Rate Type",
                "Rate Applied",
                "Earnings",
                "Calculated At",
                "",
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
            {jobList.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-center text-zinc-400">
                  No payments found.
                </td>
              </tr>
            )}
            {jobList.map((job, i) => {
              return (
                <tr
                  key={i}
                  className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-zinc-800 dark:text-zinc-100 whitespace-nowrap">
                    {job.caseName}
                  </td>

                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400 text-center">
                    {job.duration}
                  </td>

                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
                    {RATE_TYPE_LABEL[job.rateType]}
                  </td>

                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
                    IDR {formatNumber(job.rateApplied)}
                  </td>

                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
                    IDR {formatNumber(job.earnings)}
                  </td>

                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
                    {formatDate(job.calculatedAt)}
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
