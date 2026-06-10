"use client";
import { useState } from "react";
import Link from "next/link";
import APP_ROUTE from "@/lib/app-route";
import { usePathname, useRouter } from "next/navigation";
import { formatNumber, formatDate } from "@/lib/helper";
import { postLogoutClient } from "@/service/client/auth";

interface Payment {
  id: number;
  caseName: string;
  duration: number;
  role: "ADMIN" | "REPORTER" | "EDITOR";
  rateType: "PER_MINUTE" | "FLAT_FEE";
  rateApplied: number;
  earnings: number;
  calculatedAt: string;
  user: {
    id: number;
    name: string;
    role: string;
  };
  job: {
    id: number;
  };
}

interface Props {
  payments: Payment[];
}

const RATE_TYPE_LABEL: Record<Payment["rateType"], string> = {
  PER_MINUTE: "Per Minute",
  FLAT_FEE: "Flat Fee",
};

export default function PaymentsPage({ payments = [] }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [listPayments] = useState<Payment[]>(payments);

  async function handleLogout() {
    await postLogoutClient();
    router.replace(APP_ROUTE.HOME);
  }

  return (
    <div className="flex flex-col flex-1 bg-zinc-50 dark:bg-black px-6 py-8 font-sans">
      <div className="flex items-center gap-4">
        <Link href={APP_ROUTE.DASHBOARD} className="mb-8">
          <h1
            className={`text-xl font-bold mb-6 ${pathname === "/dashboard" ? "text-blue-800" : "text-black"}`}
          >
            Available Jobs
          </h1>
        </Link>
        <Link href={APP_ROUTE.PAYMENT} className="mb-8">
          <h1
            className={`text-xl font-bold mb-6 ${pathname === "/payment" ? "text-blue-800" : "text-black"}`}
          >
            Payment
          </h1>
        </Link>
        <div className="mb-8 cursor-pointer" onClick={handleLogout}>
          <h1 className={`text-xl font-bold mb-6 `}>Logout</h1>
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
                "Assign User",
                "Role",
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
            {listPayments.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-center text-zinc-400">
                  No payments found.
                </td>
              </tr>
            )}
            {listPayments.map((payment) => {
              return (
                <tr
                  key={payment.id}
                  className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-zinc-800 dark:text-zinc-100 whitespace-nowrap">
                    {payment.caseName}
                  </td>

                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400 text-center">
                    {payment.duration}
                  </td>

                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
                    {RATE_TYPE_LABEL[payment.rateType]}
                  </td>

                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
                    IDR {formatNumber(payment.rateApplied)}
                  </td>

                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
                    IDR {formatNumber(payment.earnings)}
                  </td>

                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
                    {formatDate(payment.calculatedAt)}
                  </td>

                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
                    {payment.user.name}
                  </td>

                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
                    {payment.role}
                  </td>

                  <td className="px-4 py-3">
                    <Link href={`${APP_ROUTE.PAYMENT}/${payment.user.id}`}>
                      <button className="cursor-pointer rounded-lg bg-zinc-800 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold px-3 py-1.5 text-xs hover:bg-zinc-700 dark:hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                        Details
                      </button>
                    </Link>
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
