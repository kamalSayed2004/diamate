// src/components/GlucoseCards.jsx
import React, { useState, useEffect } from "react";
import settings from "../settings";
import { FaArrowUp } from "react-icons/fa";

const GlucoseCards = () => {
  const [glucose, setGlucose] = useState(0);

  let token = localStorage.getItem("DiamateToken");
  let id = localStorage.getItem("DiamateTokenId");

  useEffect(() => {
    const fetchGlucose = async () => {
      let response = await fetch(
        `${settings.API_BASE_URL}/BloodGlucoseReading/GetAllBloodGlucoseReadingByPatientId/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        let result = await response.json();

        console.log(result);
        if (result && result["reading_value"] !== undefined) {
          setGlucose(result["reading_value"]);
        }
      }
    };
    fetchGlucose();

    const intervalId = setInterval(fetchGlucose, 10000);
    return () => clearInterval(intervalId);
  }, [id, token]);

  return (
    <div className="lg:col-span-2 flex flex-col gap-6">
      {/* Top Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Glucose Card */}
        <div
          className={`flex flex-col gap-4 rounded-xl p-6 ${settings.cardBg} border ${settings.cardBorder}`}
        >
          <p
            className={`${settings.activeText} text-base font-medium leading-normal`}
          >
            Current Glucose
          </p>
          <div className="flex items-baseline gap-2">
            <p
              className={`${settings.activeText} tracking-light text-5xl font-bold leading-tight`}
            >
              {glucose}
            </p>
            <span className={`${settings.emailText} text-lg font-medium`}>
              mg/dL
            </span>
          </div>
          <div className="flex items-center gap-2 text-green-400">
            <FaArrowUp />
            <p className="text-base font-medium leading-normal">Trending Up</p>
          </div>
          <p className={`${settings.emailText} text-xs font-normal`}>
            Last updated: 2 mins ago
          </p>
        </div>

        {/* Time in Range Card */}
        <div
          className={`flex flex-col gap-4 rounded-xl p-6 ${settings.cardBg} border ${settings.cardBorder}`}
        >
          <h3 className={`${settings.activeText} text-lg font-bold`}>
            Time in Range
          </h3>
          <div className="relative flex items-center justify-center h-24">
            <img
              alt="A donut chart showing time in range statistics: 85% in range, 10% high, 5% low."
              className="h-full w-full object-contain"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAaGAT4gTyckPPxfim5cFsR1X1EzQ1h-T108AEGtTndo5gb7_jiMnzFf4GDVMNhz1H8KE6XOEv3VKD7iqXhi-4takAKwEdgpsPhOsELqfGBD8pwfokwosqcm6F9uhtup3kdBWzSzoC0h-Eg5H_zQVvyEgCWo6mdM6ybthN8W51GsXwdWHCIDCI6Wc5yI6C7ssxgtqS5AdjfPiNy82qUtIcJS1TfLLtxPb6QkhtxEUSsCsGdJimcxTf6BWamW2ek2qCoYBYFchqXmmT2"
            />
          </div>
          <div className="grid grid-cols-3 gap-2 text-center mt-2">
            <div>
              <p className={`text-xs ${settings.emailText}`}>Low</p>
              <p className="font-bold text-red-500 text-lg">5%</p>
            </div>
            <div>
              <p className={`text-xs ${settings.emailText}`}>In Range</p>
              <p className="font-bold text-green-400 text-lg">85%</p>
            </div>
            <div>
              <p className={`text-xs ${settings.emailText}`}>High</p>
              <p className="font-bold text-yellow-500 text-lg">10%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Glucose Trend Card */}
      <div
        className={`rounded-xl p-6 ${settings.cardBg} border ${settings.cardBorder}`}
      >
        <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
          <h3 className={`${settings.activeText} text-lg font-bold`}>
            Today's Glucose Trend
          </h3>
          <div className={`flex gap-1 ${settings.activeBg} p-1 rounded-lg`}>
            <button
              className={`${settings.inactiveText} px-3 py-1 text-sm font-medium rounded-md hover:text-white`}
            >
              3h
            </button>
            <button
              className={`${settings.inactiveText} px-3 py-1 text-sm font-medium rounded-md hover:text-white`}
            >
              6h
            </button>
            {/* Active Time Filter Button */}
            <button
              className={`px-3 py-1 text-sm font-medium ${settings.timeFilterActiveBg} ${settings.activeText} rounded-md`}
            >
              12h
            </button>
            <button
              className={`${settings.inactiveText} px-3 py-1 text-sm font-medium rounded-md hover:text-white`}
            >
              24h
            </button>
          </div>
        </div>
        <div className="h-64 w-full flex items-center justify-center">
          <img
            alt="A line graph showing glucose trends over the last 12 hours with green, yellow, and red zones indicating target ranges."
            className="h-full w-full object-contain"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdLLsMo758zMEGghgu5wATDdCprgN6FNCx9GZGkjgkLIA2EPPcnWT1CYW1tnVP9qNdSKJr2Uxug_vLVNdT42Crc39Dy2tsk5rct7BnvTy4h0kHGXJPIw9RJ1tkNiPbf7xwIb20mburMMFwAfxf-jmXr9EJSBQsUwjQyw_zIaBQRp7LbGE0eOyCBCmjaARSFy_MSkIcQOujbkSJZfjbLnqBc6Qw5vSXyxxrzTRvUSU6enyLEpuBrjxNhA4TTW1mgyWAeZzRhBi88dsu"
          />
        </div>
      </div>
    </div>
  );
};

export default GlucoseCards;
