import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Home,
  Utensils,
  Activity,
  BarChart,
  Bell,
  Settings,
  Diamond,
  Menu,
  X,
  User,
} from "lucide-react";

import settings from "../settings.js";

const {
  sidebarBg,
  borderDark,
  accentGreen,
  activeBg,
  inactiveText,
  hoverBg,
  activeText,
  emailText,
} = settings;

const navItems = [
  {
    name: "Home",
    icon: Home,
    href: "/app",
  },
  {
    name: "Food Log",
    icon: Utensils,
    href: "/food",
  },
  {
    name: "Activity",
    icon: Activity,
    href: "/activity",
  },
  {
    name: "Reports",
    icon: BarChart,
    href: "/reports",
  },
];

const utilityItems = [
  {
    name: "Notifications",
    icon: Bell,
    href: "/notifications",
  },
  {
    name: "Settings",
    icon: Settings,
    href: "/settings",
  },
];

const Sidebar = () => {
  // Use useLocation to get the current path for automatic active state
  const location = useLocation();
  const currentPath = location.pathname;

  // State to manage the visibility of the mobile menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // State for dynamic user profile data
  const [userProfile, setUserProfile] = useState({
    name: "Loading...",
    email: "loading...",
    avatar: null,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("DiamateToken");
        const id = localStorage.getItem("DiamateTokenId");

        if (!token || !id) {
          setUserProfile({
            name: "Guest User",
            email: "Please log in",
            avatar: null,
          });
          return;
        }

        const response = await fetch(
          `${settings.API_BASE_URL}/Patients/GetPatient/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();

          const fullName = `${data.firstName} ${data.secondName || ""} ${
            data.lastName || ""
          }`.trim();

          let avatarUrl = null;
          if (data.profileImage) {
            avatarUrl = `data:image/jpeg;base64,${data.profileImage}`;
          }

          setUserProfile({
            name: fullName || "Diamate User",
            email: data.email || "No email",
            avatar: avatarUrl,
          });
        }
      } catch (error) {
        console.error("Failed to fetch sidebar user data", error);
      }
    };

    fetchUserData();

    window.addEventListener("userProfileUpdated", fetchUserData);

    return () => {
      window.removeEventListener("userProfileUpdated", fetchUserData);
    };
  }, []);

  const isItemActive = (href) => {
    if (href === "/app") {
      return currentPath === href;
    }
    return currentPath.startsWith(href);
  };

  const SidebarContent = ({ onClose }) => (
    <div className="flex flex-col justify-between h-full">
      {/* Logo Section */}
      <div className="flex items-center gap-2 pt-1 pb-2">
        <Diamond className={`${accentGreen} text-3xl`} />
        <h1
          className={`${activeText} text-xl font-bold font-inter tracking-tight`}
        >
          Diamate
        </h1>
        {/* Close button (only visible in mobile drawer) */}
        <button
          onClick={onClose}
          className={`p-2 rounded-full lg:hidden ml-auto ${inactiveText} hover:${activeText} hover:${hoverBg}`}
          aria-label="Close sidebar menu"
        >
          <X className="text-2xl" />
        </button>
      </div>

      <div className="flex flex-col gap-2 grow mt-4">
        {/* Main Navigation Links */}
        {navItems.map((item) => {
          const isActive = isItemActive(item.href);
          return (
            <a
              key={item.name}
              className={`flex items-center gap-3 rounded-xl px-3 py-2 transition-colors duration-150 ${
                isActive
                  ? `${activeBg} ${activeText} shadow-lg`
                  : `${inactiveText} ${hoverBg} hover:${activeText}`
              }`}
              href={item.href}
              onClick={onClose} // Close menu on link click (for mobile)
            >
              <item.icon className="text-xl" />
              <p className="text-sm font-medium leading-normal">{item.name}</p>
            </a>
          );
        })}
      </div>

      {/* Bottom Utility Links and Profile */}
      <div className="flex flex-col gap-2 mt-auto pt-4">
        {utilityItems.map((item) => {
          const isActive = isItemActive(item.href);
          return (
            <a
              key={item.name}
              className={`flex items-center gap-3 rounded-xl px-3 py-2 transition-colors duration-150 ${
                isActive
                  ? `${activeBg} ${activeText} shadow-lg`
                  : `${inactiveText} ${hoverBg} hover:${activeText}`
              }`}
              href={item.href}
              onClick={onClose} // Close menu on link click (for mobile)
            >
              <item.icon className="text-xl" />
              <p className="text-sm font-medium leading-normal">{item.name}</p>
            </a>
          );
        })}

        {/* User Profile Info - DYNAMICALLY UPDATED */}
        <div className={`mt-4 flex gap-3 border-t ${borderDark} pt-4`}>
          <div
            className={`bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 shrink-0 flex items-center justify-center ${
              !userProfile.avatar ? "bg-gray-700" : ""
            }`}
            role="img"
            aria-label="User avatar image"
            style={
              userProfile.avatar
                ? { backgroundImage: `url("${userProfile.avatar}")` }
                : {}
            }
          >
            {/* Fallback icon if no image */}
            {!userProfile.avatar && <User className="text-white/50 text-xl" />}
          </div>
          <div className="flex flex-col overflow-hidden justify-center">
            <h1
              className={`${activeText} text-base font-medium leading-normal truncate capitalize`}
            >
              {userProfile.name}
            </h1>
            <p
              className={`${emailText} text-sm font-normal leading-normal truncate`}
            >
              {userProfile.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Burger Menu Button (visible on small screens, fixed to top left) */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className={`p-2 fixed top-4 left-4 z-40 lg:hidden ${inactiveText} hover:${activeText} hover:${hoverBg} rounded-full transition-colors`}
        aria-label="Open sidebar menu"
      >
        <Menu className="text-3xl" />
      </button>

      {/* Mobile Sidebar Drawer Overlay (Clicking this closes the menu) */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Mobile Sidebar Drawer (The actual menu that slides in) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 lg:hidden w-64 ${sidebarBg} p-4 flex flex-col ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent onClose={() => setIsMobileMenuOpen(false)} />
      </aside>

      {/* Desktop Sidebar (The original component, visible only on large screens) */}
      <aside
        // The original desktop sidebar classes
        className={`hidden lg:flex w-64 shrink-0 flex-col gap-y-6 border-r ${borderDark} ${sidebarBg} p-4`}
      >
        {/* We pass a no-op function for onClose as it's not needed for desktop */}
        <SidebarContent onClose={() => {}} />
      </aside>
    </>
  );
};
export default Sidebar;
