"use client";

import React from "react";
import { MessageSquare } from "lucide-react";

export default function ChatPage() {
  return (
    <div className="w-full h-full p-4 md:p-8 flex items-center justify-center">
      <div className="group relative w-full max-w-2xl overflow-hidden rounded-[2rem] border shadow-sm transition duration-300 border-slate-200/90 bg-white/90 dark:border-slate-700/80 dark:bg-slate-900/70 backdrop-blur-sm hover:border-blue-200 dark:hover:border-blue-400/45 min-h-[50vh] flex flex-col">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-sky-400 to-blue-600 opacity-90 z-20" />
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Chat Placeholder</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Messaging system is coming soon</p>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-8 flex-1 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
          <MessageSquare className="w-16 h-16 mb-4 opacity-30" />
          <p className="font-semibold px-4 text-center">Chat interface and message threads will render here.</p>
        </div>
      </div>
    </div>
  );
}
