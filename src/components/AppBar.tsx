import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface AppBarProps {
  title: string;
}

const AppBar: React.FC<AppBarProps> = ({ title }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="bg-blizbi-teal">
      <div className="h-16 flex items-center justify-between w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] lg:w-[calc(100%-16rem)] xl:w-[calc(100%-20rem)] max-w-6xl mx-auto">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="text-blizbi-yellow"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-medium text-blizbi-yellow">{t(title.replace(/-/g, "_"))}</h1>
        </div>
      </div>
    </div>
  );
};

export default AppBar;
