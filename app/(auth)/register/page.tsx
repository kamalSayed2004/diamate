"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Loader2,
  Sparkles,
  User,
  Heart,
  ShieldCheck,
  Camera,
} from "lucide-react";

const ValidationError = ({ message }: { message?: string }) => {
  if (!message) return null;
  return <p className="text-xs mt-1 font-medium text-red-500">{message}</p>;
};

export default function Register() {
  const [darkMode, setDarkMode] = useState<"light" | "dark">("light");
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const isDark = darkMode === "dark";

  // Form State
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
    firstName: "",
    lastName: "",
    dateOfBirth: new Date().toISOString(),
    gender: 0,
    address: "",
    phone: "",
    homePhone: "",
    email: "",
    profileImage: "default.png",
    dateOfDiagnosis: new Date().toISOString(),
    diabetesType: 1,
    weight: 70,
    height: 170,
    notes: "",
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
      const fallback = document.body.classList.contains("dark")
        ? "dark"
        : "light";
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

  const validateField = (name: string, value: any) => {
    let error = "";
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{11}$/;
    const nameRegex = /^[A-Za-z\s]{2,}$/;

    switch (name) {
      case "firstName":
      case "lastName":
        if (typeof value === "string") {
          if (!value.trim()) {
            error = "This field is required.";
          } else if (!nameRegex.test(value.trim())) {
            error =
              "Must contain at least 2 letters and no special characters or numbers.";
          }
        }
        break;
      case "userName":
        if (typeof value === "string" && value.length < 4) {
          error = "Username must be at least 4 characters long.";
        }
        break;
      case "email":
        if (typeof value === "string" && !emailRegex.test(value)) {
          error = "Please enter a valid email address.";
        }
        break;
      case "phone":
        if (typeof value === "string" && !phoneRegex.test(value)) {
          error = "Phone number must be exactly 11 digits.";
        }
        break;
      case "password":
        if (typeof value === "string" && !passwordRegex.test(value)) {
          error =
            "Password must be at least 8 characters, include 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (@$!%*?&).";
        }
        break;
      case "dateOfBirth":
        const dob = new Date(value);
        if (dob < new Date("1900-01-01") || dob > new Date("2010-01-01")) {
          error =
            "Value for DateOfBirth must be between 01/01/1900 and 01/01/2010.";
        }
        break;
      case "weight":
        if (Number(value) < 40 || Number(value) > 200) {
          error = "Value for Weight must be between 40 and 200.";
        }
        break;
      default:
        break;
    }

    setValidationErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
    return error === "";
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const finalValue = type === "number" ? Number(value) : value;

    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }));
    validateField(name, finalValue);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setFormData((prev) => ({
            ...prev,
            profileImage: reader.result as string,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    let isValid = true;
    const requiredFields = [
      "firstName",
      "lastName",
      "userName",
      "email",
      "phone",
      "password",
      "dateOfBirth",
      "weight",
    ];

    for (const name of requiredFields) {
      if (!validateField(name, (formData as any)[name])) {
        isValid = false;
      }
    }
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setError("Please fix the validation errors before submitting.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const imageToSend = formData.profileImage.startsWith("data:")
        ? formData.profileImage.split(",")[1]
        : formData.profileImage;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API}/Account/RegisterNewUser`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            profileImage: imageToSend,
            // Ensure dates are in ISO format if user changed them
            dateOfBirth: new Date(formData.dateOfBirth).toISOString(),
            dateOfDiagnosis: new Date(formData.dateOfDiagnosis).toISOString(),
          }),
        },
      );

      if (!response.ok)
        throw new Error("Registration failed. Please try again.");

      router.push("/login");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
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

  const getInputClass = (fieldName: string) => {
    const base = `w-full rounded-xl border p-3.5 outline-none transition-shadow ${inputBg}`;
    const error = validationErrors[fieldName];
    if (error) {
      return `${base} border-red-500 focus:ring-2 focus:ring-red-500/50`;
    }
    return `${base} focus:ring-2 focus:ring-blue-500/50`;
  };

  return (
    <div
      className={`min-h-screen font-[family-name:var(--font-geist-sans)] antialiased transition-colors duration-300 ${isDark ? "bg-slate-950 text-slate-100" : "bg-[#f0f4fa] text-slate-900"}`}
    >
      <div
        className={`pointer-events-none fixed inset-0 -z-10 ${
          isDark
            ? "bg-[radial-gradient(ellipse_90%_60%_at_50%_-18%,rgba(59,130,246,0.16),transparent),radial-gradient(ellipse_60%_45%_at_100%_0%,rgba(56,189,248,0.08),transparent)]"
            : "bg-[radial-gradient(ellipse_90%_55%_at_50%_-20%,rgba(59,130,246,0.14),transparent),radial-gradient(ellipse_55%_40%_at_100%_10%,rgba(125,211,252,0.12),transparent)]"
        }`}
      />

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8 relative z-10">
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
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Create your account
          </h1>
          <p className={`mt-3 ${muted}`}>
            Join DiaMate and start your journey to smarter health.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Account Info */}
          <section
            className={`group relative overflow-hidden rounded-[2rem] border p-6 sm:p-8 shadow-sm transition duration-300 ${surface} ${ringHover}`}
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-sky-400 to-blue-600 opacity-90" />
            <h2 className="flex items-center gap-2 text-xl font-semibold mb-6 text-blue-600 dark:text-blue-400">
              <ShieldCheck className="h-6 w-6" /> Account Details
            </h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <label className={`text-sm font-medium ml-1 ${muted}`}>
                  Username
                </label>
                <input
                  required
                  name="userName"
                  className={getInputClass("userName")}
                  onChange={handleChange}
                />
                <ValidationError message={validationErrors.userName} />
              </div>
              <div className="space-y-2">
                <label className={`text-sm font-medium ml-1 ${muted}`}>
                  Password
                </label>
                <input
                  required
                  name="password"
                  type="password"
                  className={getInputClass("password")}
                  onChange={handleChange}
                />
                <ValidationError message={validationErrors.password} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label className={`text-sm font-medium ml-1 ${muted}`}>
                  Email
                </label>
                <input
                  required
                  name="email"
                  type="email"
                  className={getInputClass("email")}
                  onChange={handleChange}
                />
                <ValidationError message={validationErrors.email} />
              </div>
            </div>
          </section>

          {/* Section 2: Personal Info */}
          <section
            className={`group relative overflow-hidden rounded-[2rem] border p-6 sm:p-8 shadow-sm transition duration-300 ${surface} ${ringHover}`}
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-sky-400 to-blue-600 opacity-90" />
            <h2 className="flex items-center gap-2 text-xl font-semibold mb-6 text-blue-600 dark:text-blue-400">
              <User className="h-6 w-6" /> Personal Information
            </h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <label className={`text-sm font-medium ml-1 ${muted}`}>
                  First Name
                </label>
                <input
                  required
                  name="firstName"
                  placeholder="e.g. John"
                  className={getInputClass("firstName")}
                  onChange={handleChange}
                />
                <ValidationError message={validationErrors.firstName} />
              </div>
              <div className="space-y-2">
                <label className={`text-sm font-medium ml-1 ${muted}`}>
                  Last Name
                </label>
                <input
                  required
                  name="lastName"
                  placeholder="e.g. Doe"
                  className={getInputClass("lastName")}
                  onChange={handleChange}
                />
                <ValidationError message={validationErrors.lastName} />
              </div>
              <div className="space-y-2">
                <label
                  className={`text-xs font-semibold uppercase tracking-wider ml-1 ${muted}`}
                >
                  Date of Birth
                </label>
                <input
                  required
                  name="dateOfBirth"
                  type="date"
                  className={getInputClass("dateOfBirth")}
                  onChange={handleChange}
                />
                <ValidationError message={validationErrors.dateOfBirth} />
              </div>
              <div className="space-y-2">
                <label
                  className={`text-xs font-semibold uppercase tracking-wider ml-1 ${muted}`}
                >
                  Gender
                </label>
                <select
                  name="gender"
                  className={getInputClass("gender")}
                  onChange={handleChange}
                >
                  <option value={0}>Male</option>
                  <option value={1}>Female</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className={`text-sm font-medium ml-1 ${muted}`}>
                  Mobile Phone
                </label>
                <input
                  required
                  name="phone"
                  placeholder="01012345678"
                  type="tel"
                  maxLength={11}
                  className={getInputClass("phone")}
                  onChange={handleChange}
                />
                <ValidationError message={validationErrors.phone} />
              </div>
              <div className="space-y-2">
                <label className={`text-sm font-medium ml-1 ${muted}`}>
                  Home Phone (Optional)
                </label>
                <input
                  name="homePhone"
                  placeholder="0222345678"
                  type="tel"
                  className={getInputClass("homePhone")}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label className={`text-sm font-medium ml-1 ${muted}`}>
                  Full Address
                </label>
                <input
                  name="address"
                  placeholder="123 Example St, City, Country"
                  className={getInputClass("address")}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label className={`text-sm font-medium ml-1 ${muted}`}>
                  Profile Image
                </label>
                <div className="flex items-center gap-4">
                  <div
                    className={`h-16 w-16 overflow-hidden rounded-full border-2 border-dashed flex items-stretch shrink-0 justify-center ${isDark ? "border-slate-600 bg-slate-800" : "border-slate-300 bg-slate-100"}`}
                  >
                    {formData.profileImage !== "default.png" &&
                    formData.profileImage ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={formData.profileImage}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full">
                        <Camera className={`h-6 w-6 ${muted}`} />
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className={`flex-1 rounded-xl border p-2 outline-none transition-shadow focus:ring-2 focus:ring-blue-500/50 ${inputBg} file:mr-4 file:rounded-xl file:border-0 file:bg-blue-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-200 dark:file:bg-blue-900/30 dark:file:text-blue-400`}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Health Info */}
          <section
            className={`group relative overflow-hidden rounded-[2rem] border p-6 sm:p-8 shadow-sm transition duration-300 ${surface} ${ringHover}`}
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-sky-400 to-blue-600 opacity-90" />
            <h2 className="flex items-center gap-2 text-xl font-semibold mb-6 text-blue-600 dark:text-blue-400">
              <Heart className="h-6 w-6" /> Health Profile
            </h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <label
                  className={`text-xs font-semibold uppercase tracking-wider ml-1 ${muted}`}
                >
                  Diabetes Type
                </label>
                <select
                  name="diabetesType"
                  className={getInputClass("diabetesType")}
                  onChange={handleChange}
                >
                  <option value={1}>Type 1</option>
                  <option value={2}>Type 2</option>
                  <option value={3}>Gestational</option>
                  <option value={4}>Pre-diabetes</option>
                </select>
              </div>
              <div className="space-y-2">
                <label
                  className={`text-xs font-semibold uppercase tracking-wider ml-1 ${muted}`}
                >
                  Diagnosis Date
                </label>
                <input
                  required
                  name="dateOfDiagnosis"
                  type="date"
                  className={getInputClass("dateOfDiagnosis")}
                  onChange={handleChange}
                />
                <ValidationError message={validationErrors.dateOfDiagnosis} />
              </div>
              <div className="space-y-2">
                <label
                  className={`text-xs font-semibold uppercase tracking-wider ml-1 ${muted}`}
                >
                  Weight (kg)
                </label>
                <input
                  name="weight"
                  type="number"
                  defaultValue={70}
                  className={getInputClass("weight")}
                  onChange={handleChange}
                />
                <ValidationError message={validationErrors.weight} />
              </div>
              <div className="space-y-2">
                <label
                  className={`text-xs font-semibold uppercase tracking-wider ml-1 ${muted}`}
                >
                  Height (cm)
                </label>
                <input
                  name="height"
                  type="number"
                  defaultValue={170}
                  className={getInputClass("height")}
                  onChange={handleChange}
                />
                <ValidationError message={validationErrors.height} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label className={`text-sm font-medium ml-1 ${muted}`}>
                  Medical Notes / Allergies
                </label>
                <textarea
                  name="notes"
                  placeholder="Any extra medical notes you would like to keep?"
                  rows={3}
                  className={getInputClass("notes")}
                  onChange={handleChange}
                />
              </div>
            </div>
          </section>

          {error && (
            <div className="rounded-2xl border border-red-500/50 bg-red-500/10 p-5 text-center text-sm font-medium text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-4 text-lg font-bold text-white shadow-xl shadow-blue-600/20 transition-all hover:bg-blue-700 active:scale-[0.98] disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <>
                  Complete Registration{" "}
                  <Sparkles className="h-5 w-5 transition-transform group-hover:-rotate-12" />
                </>
              )}
            </button>
          </div>
        </form>

        <p className={`mt-10 mb-8 text-center text-sm ${muted}`}>
          Already have an account?{" "}
          <a
            href="/login"
            className="font-semibold text-blue-600 hover:underline dark:text-blue-400"
          >
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
