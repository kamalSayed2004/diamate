// src/components/ActivityCards.jsx
import React from "react";
import settings from "../settings";
import { FaFire, FaClock, FaShoePrints } from "react-icons/fa"; // Imported Fa icons

const ActivityCards = () => {
  // Utility class for the metric cards' primary icon color
  const primaryIconClass = `${settings.accentGreen} text-3xl`;

  return (
    <div className="lg:col-span-2 flex flex-col gap-6">
      {/* Activity This Week Chart Card */}
      <div
        className={`rounded-xl p-6 ${settings.cardBg} border ${settings.cardBorder}`}
      >
        <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
          <h3 className={`${settings.activeText} text-lg font-bold`}>
            Activity This Week
          </h3>
          {/* Time Filter Buttons */}
          <div className={`flex gap-1 ${settings.activeBg} p-1 rounded-lg`}>
            <button
              className={`${settings.inactiveText} px-3 py-1 text-sm font-medium rounded-md hover:text-white`}
            >
              Day
            </button>
            {/* Active button uses timeFilterActiveBg and activeText */}
            <button
              className={`px-3 py-1 text-sm font-medium ${settings.timeFilterActiveBg} ${settings.activeText} rounded-md`}
            >
              Week
            </button>
            <button
              className={`${settings.inactiveText} px-3 py-1 text-sm font-medium rounded-md hover:text-white`}
            >
              Month
            </button>
          </div>
        </div>
        <div className="h-80 w-full flex items-center justify-center">
          <img
            alt="A bar chart showing daily activity levels for the current week, with bars for Monday through Sunday."
            className="h-full w-full object-contain"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8SiNYtEC2xBZpoGlnK7ihE5b6hZLc6eFzS-quWnj5P8Mtt_aLbKeIxbv53CyiqAoekDmhmB55QwGpKLLJFZQt9_LgBRMei65gsOVPNVPUkRUwp4Es5z6SPYW8usGph4DfJTqFI_m1jGTcoK_88-0xJ5zlLEgHbpEyVTeVQDjudon5-JO5oonJnCa0yuSt9oNPDEON2I0xkiUuYuqSJlkTpQ9vJGfBZCORgszPHxxzXFX6aA-gBn5N6hT0iyJUpIQBCGzbHkQLxfky"
          />
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. Calories Burned Card */}
        <div
          className={`flex flex-col gap-4 rounded-xl p-6 ${settings.cardBg} border ${settings.cardBorder}`}
        >
          <div className="flex items-center gap-3">
            <FaFire className={primaryIconClass} />
            <p
              className={`${settings.activeText} text-base font-medium leading-normal`}
            >
              Calories Burned
            </p>
          </div>
          <p
            className={`${settings.activeText} tracking-light text-5xl font-bold leading-tight`}
          >
            2,450
          </p>
          <p className={`${settings.emailText} text-sm font-normal`}>
            This week
          </p>
        </div>

        {/* 2. Active Minutes Card */}
        <div
          className={`flex flex-col gap-4 rounded-xl p-6 ${settings.cardBg} border ${settings.cardBorder}`}
        >
          <div className="flex items-center gap-3">
            <FaClock className={primaryIconClass} />
            <p
              className={`${settings.activeText} text-base font-medium leading-normal`}
            >
              Active Minutes
            </p>
          </div>
          <p
            className={`${settings.activeText} tracking-light text-5xl font-bold leading-tight`}
          >
            3h 15m
          </p>
          <p className={`${settings.emailText} text-sm font-normal`}>
            This week
          </p>
        </div>

        {/* 3. Total Steps Card */}
        <div
          className={`flex flex-col gap-4 rounded-xl p-6 ${settings.cardBg} border ${settings.cardBorder}`}
        >
          <div className="flex items-center gap-3">
            <FaShoePrints className={primaryIconClass} />
            <p
              className={`${settings.activeText} text-base font-medium leading-normal`}
            >
              Total Steps
            </p>
          </div>
          <p
            className={`${settings.activeText} tracking-light text-5xl font-bold leading-tight`}
          >
            45,678
          </p>
          <p className={`${settings.emailText} text-sm font-normal`}>
            This week
          </p>
        </div>
      </div>
    </div>
  );
};

export default ActivityCards;
