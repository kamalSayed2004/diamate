// src/components/MealCard.jsx

import React from "react";
import settings from "../settings.js"; // Adjust path if needed
import { FaPlus } from "react-icons/fa"; // Import FaPlus

const MealCard = ({ title, description, imageUrl, altText }) => {
  // Utility classes for the button to use the accent color dynamically
  const accentBg20 = settings.accentGreen.replace("text-", "bg-") + "/20";
  const accentHoverBg30 =
    settings.accentGreen.replace("text-", "hover:bg-") + "/30";

  return (
    // Use activeBg with 60% opacity for the card background
    <div
      className={`flex flex-col gap-3 rounded-lg overflow-hidden ${settings.activeBg}/60`}
    >
      <div
        className="bg-center bg-no-repeat aspect-video bg-cover"
        data-alt={altText}
        style={{ backgroundImage: `url("${imageUrl}")` }}
      ></div>
      <div className="p-4 pt-0 flex flex-col flex-1">
        <h4 className="font-semibold text-white/90 leading-tight">{title}</h4>
        <p className={`text-white/60 text-sm mt-1 mb-4 flex-1`}>
          {description}
        </p>
        <button
          className={`w-full flex min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-md h-9 px-3 ${accentBg20} ${settings.accentGreen} text-sm font-bold leading-normal tracking-[0.015em] ${accentHoverBg30}`}
        >
          <FaPlus className="text-base" />
          <span className="truncate">Add to Log</span>
        </button>
      </div>
    </div>
  );
};

export default MealCard;
