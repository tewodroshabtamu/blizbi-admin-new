import React from "react";
import { useTranslation } from "react-i18next";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const languages = [
  { code: 'en', name: 'English' },
  { code: 'no', name: 'Norwegian' }
];

export const LanguageSelector: React.FC = () => {
  const { i18n, t } = useTranslation();

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">{t("language")}</h2>
        <p className="text-gray-600">{t("choose.language")}</p>
      </div>
      
      <Select value={i18n.language} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {languages.map((language) => (
            <SelectItem key={language.code} value={language.code}>
              {language.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}; 