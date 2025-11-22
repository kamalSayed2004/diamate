import React, { useState, useEffect, useRef } from "react";
import { FaUser, FaCamera, FaExclamationCircle } from "react-icons/fa";
import settings from "./settings";
import Sidebar from "./components/SideBar";

const Settings = () => {
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    firstName: "",
    secondName: "",
    thirdName: "",
    lastName: "",
    dateOfBirth: "",
    gender: 0,
    address: "",
    phone: "",
    homePhone: "",
    email: "",
    weight: "",
    notes: "",
    profileImage: null,
  });

  const [originalData, setOriginalData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  // --- Validation Logic ---
  const validateField = (name, value) => {
    let error = "";

    // Regex patterns
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{11}$/;
    const nameRegex = /^[A-Za-z\s]{2,}$/;

    // Helper: convert to string and trim for regex checks
    const strValue = value ? String(value).trim() : "";

    switch (name) {
      case "firstName":
      case "secondName":
        if (!strValue) {
          error = "This field is required.";
        } else if (!nameRegex.test(strValue)) {
          error =
            "Must contain at least 2 letters and no special characters or numbers.";
        }
        break;

      case "thirdName":
      case "lastName":
        // Optional: Only validate if the user typed something
        if (strValue.length > 0 && !nameRegex.test(strValue)) {
          error =
            "Must contain at least 2 letters and no special characters or numbers.";
        }
        break;

      case "email":
        if (!emailRegex.test(strValue)) {
          error = "Please enter a valid email address.";
        }
        break;

      case "phone":
      case "homePhone":
        if (!phoneRegex.test(strValue)) {
          error = "Phone number must be exactly 11 digits.";
        }
        break;

      case "weight":
        if (value < 30 || value > 300) {
          error = "Weight must be between 30 kg and 300 kg.";
        }
        break;

      case "dateOfBirth":
        if (new Date(value) >= new Date()) {
          error = "Date of Birth cannot be today or a future date.";
        }
        break;

      default:
        break;
    }

    setValidationErrors((prev) => ({ ...prev, [name]: error }));
    return error === "";
  };

  const validateForm = () => {
    let isValid = true;

    // 1. Required Fields
    const requiredFields = [
      "firstName",
      "secondName",
      "email",
      "phone",
      "weight",
      "dateOfBirth",
    ];

    requiredFields.forEach((field) => {
      if (!validateField(field, formData[field])) {
        isValid = false;
      }
    });

    // 2. Optional Fields (validate only if not empty)
    const optionalFields = ["thirdName", "lastName", "homePhone"];
    optionalFields.forEach((field) => {
      if (formData[field] && formData[field].toString().trim() !== "") {
        if (!validateField(field, formData[field])) {
          isValid = false;
        }
      }
    });

    return isValid;
  };

  // --- Fetch Data ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        let token = localStorage.getItem("DiamateToken") || "";
        let id = localStorage.getItem("DiamateTokenId") || "";

        // Mock data for preview
        if (!id) {
          console.warn("Preview Mode: Using mock data");
          const mock = {
            firstName: "John",
            secondName: "Doe",
            email: "test@test.com",
            phone: "01234567890",
            weight: 75,
            gender: 0,
            dateOfBirth: "1995-01-01",
          };
          setFormData(mock);
          setOriginalData(mock);
          setLoading(false);
          return;
        }

        let response = await fetch(
          `${settings.API_BASE_URL}/Patients/GetPatient/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          let result = await response.json();

          // Handle Date
          if (result.dateOfBirth) {
            result.dateOfBirth = result.dateOfBirth.split("T")[0];
          }

          // Handle Image
          if (result.profileImage) {
            setImagePreview(`data:image/jpeg;base64,${result.profileImage}`);
          }

          setFormData(result);
          setOriginalData(result);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- Handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    let finalValue = value;

    // STRICT INPUT MASK: Numbers only for phone fields
    if (name === "phone" || name === "homePhone") {
      finalValue = value.replace(/\D/g, "");
    }

    setFormData((prev) => ({ ...prev, [name]: finalValue }));

    if (isEditing) {
      validateField(name, finalValue);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        const base64Data = reader.result.split(",")[1];
        setFormData((prev) => ({ ...prev, profileImage: base64Data }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setFormData(originalData);
      setValidationErrors({});
      if (originalData.profileImage) {
        setImagePreview(`data:image/jpeg;base64,${originalData.profileImage}`);
      } else {
        setImagePreview(null);
      }
    }
    setIsEditing(!isEditing);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert("Please fix the validation errors before saving.");
      return;
    }

    let token = localStorage.getItem("DiamateToken");
    let id = localStorage.getItem("DiamateTokenId");

    try {
      const payload = { ...formData };
      // Sanitize optional fields
      if (!payload.thirdName) payload.thirdName = null;
      if (!payload.lastName) payload.lastName = null;
      if (!payload.homePhone) payload.homePhone = null;

      let response = await fetch(
        `${settings.API_BASE_URL}/Patients/UpdatePatient/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        setOriginalData(formData);
        setIsEditing(false);
        window.dispatchEvent(new Event("userProfileUpdated"));
      } else {
        alert("Failed to update settings.");
        setOriginalData(formData);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating:", error);
    }
  };

  // --- Helper Styles & Renders ---
  const labelClass = `block text-sm font-medium ${settings.emailText} mb-1`;
  const inputClass = (name) =>
    `w-full p-3 rounded border ${settings.cardBg} ${
      validationErrors[name] ? "border-red-500" : settings.cardBorder
    } ${
      settings.activeText
    } focus:outline-none focus:border-[#13ec6d] placeholder-gray-500 transition-all duration-200`;

  const renderField = (label, name, type = "text", colSpan = "col-span-1") => (
    <div className={colSpan}>
      <label className={labelClass}>
        {label}{" "}
        {isEditing &&
          ["firstName", "secondName", "email", "phone", "weight"].includes(
            name
          ) && <span className="text-red-400">*</span>}
      </label>

      {isEditing ? (
        <>
          {type === "textarea" ? (
            <textarea
              name={name}
              value={formData[name] || ""}
              onChange={handleChange}
              className={`${inputClass(name)} h-24 resize-none`}
            />
          ) : (
            <input
              type={type}
              name={name}
              value={formData[name] || ""}
              onChange={handleChange}
              maxLength={
                name === "phone" || name === "homePhone" ? 11 : undefined
              }
              className={inputClass(name)}
            />
          )}
          {validationErrors[name] && (
            <div className="flex items-center mt-1 text-red-400 text-xs animate-pulse">
              <FaExclamationCircle className="mr-1" />
              {validationErrors[name]}
            </div>
          )}
        </>
      ) : (
        <p
          className={`text-lg ${settings.activeText} font-medium py-2 h-[46px] flex items-center border-b border-white/5`}
        >
          {formData[name] ? (
            formData[name]
          ) : (
            <span className="text-white/20 text-sm italic">Not set</span>
          )}
        </p>
      )}
    </div>
  );

  // --- Main Layout ---
  return (
    <div className={`flex h-screen w-screen ${settings.darkMode}`}>
      {/* 1. Sidebar Component */}
      <Sidebar />

      {/* 2. Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="p-8">
          <div className="max-w-5xl mx-auto mb-20">
            {/* Header & Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-white/10 pb-6 gap-4">
              <div>
                <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] mb-2">
                  Profile Settings
                </h1>
                <p
                  className={`${settings.emailText} text-base font-normal leading-normal mt-2`}
                >
                  Manage your personal information and security.
                </p>
              </div>

              <div className="flex gap-3 self-end md:self-auto">
                <button
                  onClick={handleEditToggle}
                  className={`px-6 py-2 rounded-full font-bold transition duration-200 border ${
                    isEditing
                      ? "border-red-500/50 text-red-400 hover:bg-red-500/10"
                      : `${settings.cardBorder} ${settings.activeText} ${settings.cardBg} hover:brightness-125`
                  }`}
                >
                  {isEditing ? "Cancel" : "Edit Profile"}
                </button>

                {isEditing && (
                  <button
                    onClick={handleSubmit}
                    className={`px-6 py-2 rounded-full font-bold transition duration-200 ${settings.timeFilterActiveBg} ${settings.activeText} hover:brightness-110 shadow-lg shadow-green-900/20`}
                  >
                    Save Changes
                  </button>
                )}
              </div>
            </div>

            {loading ? (
              <div className="animate-pulse text-white">Loading profile...</div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-12 gap-6"
              >
                {/* --- Profile Image --- */}
                <div className="md:col-span-12 flex justify-center md:justify-start mb-6">
                  <div className="relative group">
                    <div
                      className={`w-32 h-32 rounded-full overflow-hidden border-4 ${
                        isEditing
                          ? "border-green-500 cursor-pointer"
                          : "border-[#3b5445]"
                      } shadow-xl bg-[#1A2D22] flex items-center justify-center`}
                      onClick={() => isEditing && fileInputRef.current.click()}
                    >
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FaUser className="text-5xl text-[#3b5445]" />
                      )}

                      {/* Edit Overlay */}
                      {isEditing && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <FaCamera className="text-white text-2xl" />
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
                      <p className="text-center text-xs text-green-400 mt-2">
                        Tap to change
                      </p>
                    )}
                  </div>
                </div>

                {/* --- Personal Details --- */}
                <div className="md:col-span-12 mt-2">
                  <h3
                    className={`${settings.accentGreen} text-xl font-bold border-b ${settings.borderDark} pb-2 mb-4`}
                  >
                    Personal Details
                  </h3>
                </div>

                {renderField(
                  "First Name",
                  "firstName",
                  "text",
                  "md:col-span-3"
                )}
                {renderField(
                  "Second Name",
                  "secondName",
                  "text",
                  "md:col-span-3"
                )}
                {renderField(
                  "Third Name",
                  "thirdName",
                  "text",
                  "md:col-span-3"
                )}
                {renderField("Last Name", "lastName", "text", "md:col-span-3")}

                <div className="md:col-span-4">
                  <label className={labelClass}>Gender</label>
                  {isEditing ? (
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className={inputClass("gender")}
                    >
                      <option value={0}>Male</option>
                      <option value={1}>Female</option>
                    </select>
                  ) : (
                    <p
                      className={`text-lg ${settings.activeText} font-medium py-2 border-b border-white/5`}
                    >
                      {parseInt(formData.gender) === 0
                        ? "Male"
                        : parseInt(formData.gender) === 1
                        ? "Female"
                        : "Other"}
                    </p>
                  )}
                </div>

                {renderField(
                  "Date of Birth",
                  "dateOfBirth",
                  "date",
                  "md:col-span-4"
                )}
                {renderField(
                  "Weight (kg)",
                  "weight",
                  "number",
                  "md:col-span-4"
                )}

                {/* --- Contact Info --- */}
                <div className="md:col-span-12 mt-6">
                  <h3
                    className={`${settings.accentGreen} text-xl font-bold border-b ${settings.borderDark} pb-2 mb-4`}
                  >
                    Contact Info
                  </h3>
                </div>

                {renderField(
                  "Email Address",
                  "email",
                  "email",
                  "md:col-span-6"
                )}
                {renderField("Mobile Phone", "phone", "tel", "md:col-span-3")}
                {renderField("Home Phone", "homePhone", "tel", "md:col-span-3")}
                {renderField("Address", "address", "text", "md:col-span-12")}

                {/* --- Additional --- */}
                <div className="md:col-span-12 mt-6">
                  <h3
                    className={`${settings.accentGreen} text-xl font-bold border-b ${settings.borderDark} pb-2 mb-4`}
                  >
                    Additional
                  </h3>
                </div>

                {renderField(
                  "Medical Notes",
                  "notes",
                  "textarea",
                  "md:col-span-12"
                )}
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
