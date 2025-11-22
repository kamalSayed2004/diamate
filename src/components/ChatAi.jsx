// src/components/ChatAi.jsx
import React from "react";
import settings from "../settings"; // Assuming settings.js is one level up
// 1. Import the necessary Font Awesome icons
import { FaRobot, FaPlus, FaMicrophone, FaPaperPlane } from "react-icons/fa";

const ChatAi = () => {
  return (
    <div className="lg:col-span-1 flex flex-col">
      <div
        className={`flex flex-col rounded-xl ${settings.cardBg} border ${settings.cardBorder} h-full`}
      >
        {/* Chat Header */}
        <div className={`p-4 border-b border ${settings.cardBorder}`}>
          <div className="flex items-center gap-2">
            {/* Replaced 'auto_awesome' span with FaRobot */}
            <FaRobot className={`${settings.accentGreen} text-2xl`} />
            <h3
              className={`${settings.activeText} text-base font-bold leading-normal`}
            >
              Chat with Diamate AI
            </h3>
          </div>
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 flex flex-col p-4 space-y-4 overflow-y-auto">
          {/* AI Message 1 */}
          <div className="flex items-start gap-3">
            {/* AI Avatar */}
            <div
              className={`flex size-8 items-center justify-center rounded-full bg-primary/20 shrink-0`}
            >
              {/* Replaced 'auto_awesome' span with FaRobot */}
              <FaRobot className={`${settings.accentGreen} text-lg`} />
            </div>
            {/* AI Bubble */}
            <div className={`${settings.activeBg} rounded-lg p-3 max-w-xs`}>
              <p className="text-white/90 text-sm">
                Hi Yousef! Your glucose is 125 mg/dL and trending up. How can I
                help you today?
              </p>
            </div>
          </div>

          {/* User Message */}
          <div className="flex items-start gap-3 justify-end">
            {/* User Bubble - using 'bg-primary' which is defined in tailwind.config as the accent green color */}
            <div className="bg-primary rounded-lg p-3 max-w-xs">
              <p className="text-black text-sm">What should I eat for lunch?</p>
            </div>
          </div>

          {/* AI Message 2 */}
          <div className="flex items-start gap-3">
            <div
              className={`flex size-8 items-center justify-center rounded-full bg-primary/20 shrink-0`}
            >
              {/* Replaced 'auto_awesome' span with FaRobot */}
              <FaRobot className={`${settings.accentGreen} text-lg`} />
            </div>
            <div className={`${settings.activeBg} rounded-lg p-3 max-w-xs`}>
              <p className="text-white/90 text-sm">
                A quinoa salad with grilled chicken and plenty of greens would
                be a great choice to help stabilize your levels.
              </p>
            </div>
          </div>
        </div>

        {/* Chat Input Area */}
        <div className={`p-4 border-t border ${settings.cardBorder}`}>
          <div className="relative flex items-center gap-2">
            <button
              className={`${settings.inactiveText} flex h-10 w-10 items-center justify-center rounded-lg hover:${settings.activeBg} hover:${settings.activeText} shrink-0`}
            >
              {/* Replaced 'add' span with FaPlus */}
              <FaPlus />
            </button>
            <input
              className={`w-full ${settings.activeBg} text-white/90 rounded-lg h-10 pl-4 pr-20 text-sm focus:outline-none focus:ring-2 focus:ring-primary`}
              placeholder="Ask Diamate anything..."
              type="text"
            />
            <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center">
              <button
                className={`${settings.inactiveText} flex h-8 w-8 items-center justify-center hover:${settings.activeText}`}
              >
                {/* Replaced 'mic' span with FaMicrophone */}
                <FaMicrophone />
              </button>
              <button
                className={`${settings.inactiveText} flex h-8 w-8 items-center justify-center hover:${settings.activeText}`}
              >
                {/* Replaced 'send' span with FaPaperPlane */}
                <FaPaperPlane />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatAi;
