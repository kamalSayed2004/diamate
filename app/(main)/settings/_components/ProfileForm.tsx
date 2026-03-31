"use client";

import React, { useState, useRef } from "react";
import { Loader2, Camera, User, AlertCircle, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface PatientData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: number;
  address: string;
  phone: string;
  homePhone: string;
  email: string;
  profileImage: string;
  dateOfDiagnosis: string;
  diabetesType: number;
  weight: number;
  height: number;
  notes: string;
}

interface ProfileFormProps {
  patientId: number;
  token: string;
  initialData: PatientData;
}

export default function ProfileForm({
  patientId,
  token,
  initialData,
}: ProfileFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const [formData, setFormData] = useState<PatientData>(initialData);
  const [originalData, setOriginalData] = useState<PatientData>(initialData);

  const validateField = (name: keyof PatientData, value: any) => {
    let err = "";
    if (name === "firstName" || name === "lastName") {
      if (typeof value === "string" && !value.trim()) err = "Required.";
    } else if (name === "email") {
      if (
        typeof value === "string" &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      )
        err = "Invalid email.";
    } else if (name === "phone") {
      if (typeof value === "string" && !/^\d{11}$/.test(value))
        err = "Must be 11 digits.";
    } else if (name === "weight" || name === "height") {
      if (value !== "" && Number(value) < 0) err = "Must be >= 0.";
    }
    setValidationErrors((prev) => ({ ...prev, [name]: err }));
    return err === "";
  };

  const validateForm = () => {
    let isValid = true;
    for (const name of ["firstName", "lastName", "email", "phone"] as Array<
      keyof PatientData
    >) {
      if (!validateField(name, formData[name])) isValid = false;
    }
    return isValid;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;
    let finalValue: any = value;
    if (type === "number" || name === "gender" || name === "diabetesType")
      finalValue = value === "" ? "" : Number(value);
    if (name === "phone" || name === "homePhone")
      finalValue = value.replace(/\D/g, "");

    setFormData((prev) => ({ ...prev, [name]: finalValue }));
    if (isEditing) validateField(name as keyof PatientData, finalValue);
    setSuccess(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          const resStr = reader.result as string;
          setFormData((prev) => ({
            ...prev,
            profileImage: resStr.includes(",") ? resStr.split(",")[1] : resStr,
          }));
          setSuccess(false);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setFormData(originalData);
      setValidationErrors({});
    }
    setIsEditing(!isEditing);
    setSuccess(false);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    setError(null);
    if (!validateForm()) {
      setError("Please fix errors before saving.");
      return;
    }

    setSaving(true);
    const payload = {
      ...formData,
      dateOfBirth: formData.dateOfBirth || "0001-01-01",
      dateOfDiagnosis: formData.dateOfDiagnosis || "0001-01-01",
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API}/Patients/UpdatePatient/${patientId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );
      if (!response.ok) throw new Error("Update failed. Please try again.");

      setSuccess(true);
      setOriginalData(formData);
      setIsEditing(false);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (patientId === 0) return null;

  const labelClass =
    "block text-base font-bold text-black dark:text-slate-50 mb-2.5";
  const inputClass = (name: keyof PatientData) => {
    const errorColor = validationErrors[name]
      ? "border-red-500"
      : "border-slate-200 dark:border-slate-800";
    return `w-full p-3.5 text-lg rounded-xl border bg-slate-50/50 dark:bg-slate-900/40 text-black dark:text-white placeholder-black/40 dark:placeholder-white/40 focus:outline-none focus:border-slate-500 transition-colors ${errorColor}`;
  };
  const displayValueClass =
    "text-lg text-black dark:text-white font-medium py-3 min-h-[52px] border-b border-slate-200/50 dark:border-slate-800/50 break-words whitespace-pre-wrap";

  const renderField = (
    label: string,
    name: keyof PatientData,
    type: string = "text",
    colSpan: string = "md:col-span-12",
  ) => (
    <div className={colSpan}>
      <label className={labelClass}>
        {label}{" "}
        {isEditing &&
          ["firstName", "lastName", "email", "phone"].includes(name) && (
            <span className="text-red-400">*</span>
          )}
      </label>

      {isEditing ? (
        <>
          {type === "textarea" ? (
            <textarea
              name={name}
              value={formData[name] as string}
              onChange={handleChange}
              rows={4}
              className={`${inputClass(name)} resize-none`}
            />
          ) : type === "select" && name === "gender" ? (
            <select
              name={name}
              value={formData[name] as number}
              onChange={handleChange}
              className={inputClass(name)}
            >
              <option value={0}>Male</option>
              <option value={1}>Female</option>
            </select>
          ) : type === "select" && name === "diabetesType" ? (
            <select
              name={name}
              value={String(formData[name] || 1)}
              onChange={handleChange}
              className={inputClass(name)}
            >
              <option value="1">Type 1</option>
              <option value="2">Type 2</option>
              <option value="3">Gestational</option>
              <option value="4">Pre-diabetes</option>
            </select>
          ) : (
            <input
              type={type}
              name={name}
              value={formData[name] as string | number}
              onChange={handleChange}
              maxLength={
                name === "phone" || name === "homePhone" ? 11 : undefined
              }
              className={inputClass(name)}
            />
          )}
          {validationErrors[name] && (
            <div className="text-red-500 text-xs flex mt-1">
              <AlertCircle className="w-3 h-3 mr-1" suppressHydrationWarning={true} />
              {validationErrors[name]}
            </div>
          )}
        </>
      ) : (
        <p className={displayValueClass}>
          {formData[name] !== "" &&
          formData[name] !== undefined &&
          formData[name] !== null ? (
            name === "gender" ? (
              Number(formData[name]) === 0 ? (
                "Male"
              ) : (
                "Female"
              )
            ) : name === "diabetesType" ? (
              Number(formData[name]) === 1 ? (
                "Type 1"
              ) : Number(formData[name]) === 2 ? (
                "Type 2"
              ) : Number(formData[name]) === 3 ? (
                "Gestational"
              ) : Number(formData[name]) === 4 ? (
                "Pre-diabetes"
              ) : (
                "Not set"
              )
            ) : (
              formData[name]
            )
          ) : (
            <span className="text-black/60 dark:text-white/60 italic text-base">
              Not set
            </span>
          )}
        </p>
      )}
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-black dark:text-white text-4xl sm:text-5xl font-black leading-tight tracking-tight mb-2">
              Profile Settings
            </h1>
            <p className="text-black/80 dark:text-slate-100/80 text-lg sm:text-xl font-medium mt-2">
              Manage your personal information and health data.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 rounded-2xl text-red-600 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}
        {success && (
          <div className="p-4 bg-slate-50 dark:bg-slate-500/10 border border-slate-300 rounded-2xl text-slate-700 dark:text-slate-400 text-sm flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 shrink-0" suppressHydrationWarning={true} />
            <p>Profile updated successfully!</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          {/* Profile Overview Card */}
          <div className="bg-white/60 dark:bg-slate-950/40 backdrop-blur-xl rounded-3xl border border-slate-200/60 dark:border-slate-800/60 p-5 sm:p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-center md:items-center gap-6 md:gap-8">
            <div className="relative group shrink-0">
              <div
                className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 shadow-xl flex items-center justify-center bg-slate-100 dark:bg-slate-900 transition-colors ${isEditing ? "border-slate-500 cursor-pointer" : "border-slate-300 dark:border-slate-800"}`}
                onClick={() => isEditing && fileInputRef.current?.click()}
              >
                {formData.profileImage &&
                formData.profileImage !== "default.png" ? (
                  <img
                    src={
                      formData.profileImage.startsWith("data:")
                        ? formData.profileImage
                        : `data:image/jpeg;base64,${formData.profileImage}`
                    }
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-10 h-10 sm:w-12 sm:h-12 text-slate-700 dark:text-slate-200 font-bold" suppressHydrationWarning={true} />
                )}
                {isEditing && (
                  <div className="absolute inset-0 bg-slate-950/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Camera className="text-white w-8 h-8" suppressHydrationWarning={true} />
                  </div>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
              {isEditing && (
                <div className="mt-3 flex flex-col items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs text-black dark:text-white font-bold hover:underline transition-all"
                  >
                    Tap to change
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 text-center md:text-left flex flex-col justify-center">
              <h2 className="text-2xl sm:text-3xl font-black text-black dark:text-white mb-1.5 sm:mb-2 max-w-full break-words">
                {formData.firstName || formData.lastName
                  ? `${formData.firstName} ${formData.lastName}`
                  : "New Patient"}
              </h2>
              <p className="text-base sm:text-lg text-black/60 dark:text-slate-100/60 font-bold break-all">
                {formData.email || "No email provided"}
              </p>
            </div>

            <div className="flex flex-col gap-3 shrink-0 w-full md:w-auto mt-2 md:mt-0">
              {isEditing &&
                formData.profileImage &&
                formData.profileImage !== "default.png" && (
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, profileImage: "" }));
                      setSuccess(false);
                    }}
                    className="w-full md:w-auto px-6 sm:px-8 py-3 text-base sm:text-lg rounded-xl font-bold transition duration-200 border border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
                  >
                    Remove Photo
                  </button>
                )}
              <button
                type="button"
                onClick={handleEditToggle}
                className={`w-full md:w-auto px-6 sm:px-8 py-3 text-base sm:text-lg rounded-xl font-bold transition duration-200 border ${
                  isEditing
                    ? "border-red-500/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20"
                    : "border-slate-300 dark:border-slate-700 bg-transparent text-black dark:text-white hover:bg-slate-50 dark:hover:bg-slate-900/30"
                }`}
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={saving}
                  className="w-full md:w-auto flex items-center justify-center gap-2 px-6 sm:px-8 py-3 text-base sm:text-lg rounded-xl font-bold transition duration-200 bg-slate-700 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Save Changes
                </button>
              )}
            </div>
          </div>

          {/* Personal Details Card */}
          <div className="bg-white/60 dark:bg-slate-950/40 backdrop-blur-xl rounded-3xl border border-slate-200/60 dark:border-slate-800/60 p-5 sm:p-6 md:p-8 shadow-sm">
            <h3 className="text-xl sm:text-2xl font-bold border-b border-slate-300 dark:border-slate-700 pb-3 sm:pb-4 mb-6 sm:mb-8 text-black dark:text-white">
              Personal Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-6 md:gap-x-8 md:gap-y-8">
              {renderField("First Name", "firstName", "text", "md:col-span-6")}
              {renderField("Last Name", "lastName", "text", "md:col-span-6")}
              {renderField(
                "Gender",
                "gender",
                "select",
                "md:col-span-6 lg:col-span-3",
              )}
              {renderField(
                "Date of Birth",
                "dateOfBirth",
                "date",
                "md:col-span-6 lg:col-span-3",
              )}
              {renderField(
                "Weight (kg)",
                "weight",
                "number",
                "md:col-span-6 lg:col-span-3",
              )}
              {renderField(
                "Height (cm)",
                "height",
                "number",
                "md:col-span-6 lg:col-span-3",
              )}
            </div>
          </div>

          {/* Health Info Card */}
          <div className="bg-white/60 dark:bg-slate-950/40 backdrop-blur-xl rounded-3xl border border-slate-200/60 dark:border-slate-800/60 p-5 sm:p-6 md:p-8 shadow-sm">
            <h3 className="text-xl sm:text-2xl font-bold border-b border-slate-300 dark:border-slate-700 pb-3 sm:pb-4 mb-6 sm:mb-8 text-black dark:text-white">
              Health Info
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-6 md:gap-x-8 md:gap-y-8">
              {renderField(
                "Diabetes Type",
                "diabetesType",
                "select",
                "md:col-span-6 lg:col-span-6",
              )}
              {renderField(
                "Diagnosis Date",
                "dateOfDiagnosis",
                "date",
                "md:col-span-6 lg:col-span-6",
              )}
            </div>
          </div>

          {/* Contact Info Card */}
          <div className="bg-white/60 dark:bg-slate-950/40 backdrop-blur-xl rounded-3xl border border-slate-200/60 dark:border-slate-800/60 p-5 sm:p-6 md:p-8 shadow-sm">
            <h3 className="text-xl sm:text-2xl font-bold border-b border-slate-300 dark:border-slate-700 pb-3 sm:pb-4 mb-6 sm:mb-8 text-black dark:text-white">
              Contact Info
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-6 md:gap-x-8 md:gap-y-8">
              {renderField("Email Address", "email", "email", "md:col-span-12")}
              {renderField(
                "Mobile Phone",
                "phone",
                "tel",
                "md:col-span-6 lg:col-span-6",
              )}
              {renderField(
                "Home Phone",
                "homePhone",
                "tel",
                "md:col-span-6 lg:col-span-6",
              )}
              {renderField("Full Address", "address", "text", "md:col-span-12")}
            </div>
          </div>

          {/* Additional Notes Card */}
          <div className="bg-white/60 dark:bg-slate-950/40 backdrop-blur-xl rounded-3xl border border-slate-200/60 dark:border-slate-800/60 p-5 sm:p-6 md:p-8 shadow-sm">
            <h3 className="text-xl sm:text-2xl font-bold border-b border-slate-300 dark:border-slate-700 pb-3 sm:pb-4 mb-6 sm:mb-8 text-black dark:text-white">
              Additional Notes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-6 md:gap-x-8 md:gap-y-8">
              {renderField(
                "Medical Notes",
                "notes",
                "textarea",
                "md:col-span-12",
              )}
            </div>
          </div>
        </form>
    </div>
  );
}
