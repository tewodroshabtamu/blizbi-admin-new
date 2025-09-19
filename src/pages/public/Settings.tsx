import React from "react";
import { LanguageSelector } from "@/components/settings/LanguageSelector";

const Settings: React.FC = () => {
  return (
    <div className="py-2 space-y-8">
      <LanguageSelector className="mt-5" />
    </div>
  );
};

export default Settings;
