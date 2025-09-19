import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import AppBar from "../components/AppBar";

const AppBarLayout = () => {
  const location = useLocation();
  const path = location.pathname.slice(1) || "home";
  
  // Map paths to translation keys
  const pathToTranslationKey: Record<string, string> = {
    about: "about.navigation",
    "terms-of-use": "terms.navigation",
    support: "support.navigation",
    feedback: "feedback.navigation",
    privacy: "privacy.navigation",
    profile: "profile.navigation",
    settings: "settings.navigation",
    "data-settings": "consent.in_app_settings.menu_label"
  };

  const title = pathToTranslationKey[path] || path;

  return (
    <div>
      <div className="fixed top-0 left-0 right-0 z-50">
        <AppBar title={title} />
      </div>
      <div className="mt-16 w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] lg:w-[calc(100%-16rem)] xl:w-[calc(100%-20rem)] max-w-6xl mx-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AppBarLayout;
