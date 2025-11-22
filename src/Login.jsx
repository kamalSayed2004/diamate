import React, { useState } from "react";
import {
  FaLock,
  FaMailBulk,
  FaGoogle,
  FaRegSun,
  FaRegMoon,
  FaEye, // For showing password
  FaEyeSlash, // For hiding password
} from "react-icons/fa";
import { FaGlassWaterDroplet } from "react-icons/fa6";
import settings from "./settings"; // <--- Correctly imported settings
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState("dark");
  const isLight = theme === "light";

  // State for inputs
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Toggle handlers
  const toggleTheme = () => {
    setTheme(isLight ? "dark" : "light");
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const Payload = {
      userName: userName,
      password: password,
    };
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Payload),
    };
    try {
      const response = await fetch(
        `${settings.API_BASE_URL}/Account/LogIn`,
        options
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Login Successful:", result);
        let decoded = jwtDecode(result.token);
        let patientId = Number(decoded.PatientId);
        localStorage.setItem("DiamateToken", result.token);
        localStorage.setItem("DiamateTokenId", patientId);
        navigate("/app");
      } else {
        let errorMessage = `Login failed with status: ${response.status}`;
        try {
          // Attempt to parse JSON error message from the body
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (jsonError) {
          // Fallback for non-JSON or empty error body
          errorMessage = `Login failed. Server returned an unhandled error: ${response.statusText} and json is ${jsonError}`;
        }

        console.error("Login Failed:", errorMessage);
      }
    } catch (error) {
      console.error("Network Error during login:", error);
    }
  };

  const handleGoogleSignIn = () => {
    console.log("Navigating to Google Sign-In...");
    // Add your Google Sign-In logic here
  };

  // Conditional Classes based on theme
  const mainBg = isLight ? "bg-gray-50" : settings.darkMode;
  const boxBg = isLight ? "bg-white" : settings.bg_dark_blue;
  const titleColor = isLight ? "text-gray-900" : settings.text_white;
  const descriptionColor = isLight ? "text-gray-500" : settings.text_gray;
  const inputBg = isLight ? "bg-gray-100" : "bg-gray-800/50";
  const labelColor = isLight ? "text-gray-700" : settings.text_gray;
  const inputTextColor = isLight ? "text-gray-900" : settings.text_white;
  const placeholderColor = isLight
    ? "placeholder-gray-400"
    : "placeholder-gray-500";
  const iconColor = isLight ? "text-gray-500" : settings.text_gray;
  const separatorBorder = isLight ? "border-gray-300" : "border-gray-700";

  return (
    <div
      className={`relative flex flex-col items-center justify-center min-h-screen w-screen p-4 ${mainBg}`}
    >
      {/* --- Theme Toggle Button --- */}
      <button
        onClick={toggleTheme}
        className={`absolute top-4 right-4 p-3 rounded-full transition-colors 
        ${
          isLight
            ? "text-gray-700 hover:bg-gray-200"
            : `${settings.text_green} hover:bg-gray-800/50`
        }`}
        aria-label="Toggle theme"
      >
        {isLight ? (
          <FaRegMoon className="text-xl" />
        ) : (
          <FaRegSun className="text-xl" />
        )}
      </button>

      {/* --- Logo/Title Section --- */}
      <div className="flex items-center space-x-3 mb-2">
        <FaGlassWaterDroplet className={`text-3xl ${settings.text_green}`} />
        <h1 className={`text-4xl font-extrabold tracking-wider ${titleColor}`}>
          Diamate
        </h1>
      </div>

      <p className={`mt-2 mb-10 text-center text-lg ${descriptionColor}`}>
        Welcome back! Please sign in to your account.
      </p>

      {/* --- Login Form Box --- */}
      <div
        className={`box p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-sm md:max-w-md 
        ${boxBg} transition-all duration-500 hover:shadow-green-500/30 ${
          isLight ? "shadow-lg" : ""
        }`}
      >
        <form className={`flex flex-col space-y-5`} onSubmit={handleSubmit}>
          {/* userName Input Group */}
          <div>
            <label
              htmlFor="userNameInput"
              className={`block mb-2 text-sm font-medium ${labelColor}`}
            >
              User Name
            </label>
            <div
              className={`flex items-center p-3 space-x-3 border-2 border-transparent ${inputBg} 
              focus-within:border-2 ${settings.border_green} rounded-xl transition duration-300`}
            >
              <FaMailBulk className={`${iconColor}`} />
              <input
                id="userNameInput"
                type="string"
                placeholder="Enter your User Name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
                className={`focus:outline-none ${placeholderColor} ${inputTextColor} bg-transparent w-full text-base`}
              />
            </div>
          </div>

          {/* Password Input Group with Toggle */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label
                htmlFor="passwordInput"
                className={`text-sm font-medium ${labelColor}`}
              >
                Password
              </label>
              <button
                type="button"
                className={`text-sm font-medium transition-colors hover:underline ${settings.text_green}`}
              >
                Forgot Password?
              </button>
            </div>
            <div
              className={`flex items-center p-3 space-x-3 border-2 border-transparent ${inputBg} 
              focus-within:border-2 ${settings.border_green} rounded-xl transition duration-300`}
            >
              <FaLock className={`${iconColor}`} />
              <input
                id="passwordInput"
                type={showPassword ? "text" : "password"} // Dynamic type
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`focus:outline-none ${placeholderColor} ${inputTextColor} bg-transparent w-full text-base`}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="p-1 -mr-2 text-xl hover:opacity-75 transition-opacity"
              >
                {showPassword ? (
                  <FaEyeSlash className={`${iconColor}`} />
                ) : (
                  <FaEye className={`${iconColor}`} />
                )}
              </button>
            </div>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className={`w-full p-3 rounded-xl text-lg font-bold mt-6 
            transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99]
            ${settings.bg_green} ${settings.text_white} hover:bg-green-600 shadow-lg shadow-green-500/50`}
          >
            Sign In
          </button>

          {/* Separator and Social Login */}
          <div className="flex items-center space-x-2 my-4">
            <hr className={`grow border-t ${separatorBorder}`} />
            <p className={`text-sm font-medium ${descriptionColor}`}>
              Or continue with
            </p>
            <hr className={`grow border-t ${separatorBorder}`} />
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className={`w-full p-3 rounded-xl text-lg font-bold flex items-center justify-center space-x-2 
            border-2 ${
              isLight
                ? "border-gray-300 hover:border-gray-500 text-gray-700 hover:bg-gray-100"
                : "border-gray-700 hover:border-blue-500 text-white hover:bg-gray-800/70"
            }
            transition duration-300`}
          >
            <FaGoogle className="text-xl text-blue-500" />
            <span>Sign In with Google</span>
          </button>
        </form>
      </div>

      {/* Sign Up Link */}
      <p className={`mt-6 text-sm ${descriptionColor}`}>
        Don't have an account?
        <button
          className={`ml-1 font-bold transition-colors hover:underline ${settings.text_green}`}
          onClick={() => {
            navigate("/registration");
          }}
        >
          Sign Up
        </button>
      </p>
    </div>
  );
};

export default Login;
