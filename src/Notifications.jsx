// src/pages/Notifications.jsx
import React from "react";
import settings from "./settings.js";
import Sidebar from "./components/SideBar.jsx";
import PageHeader from "./components/PageHeader.jsx";
import NotificationItem from "./components/NotificationItem.jsx";

// Import Fa icons used in the data structure
import {
  FaExclamationTriangle,
  FaMagic,
  FaPills,
  FaSyncAlt,
} from "react-icons/fa";

// --- Data Structure for Notifications ---
const notificationsData = [
  {
    group: "Today",
    items: [
      {
        id: "glucose-high",
        icon: FaExclamationTriangle,
        iconBgColor: "bg-red-500/20",
        iconTextColor: "text-red-400",
        title: "High Glucose Alert",
        subtitle:
          "Your glucose level is 185 mg/dL. Consider a short walk or drinking water.",
        timeText: "15 mins ago",
        isUnread: true,
      },
      {
        id: "ai-advice",
        icon: FaMagic,
        iconBgColor: `${settings.accentGreen}/20`,
        iconTextColor: settings.accentGreen,
        title: "AI Advice",
        subtitle:
          "Based on your recent activity, a snack with protein could help prevent a low later. How about some almonds?",
        timeText: "1 hour ago",
        isUnread: true,
      },
      {
        id: "med-reminder",
        icon: FaPills,
        iconBgColor: "bg-blue-500/20",
        iconTextColor: "text-blue-400",
        title: "Medication Reminder",
        subtitle: "Time to take your Metformin (500mg).",
        timeText: "",
        isUnread: true,
        actions: [
          {
            text: "Snooze",
            className: `text-sm font-medium px-3 py-1 rounded-md ${settings.activeBg} hover:${settings.cardBorder} ${settings.activeText}`,
            handler: () => console.log("Snooze clicked"),
          },
          {
            text: "Mark as Taken",
            className: `text-sm font-medium px-3 py-1 rounded-md ${settings.accentGreen} hover:${settings.accentGreen}/80 text-black`,
            handler: () => console.log("Mark as Taken clicked"),
          },
        ],
      },
    ],
  },
  {
    group: "Yesterday",
    items: [
      {
        id: "glucose-low",
        icon: FaExclamationTriangle,
        iconBgColor: "bg-yellow-500/20",
        iconTextColor: "text-yellow-400",
        title: "Low Glucose Alert",
        subtitle: "Your glucose level was 68 mg/dL.",
        timeText: "Dismissed",
        isUnread: false,
      },
      {
        id: "system-update",
        icon: FaSyncAlt,
        iconBgColor: "bg-purple-500/20",
        iconTextColor: "text-purple-400",
        title: "System Update",
        subtitle:
          "Your Diamate app has been updated with new reporting features.",
        timeText: "Dismissed",
        isUnread: false,
      },
    ],
  },
];

// --- Main Notifications Component ---
const Notifications = () => {
  const handleMarkAllRead = () => {
    console.log("Mark all as read clicked!");
  };

  const handleDismiss = (id, groupName) => {
    console.log(`Dismissing notification: ${id} from group: ${groupName}`);
  };

  return (
    // FIX: Using flex h-screen w-full ensures the container takes the full viewport height and initiates the flex layout.
    <div className={`flex h-screen w-full ${settings.darkMode}`}>
      {/* 1. Sidebar Component (Will stretch vertically due to parent flex h-screen) */}
      <Sidebar />

      {/* 2. Main Content Area */}
      {/* flex-1 ensures it takes the remaining width. overflow-y-auto ensures content scrolls */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {/* Page Header Component */}
          <PageHeader
            title="Notifications"
            subtitle="Your important alerts, reminders, and messages."
            buttonText="Mark all as read"
            onButtonClick={handleMarkAllRead}
          />

          {/* Notifications List Container */}
          <div className="mt-8 flex flex-col gap-6 max-w-4xl mx-auto">
            {/* Map through notification groups and render them directly */}
            {notificationsData.map((groupData) => (
              <div key={groupData.group}>
                {/* Group Title (Today/Yesterday) */}
                <h2
                  className={`${settings.emailText} text-sm font-bold uppercase tracking-wider mb-3`}
                >
                  {groupData.group}
                </h2>

                {/* Notification Items */}
                <div className="flex flex-col gap-3">
                  {/* Map through the items and render the imported NotificationItem */}
                  {groupData.items.map((item) => (
                    <NotificationItem
                      key={item.id}
                      {...item}
                      onDismiss={() => handleDismiss(item.id, groupData.group)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Notifications;
