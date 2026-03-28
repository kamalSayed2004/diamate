"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Pill, MessageSquare, Settings, Sun, Moon, LogOut, Menu, X, Utensils, Activity } from "lucide-react";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState<"light" | "dark">("light");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
       setDarkMode("dark");
       document.body.classList.add("dark");
    } else if (savedTheme === "light") {
       setDarkMode("light");
       document.body.classList.remove("dark");
    } else {
       const fallback = document.body.classList.contains("dark") ? "dark" : "light";
       setDarkMode(fallback as "light" | "dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = darkMode === "light" ? "dark" : "light";
    setDarkMode(newTheme);
    localStorage.setItem("theme", newTheme);
    if (newTheme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  };

  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "patientId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/login");
  };

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Medicine", href: "/medicine", icon: Pill },
    { name: "Meal", href: "/meal", icon: Utensils },
    { name: "Lab Tests", href: "/lab-tests", icon: Activity },
    { name: "Chat", href: "/chat", icon: MessageSquare },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const isDark = darkMode === "dark";

  return (
    <div className={`flex h-[100dvh] font-[family-name:var(--font-geist-sans)] transition-colors duration-300 ${isDark ? "bg-blue-950 text-blue-50" : "bg-[#f0f9ff] text-black"} overflow-hidden relative`}>
      {/* Background Gradient */}
      <div
        className={`pointer-events-none fixed inset-0 -z-10 ${isDark
            ? "bg-[radial-gradient(ellipse_90%_60%_at_50%_-18%,rgba(59,130,246,0.16),transparent),radial-gradient(ellipse_60%_45%_at_100%_0%,rgba(56,189,248,0.08),transparent)]"
            : "bg-[radial-gradient(ellipse_90%_55%_at_50%_-20%,rgba(59,130,246,0.14),transparent),radial-gradient(ellipse_55%_40%_at_100%_10%,rgba(125,211,252,0.12),transparent)]"
          }`}
      />

      {/* Mobile Header (Hamburger) */}
      <div className={`md:hidden absolute top-0 left-0 right-0 z-30 flex items-center justify-between p-4 border-b ${isDark ? "border-blue-800 bg-blue-950/80" : "border-blue-200 bg-white/80"} backdrop-blur-md`}>
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="DiaMate Logo" className="h-8 w-8 rounded-full" />
          <span className="text-xl font-black tracking-tight text-black dark:text-white">DiaMate</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(true)}>
          <Menu className="w-6 h-6 text-black dark:text-white" />
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-blue-950/60 z-40 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:relative top-0 left-0 h-full w-64 flex-shrink-0 border-r ${isDark ? "border-blue-800 bg-blue-950/90" : "border-blue-200 bg-white/90"} backdrop-blur-lg flex flex-col z-50 transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
        <div className={`p-6 flex items-center justify-between gap-3 border-b flex-shrink-0 ${isDark ? 'border-blue-800' : 'border-blue-200'}`}>
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="DiaMate Logo" className="h-10 w-10 rounded-full" />
            <span className="text-2xl font-black tracking-tight text-black dark:text-white">DiaMate</span>
          </div>
          <button className="md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
            <X className="w-6 h-6 text-black dark:text-white" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link 
                key={item.name} 
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 text-lg rounded-xl transition-all font-medium ${
                  isActive 
                    ? "bg-blue-700 text-white shadow-md shadow-blue-700/20" 
                    : `hover:bg-blue-100 dark:hover:bg-blue-900/40 ${isDark ? "text-blue-100 hover:text-white" : "text-black hover:text-black"}`
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-white" : ""}`} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className={`p-4 border-t ${isDark ? 'border-blue-800' : 'border-blue-200'} space-y-2`}>
          <button 
            onClick={toggleTheme}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border ${isDark ? "border-blue-700 hover:bg-blue-800 text-white" : "border-blue-300 hover:bg-blue-100 text-black"} transition-colors`}
          >
            <span className="font-bold text-base">Theme</span>
            {isDark ? <Sun className="w-4 h-4 text-white" /> : <Moon className="w-4 h-4 text-black" />}
          </button>
          
          <button 
            onClick={handleLogout}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors`}
          >
            <span className="font-bold text-base">Log Out</span>
            <LogOut className="w-4 h-4 text-red-500 dark:text-red-400" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 h-full overflow-y-auto relative z-10 flex flex-col md:pt-0 pt-[72px]">
        {children}
      </main>
    </div>
  );
}
