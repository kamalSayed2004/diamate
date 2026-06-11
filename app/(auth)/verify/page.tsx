"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Loader2,
  Sparkles,
  Mail,
  ShieldCheck,
  KeyRound,
  CheckCircle2,
} from "lucide-react";
import { BASE_API } from "@/app/config";

export default function Verify() {
  const [darkMode, setDarkMode] = useState<"light" | "dark">("light");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();
  const isDark = darkMode === "dark";

  // Form State
  const [formData, setFormData] = useState({
    email: "",
    code: "",
  });

  // Sync theme and catch email from URL query param if available
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode("dark");
      document.body.classList.add("dark");
    } else if (savedTheme === "light") {
      setDarkMode("light");
      document.body.classList.remove("dark");
    } else {
      const fallback = document.body.classList.contains("dark")
        ? "dark"
        : "light";
      setDarkMode(fallback as "light" | "dark");
    }

    // Safely parse email from URL query string on client side
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const emailParam = params.get("email");
      if (emailParam) {
        setFormData((prev) => ({ ...prev, email: emailParam }));
      }
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = darkMode === "light" ? "dark" : "light";
    setDarkMode(newTheme);
    localStorage.setItem("theme", newTheme);
    if (newTheme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email) {
      setError("Please enter your email address.");
      return;
    }
    if (!formData.code) {
      setError("Please enter your verification code.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const endpoint = `${BASE_API}/Account/VerifyEmail?email=${encodeURIComponent(formData.email)}&code=${encodeURIComponent(formData.code)}`;

      const response = await fetch(endpoint, {
        method: "POST", // Standard form submission method
        headers: { "Content-Type": "application/json" },
      });

      const responseText = await response.text();

      if (responseText.includes("Invalid code") || !response.ok) {
        throw new Error(responseText || "Invalid code. Please try again.");
      }

      setSuccess("Email verified successfully! Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 2500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!formData.email) {
      setError("Please enter your email address to resend the code.");
      return;
    }

    setResendLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const endpoint = `${BASE_API}/Account/ResendCode?email=${encodeURIComponent(formData.email)}`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(
          "Failed to resend verification code. Please try again.",
        );
      }

      setSuccess("A new verification code has been sent to your email.");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setResendLoading(false);
    }
  };

  const muted = isDark ? "text-slate-400" : "text-slate-600";
  const surface = isDark
    ? "border-slate-700/80 bg-slate-900/70 backdrop-blur-sm"
    : "border-slate-200/90 bg-white/90 backdrop-blur-sm";
  const ringHover = isDark
    ? "hover:border-blue-400/45 hover:shadow-blue-950/20"
    : "hover:border-blue-200 hover:shadow-blue-500/10";
  const inputBg = isDark
    ? "bg-slate-950/50 border-slate-700 text-white"
    : "bg-slate-50/50 border-slate-200 text-slate-900";

  return (
    <div
      className={`min-h-screen font-[family-name:var(--font-geist-sans)] antialiased transition-colors duration-300 flex flex-col ${isDark ? "bg-slate-950 text-slate-100" : "bg-[#f0f4fa] text-slate-900"}`}
    >
      <div
        className={`pointer-events-none fixed inset-0 -z-10 ${
          isDark
            ? "bg-[radial-gradient(ellipse_90%_60%_at_50%_-18%,rgba(59,130,246,0.16),transparent),radial-gradient(ellipse_60%_45%_at_100%_0%,rgba(56,189,248,0.08),transparent)]"
            : "bg-[radial-gradient(ellipse_90%_55%_at_50%_-20%,rgba(59,130,246,0.14),transparent),radial-gradient(ellipse_55%_40%_at_100%_10%,rgba(125,211,252,0.12),transparent)]"
        }`}
      />

      <div className="mx-auto w-full max-w-md px-4 py-8 sm:px-6 lg:px-8 relative z-10 my-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${muted} hover:text-blue-500`}
            type="button"
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </button>

          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="DiaMate Logo"
              className="h-8 w-8 cursor-pointer rounded-full object-cover ring-2 ring-blue-500/20 transition-transform hover:scale-105"
              onClick={toggleTheme}
            />
            <span className="text-lg font-semibold tracking-tight text-blue-600 dark:text-blue-400">
              DiaMate
            </span>
          </div>
        </div>

        {/* Title */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Verify your email
          </h1>
          <p className={`mt-3 ${muted}`}>
            Enter the verification code sent to your inbox.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <section
            className={`group relative overflow-hidden rounded-[2rem] border p-6 sm:p-8 shadow-sm transition duration-300 ${surface} ${ringHover}`}
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-sky-400 to-blue-600 opacity-90" />

            <div className="space-y-5">
              {/* Email Field */}
              <div className="space-y-2">
                <label className={`text-sm font-medium ml-1 ${muted}`}>
                  Email Address
                </label>
                <div
                  className={`flex items-center p-3 space-x-3 border w-full rounded-xl transition-shadow focus-within:ring-2 focus-within:ring-blue-500/50 ${inputBg}`}
                >
                  <Mail className={`h-5 w-5 shrink-0 ${muted}`} />
                  <input
                    required
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    className="w-full bg-transparent outline-none border-none focus:ring-0 p-0 text-base"
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Verification Code Field */}
              <div className="space-y-2">
                <label className={`text-sm font-medium ml-1 ${muted}`}>
                  Verification Code
                </label>
                <div
                  className={`flex items-center p-3 space-x-3 border w-full rounded-xl transition-shadow focus-within:ring-2 focus-within:ring-blue-500/50 ${inputBg}`}
                >
                  <KeyRound className={`h-5 w-5 shrink-0 ${muted}`} />
                  <input
                    required
                    name="code"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={formData.code}
                    className="w-full bg-transparent outline-none border-none focus:ring-0 p-0 text-base tracking-wide"
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Resend Action */}
              <div className="text-right pt-1">
                <button
                  type="button"
                  disabled={resendLoading}
                  onClick={handleResendCode}
                  className="text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400 disabled:opacity-60 inline-flex items-center gap-1"
                >
                  {resendLoading && (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  )}
                  Resend Code?
                </button>
              </div>
            </div>
          </section>

          {error && (
            <div className="rounded-2xl border border-red-500/50 bg-red-500/10 p-4 text-center text-sm font-medium text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-2xl border border-emerald-500/50 bg-emerald-500/10 p-4 text-center text-sm font-medium text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              {success}
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-4 text-lg font-bold text-white shadow-xl shadow-blue-600/20 transition-all hover:bg-blue-700 active:scale-[0.98] disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <>
                  Verify Code{" "}
                  <Sparkles className="h-5 w-5 transition-transform group-hover:-rotate-12" />
                </>
              )}
            </button>
          </div>
        </form>

        <p className={`mt-10 mb-8 text-center text-sm ${muted}`}>
          Back to{" "}
          <a
            href="/login"
            className="font-semibold text-blue-600 hover:underline dark:text-blue-400"
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
