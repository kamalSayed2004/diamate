import React, { useState } from "react";
// there are useRef
import {
  FaUser,
  FaMailBulk,
  FaLock,
  FaPhone,
  FaGoogle,
  FaRegSun,
  FaRegMoon,
  FaCalendarAlt,
  FaVenusMars,
  FaEye,
  FaEyeSlash,
  FaCamera,
} from "react-icons/fa";
import { FaGlassWaterDroplet } from "react-icons/fa6";
import settings from "./settings";
import { useNavigate } from "react-router-dom";

const ValidationError = ({ message, isLight }) => {
  if (!message) return null;
  const textColor = isLight ? "text-red-600" : "text-red-400";
  return <p className={`text-xs mt-1 font-medium ${textColor}`}>{message}</p>;
};

const Registration = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState("dark");
  const isLight = theme === "light";
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [profileImageBase64, setProfileImageBase64] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    UserName: "",
    Password: "",
    FirstName: "",
    SecondName: "",
    ThirdName: "",
    LastName: "",
    DateOfBirth: "2000-01-01",
    Gender: 0,
    Address: "Unknown",
    Phone: "",
    HomePhone: "",
    Email: "",
    Weight: 75,
    Notes: "",
  });

  const validateField = (name, value) => {
    let error = "";
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{11}$/;
    const nameRegex = /^[A-Za-z\s]{2,}$/;

    switch (name) {
      case "FirstName":
      case "SecondName":
        if (!value.trim()) {
          error = "This field is required.";
        } else if (!nameRegex.test(value.trim())) {
          error =
            "Must contain at least 2 letters and no special characters or numbers.";
        }
        break;
      case "UserName":
        if (value.length < 4) {
          error = "Username must be at least 4 characters long.";
        }
        break;
      case "Email":
        if (!emailRegex.test(value)) {
          error = "Please enter a valid email address.";
        }
        break;
      case "Phone":
        if (!phoneRegex.test(value)) {
          error = "Phone number must be exactly 11 digits.";
        }
        break;
      case "Password":
        if (!passwordRegex.test(value)) {
          error =
            "Password must be at least 8 characters, include 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (@$!%*?&).";
        }
        break;
      case "DateOfBirth":
        if (new Date(value) >= new Date()) {
          error = "Date of Birth cannot be today or a future date.";
        }
        break;
      case "Weight":
        if (value < 30 || value > 300) {
          error = "Weight must be between 30 kg and 300 kg.";
        }
        break;
      default:
        break;
    }

    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
    return error === "";
  };

  const validateForm = () => {
    let isValid = true;
    const requiredFields = [
      "FirstName",
      "SecondName",
      "UserName",
      "Email",
      "Phone",
      "Password",
      "DateOfBirth",
      "Weight",
    ];

    for (const name of requiredFields) {
      if (!validateField(name, formData[name])) {
        isValid = false;
      }
    }
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const finalValue =
      name === "Weight" || name === "Gender" ? Number(value) : value;

    setFormData({ ...formData, [name]: finalValue });
    validateField(name, finalValue);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        const base64Data = reader.result.split(",")[1];
        setProfileImageBase64(base64Data);
      };
      reader.readAsDataURL(file);
    } else {
      setProfileImageBase64("");
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert("Please fix the validation errors before submitting.");
      return;
    }

    const apiPayload = {
      userName: formData.UserName,
      password: formData.Password,
      firstName: formData.FirstName,
      secondName: formData.SecondName,
      thirdName: formData.ThirdName || null,
      lastName: formData.LastName || null,
      dateOfBirth: new Date(formData.DateOfBirth).toISOString(),
      gender: formData.Gender,
      address: formData.Address || null,
      phone: formData.Phone,
      homePhone: formData.HomePhone || null,
      email: formData.Email,
      weight: formData.Weight,
      notes: formData.Notes || null,
      profileImage: profileImageBase64 || null,
    };

    const registrationEndpoint = `${settings.API_BASE_URL}/Account/RegisterNewUser`;

    try {
      const response = await fetch(registrationEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiPayload),
      });

      if (response.ok) {
        navigate("/login");
      } else {
        alert(`Registration failed: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Registration Network Error:", error);
      alert("A network error occurred. Could not reach the server.");
    }
  };

  const handleGoogleSignIn = () => {
    console.log("Navigating to Google Sign-Up...");
  };

  const toggleTheme = () => {
    setTheme(isLight ? "dark" : "light");
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShow) => !prevShow);
  };

  // Conditional Classes
  const mainBg = isLight ? "bg-gray-50" : settings.darkMode;
  const boxBg = isLight ? "bg-white" : settings.cardBg;
  const titleColor = isLight ? "text-gray-900" : settings.activeText;
  const descriptionColor = isLight ? "text-gray-500" : settings.inactiveText;
  const inputBg = isLight ? "bg-gray-100" : settings.sidebarBg;
  const labelColor = isLight ? "text-gray-700" : settings.inactiveText;
  const inputTextColor = isLight ? "text-gray-900" : settings.activeText;
  const placeholderColor = isLight
    ? "placeholder-gray-400"
    : "placeholder-white/50";
  const iconColor = isLight ? "text-gray-500" : settings.accentGreen;
  const separatorBorder = isLight ? "border-gray-300" : settings.cardBorder;
  const enhancedSelectBg = isLight ? "bg-white" : settings.sidebarBg;
  const enhancedSelectBorder = isLight
    ? "border-gray-300"
    : settings.cardBorder;

  const getInputBorderClass = (fieldName) => {
    const error = validationErrors[fieldName];
    if (error) {
      return "border-red-500 focus-within:border-red-500";
    }
    return `border-transparent focus-within:border-2 ${settings.border_green}`;
  };

  return (
    <div
      className={`relative flex flex-col items-center justify-center min-h-screen w-screen p-4 ${mainBg}`}
    >
      {/* ... (Theme Toggle Button) ... */}
      <button
        onClick={toggleTheme}
        className={`absolute top-4 right-4 p-3 rounded-full transition-colors 
        ${
          isLight
            ? "text-gray-700 hover:bg-gray-200"
            : `${settings.accentGreen} hover:bg-white/10`
        }`}
        aria-label="Toggle theme"
      >
        {isLight ? (
          <FaRegMoon className="text-xl" />
        ) : (
          <FaRegSun className="text-xl" />
        )}
      </button>

      {/* ... (Header: Diamate) ... */}
      <div className="flex items-center space-x-3 mb-2">
        <FaGlassWaterDroplet className={`text-3xl ${settings.accentGreen}`} />
        <h1 className={`text-4xl font-extrabold tracking-wider ${titleColor}`}>
          Diamate
        </h1>
      </div>

      <p className={`mt-2 mb-8 text-center text-lg ${descriptionColor}`}>
        Join the community! Create your new account.
      </p>

      {/* ... (Form Box) ... */}
      <div
        className={`box p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-sm md:max-w-md 
        ${boxBg} transition-all duration-500 hover:shadow-lg hover:shadow-green-500/30 ${
          isLight ? "shadow-lg" : "shadow-black/50"
        }`}
      >
        <form className={`flex flex-col space-y-5`} onSubmit={handleSubmit}>
          {/* ... (Profile Image Upload) ... */}
          <div className="flex flex-col items-center mb-4">
            <label
              htmlFor="profileImageInput"
              className={`relative w-28 h-28 rounded-full cursor-pointer 
                          border-2 ${getInputBorderClass("profileImage")}
                          ${inputBg} 
                          flex items-center justify-center overflow-hidden
                          group transition-all`}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <FaUser className={`text-5xl ${iconColor}`} />
              )}
              <div
                className="absolute inset-0 bg-black/50 flex items-center 
                             justify-center opacity-0 group-hover:opacity-100 
                             transition-opacity"
              >
                <FaCamera className="text-white text-3xl" />
              </div>
            </label>
            <input
              id="profileImageInput"
              name="profileImage"
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              onChange={handleImageChange}
              className="hidden"
            />
            <p className={`mt-2 text-sm ${labelColor}`}>
              Add a profile picture (Optional)
            </p>
          </div>

          {/* ... (First Name & Second Name) ... */}
          <div className="flex justify-between gap-4">
            <div className="flex-1">
              <label
                htmlFor="firstNameInput"
                className={`block mb-2 text-sm font-medium ${labelColor}`}
              >
                First Name <span className="text-red-500">*</span>
              </label>
              <div
                className={`flex items-center p-3 space-x-3 border-2 ${inputBg} 
                ${getInputBorderClass(
                  "FirstName"
                )} rounded-xl transition duration-300`}
              >
                <FaUser className={`${iconColor}`} />
                <input
                  id="firstNameInput"
                  name="FirstName"
                  type="text"
                  value={formData.FirstName}
                  onChange={handleChange}
                  required
                  className={`focus:outline-none ${placeholderColor} ${inputTextColor} bg-transparent w-full text-base`}
                />
              </div>
              <ValidationError
                message={validationErrors.FirstName}
                isLight={isLight}
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="secondNameInput"
                className={`block mb-2 text-sm font-medium ${labelColor}`}
              >
                Second Name <span className="text-red-500">*</span>
              </label>
              <div
                className={`flex items-center p-3 space-x-3 border-2 ${inputBg} 
                ${getInputBorderClass(
                  "SecondName"
                )} rounded-xl transition duration-300`}
              >
                <FaUser className={`${iconColor}`} />
                <input
                  id="secondNameInput"
                  name="SecondName"
                  type="text"
                  value={formData.SecondName}
                  onChange={handleChange}
                  required
                  className={`focus:outline-none ${placeholderColor} ${inputTextColor} bg-transparent w-full text-base`}
                />
              </div>
              <ValidationError
                message={validationErrors.SecondName}
                isLight={isLight}
              />
            </div>
          </div>

          {/* ... (Third Name & Last Name) ... */}
          <div className="flex justify-between gap-4">
            <div className="flex-1">
              <label
                htmlFor="thirdNameInput"
                className={`block mb-2 text-sm font-medium ${labelColor}`}
              >
                Third Name (Optional)
              </label>
              <div
                className={`flex items-center p-3 space-x-3 border-2 border-transparent ${inputBg} 
                focus-within:border-2 ${settings.border_green} rounded-xl transition duration-300`}
              >
                <FaUser className={`${iconColor}`} />
                <input
                  id="thirdNameInput"
                  name="ThirdName"
                  type="text"
                  value={formData.ThirdName}
                  onChange={handleChange}
                  className={`focus:outline-none ${placeholderColor} ${inputTextColor} bg-transparent w-full text-base`}
                />
              </div>
            </div>
            <div className="flex-1">
              <label
                htmlFor="lastNameInput"
                className={`block mb-2 text-sm font-medium ${labelColor}`}
              >
                Last Name (Optional)
              </label>
              <div
                className={`flex items-center p-3 space-x-3 border-2 border-transparent ${inputBg} 
                focus-within:border-2 ${settings.border_green} rounded-xl transition duration-300`}
              >
                <FaUser className={`${iconColor}`} />
                <input
                  id="lastNameInput"
                  name="LastName"
                  type="text"
                  placeholder=""
                  value={formData.LastName}
                  onChange={handleChange}
                  className={`focus:outline-none ${placeholderColor} ${inputTextColor} bg-transparent w-full text-base`}
                />
              </div>
            </div>
          </div>

          {/* ... (User Name) ... */}
          <div>
            <label
              htmlFor="userNameInput"
              className={`block mb-2 text-sm font-medium ${labelColor}`}
            >
              User Name <span className="text-red-500">*</span>
            </label>
            <div
              className={`flex items-center p-3 space-x-3 border-2 ${inputBg} 
              ${getInputBorderClass(
                "UserName"
              )} rounded-xl transition duration-300`}
            >
              <FaUser className={`${iconColor}`} />
              <input
                id="userNameInput"
                name="UserName"
                type="text"
                placeholder="mohamed2004"
                value={formData.UserName}
                onChange={handleChange}
                required
                className={`focus:outline-none ${placeholderColor} ${inputTextColor} bg-transparent w-full text-base`}
              />
            </div>
            <ValidationError
              message={validationErrors.UserName}
              isLight={isLight}
            />
          </div>

          {/* ... (Email) ... */}
          <div>
            <label
              htmlFor="emailInput"
              className={`block mb-2 text-sm font-medium ${labelColor}`}
            >
              Email Address <span className="text-red-500">*</span>
            </label>
            <div
              className={`flex items-center p-3 space-x-3 border-2 ${inputBg} 
              ${getInputBorderClass(
                "Email"
              )} rounded-xl transition duration-300`}
            >
              <FaMailBulk className={`${iconColor}`} />
              <input
                id="emailInput"
                name="Email"
                type="email"
                placeholder="example@gamil.com"
                value={formData.Email}
                onChange={handleChange}
                required
                className={`focus:outline-none ${placeholderColor} ${inputTextColor} bg-transparent w-full text-base`}
              />
            </div>
            <ValidationError
              message={validationErrors.Email}
              isLight={isLight}
            />
          </div>

          {/* ... (Phone) ... */}
          <div>
            <label
              htmlFor="phoneInput"
              className={`block mb-2 text-sm font-medium ${labelColor}`}
            >
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div
              className={`flex items-center p-3 space-x-3 border-2 ${inputBg} 
              ${getInputBorderClass(
                "Phone"
              )} rounded-xl transition duration-300`}
            >
              <FaPhone className={`${iconColor}`} />
              <input
                id="phoneInput"
                name="Phone"
                type="tel"
                maxLength={11}
                placeholder="01234567890"
                value={formData.Phone}
                onChange={handleChange}
                required
                className={`focus:outline-none ${placeholderColor} ${inputTextColor} bg-transparent w-full text-base`}
              />
            </div>
            <ValidationError
              message={validationErrors.Phone}
              isLight={isLight}
            />
          </div>

          {/* ... (Date of Birth) ... */}
          <div>
            <label
              htmlFor="dobInput"
              className={`block mb-2 text-sm font-medium ${labelColor}`}
            >
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <div
              className={`flex items-center p-3 space-x-3 border-2 ${inputBg} 
              ${getInputBorderClass(
                "DateOfBirth"
              )} rounded-xl transition duration-300`}
            >
              <FaCalendarAlt className={`${iconColor}`} />
              <input
                id="dobInput"
                name="DateOfBirth"
                type="date"
                value={formData.DateOfBirth}
                onChange={handleChange}
                required
                className={`focus:outline-none ${placeholderColor} ${inputTextColor} ${enhancedSelectBg} 
                  border-none rounded-lg w-full text-base`}
              />
            </div>
            <ValidationError
              message={validationErrors.DateOfBirth}
              isLight={isLight}
            />
          </div>

          {/* ... (Gender & Weight) ... */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1">
              <label
                htmlFor="genderInput"
                className={`block mb-2 text-sm font-medium ${labelColor}`}
              >
                Gender <span className="text-red-500">*</span>
              </label>
              <div
                className={`flex items-center p-3 space-x-3 border-2 border-transparent ${inputBg} 
              focus-within:border-2 ${settings.border_green} rounded-xl transition duration-300`}
              >
                <FaVenusMars className={`${iconColor}`} />
                <select
                  id="genderInput"
                  name="Gender"
                  value={formData.Gender}
                  onChange={handleChange}
                  required
                  className={`focus:outline-none ${placeholderColor} ${inputTextColor} ${enhancedSelectBg} w-full text-base 
                  py-0 px-0 appearance-none cursor-pointer border-none rounded-lg`}
                >
                  <option value={0}>Male</option>
                  <option value={1}>Female</option>
                </select>
              </div>
            </div>
            <div>
              <label
                htmlFor="weightInput"
                className={`block mb-2 text-sm font-medium ${labelColor}`}
              >
                Weight (kg) <span className="text-red-500">*</span>
              </label>
              <div
                className={`flex items-center p-3 space-x-3 border-2 ${inputBg} 
                ${getInputBorderClass(
                  "Weight"
                )} rounded-xl transition duration-3D`}
              >
                <FaGlassWaterDroplet className={`${iconColor}`} />
                <input
                  id="weightInput"
                  name="Weight"
                  type="number"
                  placeholder="e.g., 75"
                  value={formData.Weight}
                  onChange={handleChange}
                  required
                  min="30"
                  max="300"
                  step="0.1"
                  className={`focus:outline-none ${placeholderColor} ${inputTextColor} bg-transparent w-full text-base`}
                />
              </div>
              <ValidationError
                message={validationErrors.Weight}
                isLight={isLight}
              />
            </div>
          </div>

          {/* ... (Password) ... */}
          <div>
            <label
              htmlFor="passwordInput"
              className={`block mb-2 text-sm font-medium ${labelColor}`}
            >
              Password <span className="text-red-500">*</span>
            </label>
            <div
              className={`flex items-center p-3 space-x-3 border-2 ${inputBg} 
              ${getInputBorderClass(
                "Password"
              )} rounded-xl transition duration-300`}
            >
              <FaLock className={`${iconColor}`} />
              <input
                id="passwordInput"
                name="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                value={formData.Password}
                onChange={handleChange}
                required
                className={`focus:outline-none ${placeholderColor} ${inputTextColor} bg-transparent w-full text-base`}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="p-1 -mr-2 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <FaEyeSlash className={`text-xl ${iconColor}`} />
                ) : (
                  <FaEye className={`text-xl ${iconColor}`} />
                )}
              </button>
            </div>
            <ValidationError
              message={validationErrors.Password}
              isLight={isLight}
            />
          </div>

          {/* ... (Submit Button) ... */}
          <button
            type="submit"
            className={`w-full p-3 rounded-xl text-lg font-bold mt-6 
            transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99]
            ${settings.bg_green} ${settings.text_white} hover:bg-green-600 shadow-lg shadow-green-500/50`}
          >
            Create Account
          </button>

          {/* ... (Separator) ... */}
          <div className="flex items-center space-x-2 my-4">
            <hr className={`grow border-t ${separatorBorder}`} />
            <p className={`text-sm font-medium ${descriptionColor}`}>
              Or sign up with
            </p>
            <hr className={`grow border-t ${separatorBorder}`} />
          </div>

          {/* ... (Google Sign Up Button) ... */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className={`w-full p-3 rounded-xl text-lg font-bold flex items-center justify-center space-x-2 
            border-2 ${
              isLight
                ? "border-gray-300 hover:border-gray-500 text-gray-700 hover:bg-gray-100"
                : `${enhancedSelectBorder} hover:border-blue-500 ${settings.activeText} hover:bg-white/10`
            }
            transition duration-300`}
          >
            <FaGoogle className="text-xl text-blue-500" />
            <span>Sign Up with Google</span>
          </button>
        </form>
      </div>

      {/* ... (Login Link) ... */}
      <p className={`mt-6 text-sm ${descriptionColor}`}>
        Already have an account?
        <button
          className={`ml-1 font-bold transition-colors hover:underline ${settings.accentGreen}`}
          onClick={() => {
            navigate("/login");
          }}
        >
          Sign In
        </button>
      </p>
    </div>
  );
};

export default Registration;
