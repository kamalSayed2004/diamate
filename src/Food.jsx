// src/Food.jsx

import React from "react";
import settings from "./settings.js";
import Sidebar from "./components/SideBar.jsx";
// Import the new components
import ProgressItem from "./components/ProgressItem.jsx";
import MealCard from "./components/MealCard.jsx";
// Import Font Awesome icons for the main content area
import { FaSearch, FaRobot } from "react-icons/fa";
// Import the reusable PageHeader
import PageHeader from "./components/PageHeader.jsx";

const Food = () => {
  const mainContentClasses = `${settings.darkMode} font-display`;

  return (
    // 1. Parent: Use h-screen (as in App.jsx) to fix container height to viewport
    <div className={`relative flex h-screen w-full ${mainContentClasses}`}>
      {/* 2. Sidebar Component: Now a direct child. It must have 'h-full' *inside* its definition. */}
      {/* We are removing the unnecessary 'div' wrapper with h-screen, as seen in App.jsx */}
      <Sidebar />

      {/* 3. Main Content Area: flex-1 ensures it fills space, overflow-y-auto makes it scrollable */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {/* Header - NOW USING REUSABLE PAGE HEADER */}
          <PageHeader
            title="Food Log"
            subtitle="Log & View Meals"
            // Button props (buttonText and onButtonClick) are omitted for this page.
          />

          <div className="mt-8 flex flex-col gap-8">
            {/* Macro Status Card - using ProgressItem component */}
            <div
              className={`grid grid-cols-1 gap-6 rounded-xl border ${settings.cardBorder} ${settings.cardBg} p-6 lg:grid-cols-3`}
            >
              <ProgressItem
                title="Carbs"
                current={120}
                max={150}
                progressPercent={80}
              />
              <ProgressItem
                title="Protein"
                current={40}
                max={60}
                progressPercent={66.66}
              />
              <ProgressItem
                title="Fats"
                current={30}
                max={50}
                progressPercent={60}
              />
            </div>

            {/* Search Bar */}
            <div
              className={`flex items-center gap-3 p-3 rounded-lg ${settings.cardBg} border ${settings.cardBorder}`}
            >
              <FaSearch className={`text-xl ${settings.accentGreen}`} />
              <input
                className="w-full bg-transparent text-white placeholder-white/50 focus:outline-none focus:ring-0 text-sm"
                placeholder="Search for food like 'Apple' or 'Chicken Salad'"
                type="text"
              />
            </div>

            {/* Meal Ideas Section */}
            <div
              className={`${settings.cardBg} border ${settings.cardBorder} rounded-xl p-6`}
            >
              <div className="flex items-center gap-2 mb-4">
                <FaRobot className={`text-2xl ${settings.accentGreen}`} />
                <h3 className="text-white text-base font-bold leading-normal">
                  Meal ideas for you
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {/* Meal Cards - using MealCard component */}
                <MealCard
                  title="Grilled Salmon & Asparagus"
                  description="Lean protein and fiber to help stabilize glucose levels."
                  imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuC7NQ6HO_5AkimskWhxU2sqwmOKFZ3GVaY2OBgxnR1St0geHUztIy0w7Z0xBAUIV-wRG6aM_GAAq6nXDLU4_tfHcJL_CFnMBefjESkeWSZw84Cd6N1DFucGh8QZ0_IYStzGxGYvJUDL7viQW-I42MHU7tWcV_3qS3xikGMMJ3h4slpTUAZCzuFBYszboDENZPaSo6KtwXfQanuXLLwNlRNuQECd3SElzAbLeNyKj3C2zSVSebOHlzDklYvyIqjhRfPwpvIRnG7N_c9b"
                  altText="Grilled Salmon with Asparagus"
                />
                <MealCard
                  title="Quinoa Salad with Chickpeas"
                  description="A complex carb and plant-based protein powerhouse."
                  imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuAhY_2b0mPWhJR3wsaGPdjCV-rUUfxtxEoEHwzpBprd8w847DdOODYn0yO4RnUZ2JVSod3a5wczYFCJnnMKc-mdKqs6ufXJEtEohY0rc6Om-W1p9-5t3mG3oeHnrhaLIShDX39JJ6xjAGzKOpshIJeBr7LWEmLy8qbYMih5OTxuSkJw0zgBzB0zbhh-pyCa269YszSv4IWnM6Z6_hdgPJRSzhOsS9G-gny4DpQIisfwPCQyVWgipSV5yNJoQJpsE3bQbpGlgbgfNip1"
                  altText="Quinoa Salad with Chickpeas"
                />
                <MealCard
                  title="Greek Yogurt with Berries"
                  description="Low-glycemic fruit and protein for a perfect snack."
                  imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuCP0eNZs49KnvEiXqcbvpnp2cFx1NKoEwtxoUtIetVOQzQoWtHqxm9P6tl7QtFBiRwbRfHI6gR2-fKxvrmUF4uvXYkSzbwyLJdexeil0k_zK6_dB8EIogqeydNA48uF9u5-zptfv6t_O_v3p39uYxcQhTcJvIvK3xduD1XKSoIFniq4Pdofk_wuKsl5LNTH8fERF1A0HVROkDwVz4N8Yh3sIId5u9_s_bTYlb6oH5L1pmYLCCL6dq5Csv5vp5aBnbbpnoZWWa8U9IL2"
                  altText="Greek Yogurt with Berries"
                />
                <MealCard
                  title="Avocado Toast"
                  description="Healthy fats and whole grains for sustained energy."
                  imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuAmo2g9-BFcRZVBuOjwUulECPlSa0pdYxPaaooYYlQF06ekS86l01-Kor2NPfDP6tjCaHkVGSQHQ3iuUPuFfZuxxHu47QpjTl6CAhmGzrinpB31B2qbSisSJkEAmQdhHRxWh-n1aa6Ur0_paLsLmjqyUDEns4UO7GxdLEmNBjFaWj64ZoiROKruDAi_gguFRrpqBhmUzdK-nkSGzhW8C7V0j5aE6FoxFz5QrgKU09UixHix8J0i5mENeibIVgx4nNeYUtClFtckawSA"
                  altText="Avocado Toast on Whole Wheat"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Food;
