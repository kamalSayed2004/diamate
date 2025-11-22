// src/Activity.jsx
import React from "react";
import settings from "./settings.js";
import Sidebar from "./components/SideBar.jsx"; // Assuming Sidebar exists
import PageHeader from "./components/PageHeader.jsx"; // Assuming PageHeader exists
import ActivityCards from "./components/ActivityCards.jsx"; // New component
import RecentActivity from "./components/RecentActivity.jsx"; // New component

const Activity = () => {
  // Handler for the "Log Activity" button click
  const handleLogActivityClick = () => {
    alert("Log Activity button clicked!");
    // In a real app, this would open a modal or navigate to a logging form
  };

  return (
    <div className={`flex h-screen w-screen ${settings.darkMode}`}>
      {/* 1. Sidebar Component */}
      <Sidebar />

      {/* 2. Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {/* Header Section */}
          <PageHeader
            title="Activity"
            subtitle="Your exercise and movement logs."
            buttonText="New Log Activity"
            onButtonClick={handleLogActivityClick}
          />

          {/* Activity Dashboard Content */}
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left/Middle Section (Activity Chart and Metrics) */}
            <ActivityCards />

            {/* Right Section (Recent Activities) */}
            <RecentActivity />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Activity;
