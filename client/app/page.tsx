"use client";

import { useState } from "react";
import { postLoginClient } from "@/service/client/auth";
import { useRouter } from "next/navigation";
import APP_ROUTE from "@/lib/app-route";
import ErrorToast from "@/components/ui/ErrorToast";

export default function Home() {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await postLoginClient({ email: login, password });
      router.push(APP_ROUTE.DASHBOARD);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      const msg =
        err?.response?.data?.message ?? err?.message ?? "Login failed. Please try again.";
      setErrorMsg(msg);
    }
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <ErrorToast message={errorMsg} onClose={() => setErrorMsg(null)} />
      <div className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-2xl shadow-md p-8 flex flex-col gap-6">
        <h1 className="text-xl font-bold text-center text-zinc-800 dark:text-zinc-100">
          Court Reporting Workflow System
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="login"
              className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Login
            </label>
            <input
              id="login"
              type="text"
              autoComplete="username"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              placeholder="Enter your login"
              required
              className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="password"
              className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-500"
            />
          </div>
          <button
            type="submit"
            className="mt-2 rounded-lg bg-zinc-800 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold py-2 text-sm hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
