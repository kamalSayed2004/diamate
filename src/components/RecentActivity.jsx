// src/components/RecentActivity.jsx
import React from "react";
import settings from "../settings";
import PropTypes from "prop-types";
// Imported Fa icons
import {
  FaRunning,
  FaWalking,
  FaDumbbell,
  FaMountain,
  FaSwimmer,
  FaSyncAlt,
} from "react-icons/fa";

// Helper component for an individual activity item
const ActivityItem = ({ icon: Icon, title, subtitle, time }) => {
  return (
    <div className="flex items-center gap-4">
      <div className="flex size-12 items-center justify-center rounded-lg bg-primary/20 shrink-0">
        {/* Render the icon component passed via prop */}
        <Icon className={`${settings.accentGreen} text-3xl`} />
      </div>
      <div className="flex-1">
        <p className={`${settings.activeText} font-medium`}>{title}</p>
        <p className={`text-sm ${settings.emailText}`}>{subtitle}</p>
      </div>
      <p className={`text-sm ${settings.emailText}`}>{time}</p>
    </div>
  );
};

ActivityItem.propTypes = {
  // PropTypes.elementType is used for React components (like FaRunning)
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
};

const RecentActivity = () => {
  return (
    <div className="lg:col-span-1 flex flex-col">
      <div
        className={`flex flex-col rounded-xl ${settings.cardBg} border ${settings.cardBorder} h-full`}
      >
        {/* Header */}
        <div className={`p-4 border-b ${settings.cardBorder}`}>
          <h3
            className={`${settings.activeText} text-base font-bold leading-normal`}
          >
            Recent Activities
          </h3>
        </div>

        {/* Activity List */}
        <div className="flex-1 flex flex-col p-4 space-y-4 overflow-y-auto">
          <ActivityItem
            icon={FaRunning}
            title="Morning Run"
            subtitle="3.2 miles · 30 min"
            time="8:15 AM"
          />
          <ActivityItem
            icon={FaWalking}
            title="Lunchtime Walk"
            subtitle="1.5 miles · 25 min"
            time="12:45 PM"
          />
          <ActivityItem
            icon={FaDumbbell}
            title="Gym Session"
            subtitle="Weightlifting · 45 min"
            time="Yesterday"
          />
          <ActivityItem
            icon={FaMountain}
            title="Weekend Hike"
            subtitle="5 miles · 2h 15m"
            time="Sat"
          />
          <ActivityItem
            icon={FaSwimmer}
            title="Swimming"
            subtitle="1,000 meters · 35 min"
            time="Fri"
          />
        </div>

        {/* Footer Button */}
        <div
          className={`p-4 border-t ${settings.cardBorder} flex items-center gap-4`}
        >
          <button
            className={`flex w-full items-center justify-center gap-2 h-10 rounded-lg ${settings.inactiveText} hover:${settings.activeBg} hover:${settings.activeText}`}
          >
            {/* Sync Icon */}
            <FaSyncAlt />
            <span>Sync with Tracker</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;
