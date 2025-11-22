import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// Use an alias for clarity in modern React projects
import { createRoot as ReactDOMCreateRoot } from "react-dom/client";
import Interface from "./Interface.jsx";
import Login from "./Login.jsx";
import Registration from "./Registration.jsx";
import App from "./App.jsx";
import Activity from "./Activity.jsx";
import Food from "./Food.jsx";
import Reports from "./Reports.jsx";
import Notifications from "./Notifications.jsx";
import Settings from "./Settings.jsx";

// Using the aliased function for clarity
ReactDOMCreateRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Interface />} />
      {/* Route is correctly configured: */}
      <Route path="/login" element={<Login />} />
      <Route path="/registration" element={<Registration />} />
      <Route path="/app" element={<App />} />
      <Route path="/food" element={<Food />} />
      <Route path="/activity" element={<Activity />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  </BrowserRouter>
);
