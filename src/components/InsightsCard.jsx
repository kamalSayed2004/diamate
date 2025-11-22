import React from "react";
import settings from "../settings.js";
import { FaWandMagicSparkles } from "react-icons/fa6"; // New Import for AI Insight Icon

const InsightsCard = () => {
  const insights = [
    {
      title: "Glucose Trend Analysis",
      text: "Your average glucose this week was 135 mg/dL. We noticed a slight spike after breakfast on most days. Consider a lower-carb option in the mornings.",
    },
    {
      title: "Food & Glucose Correlation",
      text: "Your highest glucose levels correlate with meals high in carbohydrates. Your lunch on Wednesday was a great example of a balanced meal that kept you stable.",
    },
    {
      title: "Activity Impact",
      text: "Your evening walks have been effective in lowering your glucose levels before bedtime. Keep up the great work!",
    },
  ];

  return (
    <div className="lg:col-span-1 flex flex-col">
      <div
        className={`flex flex-col rounded-xl ${settings.cardBg} border ${settings.cardBorder} h-full`}
      >
        {/* Header */}
        <div className={`p-4 border-b ${settings.cardBorder}`}>
          <div className="flex items-center gap-2">
            {/* Replaced material-symbols-outlined with FaWandMagicSparkles */}
            <FaWandMagicSparkles
              className={`text-2xl ${settings.accentGreen}`}
            />
            <h3
              className={`${settings.activeText} text-base font-bold leading-normal`}
            >
              Diamate AI Insights
            </h3>
          </div>
        </div>

        {/* Insights List */}
        <div className="flex-1 flex flex-col p-4 space-y-4">
          <div className="flex flex-col gap-4 text-sm text-white/90">
            {insights.map((insight, index) => (
              <div
                key={index}
                className={`${settings.activeBg} rounded-lg p-3`}
              >
                <p className={`font-semibold mb-1 ${settings.accentGreen}`}>
                  {insight.title}
                </p>
                <p>{insight.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightsCard;
