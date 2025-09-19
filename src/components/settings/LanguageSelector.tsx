import React, { useState } from "react";
import { Globe } from "lucide-react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { useTranslation } from "react-i18next";
import { SettingItem } from "./SettingItem";
import { useConsentStorage } from "../../utils/storage";

const LANGUAGES = [
  { code: "no", label: "Norsk" },
  { code: "en", label: "English" },
];

interface LanguageSelectorProps {
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ className }) => {
  const { t, i18n } = useTranslation();
  const { consentStorage } = useConsentStorage();
  
  // Use consent-aware storage for language preference
  const savedLanguage = consentStorage.functional.getItem("blizbi-language") || "no";
  const [language, setLanguage] = useState(
    LANGUAGES.find((lang) => lang.code === savedLanguage) || LANGUAGES[0]
  );
  const [showSheet, setShowSheet] = useState(false);
  const [sheetClosing, setSheetClosing] = useState(false);

  const handleLanguageClick = () => {
    setShowSheet(true);
    setSheetClosing(false);
  };

  const closeSheet = () => {
    setSheetClosing(true);
    setTimeout(() => {
      setShowSheet(false);
      setSheetClosing(false);
    }, 250); // match animation duration
  };

  const handleSelectLanguage = (lang: typeof LANGUAGES[0]) => {
    setLanguage(lang);
    i18n.changeLanguage(lang.code);
    // Use consent-aware storage instead of direct localStorage
    consentStorage.functional.setItem("blizbi-language", lang.code);
    closeSheet();
  };

  return (
    <>
      <div className={`bg-white rounded-lg shadow divide-y divide-neutral-100 overflow-hidden ${className || ""}`}>
        <SettingItem
          icon={<Globe className="w-5 h-5 text-blizbi-teal" />}
          title={t("language")}
          subtitle={language.label}
          onClick={handleLanguageClick}
        />
      </div>

      {/* Bottom Sheet */}
      {showSheet && (
        <div
          className="fixed inset-0 z-50 flex flex-col justify-end bg-black/40"
          onClick={closeSheet}
        >
          <div
            className={`w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] lg:w-[calc(100%-16rem)] xl:w-[calc(100%-20rem)] max-w-6xl mx-auto bg-white rounded-t-2xl p-4 pb-8 max-h-[60vh] overflow-hidden shadow-2xl animate-slide-up ${
              sheetClosing ? "animate-slide-down" : ""
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1.5 bg-neutral-200 rounded-full mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-center mb-4">
              {t("choose.language")}
            </h2>
            <ScrollArea.Root className="w-full h-[32vh] max-h-[32vh] rounded-lg overflow-hidden">
              <ScrollArea.Viewport className="w-full h-full">
                <ul>
                  {LANGUAGES.map((lang) => (
                    <li key={lang.code}>
                      <button
                        className={`w-full text-left px-4 py-3 rounded-lg mb-1 transition font-medium ${
                          lang.code === language.code
                            ? "bg-blizbi-teal/10 text-blizbi-teal"
                            : "hover:bg-neutral-100 text-neutral-900"
                        }`}
                        onClick={() => handleSelectLanguage(lang)}
                      >
                        {lang.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </ScrollArea.Viewport>
              <ScrollArea.Scrollbar
                orientation="vertical"
                className="flex select-none touch-none p-0.5 bg-neutral-100 rounded-full w-2"
              >
                <ScrollArea.Thumb className="flex-1 bg-neutral-300 rounded-full" />
              </ScrollArea.Scrollbar>
            </ScrollArea.Root>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes slide-down {
          from { transform: translateY(0); }
          to { transform: translateY(100%); }
        }
        .animate-slide-up {
          animation: slide-up 0.25s cubic-bezier(0.4,0,0.2,1);
        }
        .animate-slide-down {
          animation: slide-down 0.25s cubic-bezier(0.4,0,0.2,1);
        }
      `}</style>
    </>
  );
}; 