import React from "react";
import settings from "./settings.js";
import Sidebar from "./components/SideBar";
// FIX: Correctly import the reusable component named PageHeader
import PageHeader from "./components/PageHeader";
import GlucoseCards from "./components/GlucoseCards";
import ChatAi from "./components/ChatAi";

const App = () => {
  // Define the function for the button action
  const handleNewLog = () => {
    console.log("New Log button clicked!");
  };

  return (
    <div className={`flex h-screen w-screen ${settings.darkMode}`}>
      {/* 1. Sidebar Component */}
      <Sidebar />

      {/* 2. Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {/* Header Section - Use PageHeader with props */}
          <PageHeader
            title="Home"
            subtitle="Your glucose overview and AI assistant."
            buttonText="New Log"
            onButtonClick={handleNewLog}
          />

          {/* Main Grid Layout */}
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left Column (Glucose Data) */}
            <GlucoseCards />

            {/* Right Column (AI Chat) */}
            <ChatAi />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
