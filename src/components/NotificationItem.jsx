// src/components/NotificationItem.jsx
import React from "react";
// Assuming settings.js is available via props or direct import if needed,
// but we'll import it directly here for the theme classes
import settings from "../settings";

import { FaCheckCircle, FaTimes } from "react-icons/fa";

/**
 * Renders a single, stylized notification item.
 * * @param {object} props - Component props
 * @param {React.Component} props.icon - The Fa icon component (e.g., FaExclamationTriangle)
 * @param {string} props.iconBgColor - Tailwind background class for the icon circle
 * @param {string} props.iconTextColor - Tailwind text color class for the icon
 * @param {string} props.title - The main notification title
 * @param {string} props.subtitle - The detailed message
 * @param {string} props.timeText - The time or status text (e.g., '15 mins ago', 'Dismissed')
 * @param {boolean} props.isUnread - If true, displays the dismiss button and unread styling
 * @param {Array<object>} props.actions - Optional array of button objects ({text, className, handler})
 * @param {function} props.onDismiss - Handler for the dismiss button
 */
const NotificationItem = ({
  icon: IconComponent,
  iconBgColor,
  iconTextColor,
  title,
  subtitle,
  timeText,
  isUnread,
  actions = null,
  onDismiss = () => {},
}) => {
  // Determine styling based on read status using theme settings
  const cardClasses = isUnread
    ? `${settings.cardBg} border ${settings.cardBorder}`
    : `${settings.cardBg}/60 border border-transparent`;
  const titleClasses = isUnread ? settings.activeText : "text-white/70";
  const subtitleClasses = isUnread
    ? settings.emailText
    : `${settings.emailText}/70`;
  const timeClasses = isUnread ? "text-white/50" : "text-white/40";

  return (
    <div className={`flex items-start gap-4 p-4 rounded-xl ${cardClasses}`}>
      {/* Icon Area */}
      <div
        className={`flex size-10 items-center justify-center rounded-full ${iconBgColor} ${iconTextColor} shrink-0`}
      >
        {IconComponent && <IconComponent className="text-xl" />}
      </div>

      {/* Content Area */}
      <div className="flex-1">
        <p className={`font-bold ${titleClasses}`}>{title}</p>
        <p className={`${subtitleClasses} text-sm mt-1`}>{subtitle}</p>

        {/* Optional Actions */}
        {actions && (
          <div className="flex gap-2 mt-3">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={action.handler}
                className={action.className}
              >
                {action.text}
              </button>
            ))}
          </div>
        )}

        {/* Time/Status Text */}
        <p className={`${timeClasses} text-xs mt-2`}>{timeText}</p>
      </div>

      {/* Dismiss/Read State Indicator */}
      {isUnread ? (
        <button
          onClick={onDismiss}
          className="text-white/50 hover:text-white self-start"
        >
          <FaTimes className="text-base" />
        </button>
      ) : (
        <FaCheckCircle className="text-white/40 text-base" />
      )}
    </div>
  );
};

export default NotificationItem;
