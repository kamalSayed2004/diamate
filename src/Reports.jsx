import React from "react";
import settings from "./settings.js";
import Sidebar from "./components/SideBar.jsx";
import PageHeader from "./components/PageHeader.jsx";
import DataCard from "./components/DataCard.jsx";
import InsightsCard from "./components/InsightsCard.jsx";
import { FaDownload } from "react-icons/fa6"; // New Import for Export Button

const Reports = () => {
  return (
    <div className={`flex h-screen w-screen ${settings.darkMode}`}>
      {/* 1. Sidebar Component */}
      <Sidebar />

      {/* 2. Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="p-8">
          {/* Combined Header Area: PageHeader + Time Filters + Export Button */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Left Side: Title and Subtitle (handled by PageHeader) */}
            <PageHeader
              title="Reports"
              subtitle="Detailed summaries and analytics of your data."
            />

            {/* Right Side: Controls (Time Filters and Export) */}
            <div className="flex flex-1 justify-end gap-3 flex-wrap">
              {/* Time Filter Buttons (Reports-specific) */}
              <div className={`flex gap-1 ${settings.activeBg} p-1 rounded-lg`}>
                <button className="px-3 py-1 text-sm font-medium text-white/70 rounded-md hover:text-white">
                  Daily
                </button>
                <button
                  className={`px-3 py-1 text-sm font-medium ${settings.timeFilterActiveBg} ${settings.activeText} rounded-md`}
                >
                  Weekly
                </button>
                <button className="px-3 py-1 text-sm font-medium text-white/70 rounded-md hover:text-white">
                  Monthly
                </button>
              </div>

              {/* Export Button (Reports-specific) */}
              <button
                className={`flex min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 ${settings.activeBg} ${settings.activeText} text-sm font-bold leading-normal tracking-[0.015em] hover:${settings.timeFilterActiveBg}`}
              >
                {/* Replaced material-symbols-outlined with FaDownload */}
                <FaDownload className="text-base" />
                <span className="truncate">Export</span>
              </button>
            </div>
          </div>

          {/* Main Report Grid Content */}
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left Column (Charts) */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Large Card: Glucose Distribution */}
              <DataCard
                title="Glucose Distribution"
                imageSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuCE5jCgeyfURB4h_-OfM_5kfzM1rWwEaFJOuVB80qxdOZJwObxbPz6S5cc1TtBTow13wRilp3gmuL3kBmNhIaJNttP0dg3dPuHQ95TlUty8kOL2UJvuZCwDdpCxcouatjhKHuJJCIv8JNEHTLkfBB87rnietlsgOOW7TaSYxft7k15Z24UyRlXr-hM-PfdLLXFRuYEhHrAmsORzXbcVi1ha5ZhssUBy09l7pMCb2QiSAciXS0ZLqICBjcQRI8lb-YJEb3AY1Bw59fMh"
                imageAlt="A bar chart showing glucose distribution across different times of the day."
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Small Card 1: Food Log Summary */}
                <DataCard
                  title="Food Log Summary"
                  imageSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuDsx645Acmqm6MprO6p-t1v0l9-fmq3twjOktRtvRqFRlvdHph05a_qpUllJX2WqRHhCna7gQddOxHrF2n9VtHbvT5W_mvn4BrLfLa5FvwAsvBCSO9sQB9noJQv3nyMnKt8qyEPxbtF82fUmUN-VUwH4Kw9ADjSFU0ZYTJWP2N0zUsuX9UizykhUn2YgG2UrGstGKhng_d50mwwKkMQOOpn3MwkCGfyFAOyQ_adT4qr3qmrNg2pvc6KmAw3PDjUPaievqQfT4KZogPe"
                  imageAlt="A pie chart displaying the macronutrient breakdown."
                  heightClass="h-56"
                />

                {/* Small Card 2: Activity Breakdown */}
                <DataCard
                  title="Activity Breakdown"
                  imageSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuAM-ycCEvni823f7_DxSL-wVYF-kdWXMIcyOa-k05sN7Ssy8nMxTDlC45lLUaC6INBXsbRwt65ZfVovTeeqhyRE0srwTzSo3AdUiosPH2al4W1OcdDrb9vuro4jbYau3nBoJocRSGGNlzHwCZN_uN9rQRAqjad8bbQBv6U1g_e3JNA12Fcw__oLllE6JChMkLEt0Mj5sKTs7DwCKyuVEl9rWjnFnMnLXgBITn0AXsFH48ZZ_0E_LFGbanyz1LP8hjoVz_MXPaaIgD0_"
                  imageAlt="A donut chart illustrating the weekly activity breakdown."
                  heightClass="h-56"
                />
              </div>
            </div>

            {/* Right Column (AI Insights) */}
            <InsightsCard />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Reports;
