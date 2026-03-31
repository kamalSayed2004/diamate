"use client";

import React, { useState } from "react";
import { Loader2, ShieldCheck, Lock, AlertCircle, CheckCircle2 } from "lucide-react";

interface ChangePasswordFormProps {
  token: string;
}

export default function ChangePasswordForm({ token }: ChangePasswordFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSuccess(false);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    setError(null);

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    if (formData.newPassword.length < 6) {
      setError("New password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API}/Account/ChangePassword`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword,
          }),
        },
      );

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Failed to change password. Please check your current password.");
      }

      setSuccess(true);
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full p-3.5 text-lg rounded-xl border bg-slate-50/50 dark:bg-slate-900/40 text-black dark:text-white placeholder-black/40 dark:placeholder-white/40 focus:outline-none focus:border-slate-500 transition-colors border-slate-200 dark:border-slate-800";
  const labelClass = "block text-base font-bold text-black dark:text-slate-50 mb-2.5";

  return (
    <div className="bg-white/60 dark:bg-slate-950/40 backdrop-blur-xl rounded-3xl border border-slate-200/60 dark:border-slate-800/60 p-5 sm:p-6 md:p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-6 sm:mb-8 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-xl">
          <ShieldCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" suppressHydrationWarning={true} />
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-black dark:text-white leading-none">
          Security & Password
        </h3>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-900/50 rounded-2xl text-red-600 dark:text-red-400 text-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 shrink-0" suppressHydrationWarning={true} />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-900/50 rounded-2xl text-emerald-600 dark:text-emerald-400 text-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" suppressHydrationWarning={true} />
          <p>Password changed successfully!</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-12">
            <label htmlFor="currentPassword" className={labelClass}>
              Current Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-5 h-5" suppressHydrationWarning={true} />
              </span>
              <input
                id="currentPassword"
                name="currentPassword"
                type="password"
                required
                className={`${inputClass} pl-11`}
                placeholder="••••••••"
                value={formData.currentPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="md:col-span-6">
            <label htmlFor="newPassword" className={labelClass}>
              New Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-5 h-5" suppressHydrationWarning={true} />
              </span>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                required
                className={`${inputClass} pl-11`}
                placeholder="••••••••"
                value={formData.newPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="md:col-span-6">
            <label htmlFor="confirmPassword" className={labelClass}>
              Confirm New Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-5 h-5" suppressHydrationWarning={true} />
              </span>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className={`${inputClass} pl-11`}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-3.5 text-lg rounded-xl font-bold transition-all bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" suppressHydrationWarning={true} /> : <ShieldCheck className="w-5 h-5" suppressHydrationWarning={true} />}
            Update Password
          </button>
        </div>
      </form>
    </div>
  );
}
