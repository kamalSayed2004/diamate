"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Loader2, Sparkles, User, ShieldCheck } from "lucide-react";

export default function Login() {
  const [darkMode, setDarkMode] = useState<"light" | "dark">("light");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const isDark = darkMode === "dark";

  // Form State
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
       setDarkMode("dark");
       document.body.classList.add("dark");
    } else if (savedTheme === "light") {
       setDarkMode("light");
       document.body.classList.remove("dark");
    } else {
       const fallback = document.body.classList.contains("dark") ? "dark" : "light";
       setDarkMode(fallback as "light" | "dark");
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
    if (!formData.userName || !formData.password) {
      setError("Please enter both username and password.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/Account/LogIn`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: formData.userName,
          password: formData.password,
        }),
      });

      if (!response.ok) throw new Error("Invalid username or password. Please try again.");

      const data = await response.json().catch(() => ({}));

      if (data.token) {
        document.cookie = `token=${data.token}; path=/; max-age=86400`;
        
        try {
          const payloadBase64 = data.token.split('.')[1];
          // Use standard browser atob for decoding the base64 payload
          const decodedJson = atob(payloadBase64);
          const decoded = JSON.parse(decodedJson);
          
          const pid = decoded.PatientId || decoded.patientId;
          if (pid) {
            document.cookie = `patientId=${pid}; path=/; max-age=86400`;
          }
        } catch (e) {
          console.error("Failed to decode token", e);
        }
      }

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const muted = isDark ? "text-slate-400" : "text-slate-600";
  const surface = isDark ? "border-slate-700/80 bg-slate-900/70 backdrop-blur-sm" : "border-slate-200/90 bg-white/90 backdrop-blur-sm";
  const ringHover = isDark ? "hover:border-blue-400/45 hover:shadow-blue-950/20" : "hover:border-blue-200 hover:shadow-blue-500/10";
  const inputBg = isDark ? "bg-slate-950/50 border-slate-700 text-white" : "bg-slate-50/50 border-slate-200 text-slate-900";

  return (
    <div className={`min-h-screen font-[family-name:var(--font-geist-sans)] antialiased transition-colors duration-300 flex flex-col ${isDark ? "bg-slate-950 text-slate-100" : "bg-[#f0f4fa] text-slate-900"}`}>
      <div
        className={`pointer-events-none fixed inset-0 -z-10 ${isDark
          ? "bg-[radial-gradient(ellipse_90%_60%_at_50%_-18%,rgba(59,130,246,0.16),transparent),radial-gradient(ellipse_60%_45%_at_100%_0%,rgba(56,189,248,0.08),transparent)]"
          : "bg-[radial-gradient(ellipse_90%_55%_at_50%_-20%,rgba(59,130,246,0.14),transparent),radial-gradient(ellipse_55%_40%_at_100%_10%,rgba(125,211,252,0.12),transparent)]"
          }`}
      />

      <div className="mx-auto w-full max-w-md px-4 py-8 sm:px-6 lg:px-8 relative z-10 my-auto">
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

        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Welcome back</h1>
          <p className={`mt-3 ${muted}`}>Enter your details to sign in to DiaMate.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <section className={`group relative overflow-hidden rounded-[2rem] border p-6 sm:p-8 shadow-sm transition duration-300 ${surface} ${ringHover}`}>
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-sky-400 to-blue-600 opacity-90" />
            <div className="space-y-5">
              <div className="space-y-2">
                <label className={`text-sm font-medium ml-1 ${muted}`}>Username</label>
                <div className={`flex items-center p-3 space-x-3 border w-full rounded-xl transition-shadow focus-within:ring-2 focus-within:ring-blue-500/50 ${inputBg}`}>
                  <User className={`h-5 w-5 ${muted}`} />
                  <input
                    required
                    name="userName"
                    placeholder="Username"
                    className="w-full bg-transparent outline-none border-none focus:ring-0 p-0 text-base"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <label className={`text-sm font-medium ${muted}`}>Password</label>
                  <a href="#" className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400">
                    Forgot password?
                  </a>
                </div>
                <div className={`flex items-center p-3 space-x-3 border w-full rounded-xl transition-shadow focus-within:ring-2 focus-within:ring-blue-500/50 ${inputBg}`}>
                  <ShieldCheck className={`h-5 w-5 ${muted}`} />
                  <input
                    required
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-transparent outline-none border-none focus:ring-0 p-0 text-base"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </section>

          {error && (
            <div className="rounded-2xl border border-red-500/50 bg-red-500/10 p-4 text-center text-sm font-medium text-red-600 dark:text-red-400">
              {error}
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
                  Sign In <Sparkles className="h-5 w-5 transition-transform group-hover:-rotate-12" />
                </>
              )}
            </button>
          </div>
        </form>

        <p className={`mt-10 mb-8 text-center text-sm ${muted}`}>
          Don&apos;t have an account?{" "}
          <a href="/register" className="font-semibold text-blue-600 hover:underline dark:text-blue-400">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
