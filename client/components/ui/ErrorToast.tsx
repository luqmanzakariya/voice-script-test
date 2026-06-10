"use client";
import { useEffect } from "react";

interface Props {
  message: string | null;
  onClose: () => void;
  duration?: number;
}

export default function ErrorToast({ message, onClose, duration = 5000 }: Props) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-xl bg-red-600 px-5 py-3 shadow-lg text-white text-sm font-medium animate-fade-in">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 shrink-0"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.75-11.25a.75.75 0 011.5 0v4a.75.75 0 01-1.5 0v-4zm.75 7a1 1 0 100-2 1 1 0 000 2z"
          clipRule="evenodd"
        />
      </svg>
      <span>{message}</span>
      <button
        onClick={onClose}
        aria-label="Dismiss"
        className="ml-2 rounded-full hover:bg-red-500 p-0.5 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
}
