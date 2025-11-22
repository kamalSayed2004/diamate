// src/components/ProgressItem.jsx

import React from "react";
import settings from "../settings.js"; // Adjust path if needed

const ProgressItem = ({ title, current, max, progressPercent }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-white/80">{title}</h3>
        <p className="text-sm font-medium text-white">
          {current}g / {max}g
        </p>
      </div>
      <div className="h-2 w-full rounded-full bg-white/10">
        <div
          // Use accentGreen for the progress bar background
          className={`h-2 rounded-full ${settings.accentGreen.replace(
            "text-",
            "bg-"
          )}`}
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressItem;
