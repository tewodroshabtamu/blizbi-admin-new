import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Main translations
import en from "./locales/en/translations.json";
import no from "./locales/no/translations.json";

// Admin translations
import enAdmin from "./locales/en/admin_translations.json";
import noAdmin from "./locales/no/admin_translations.json";

const resources = {
  en: {
    translation: {
      ...en,
      ...enAdmin,
    },
  },
  no: {
    translation: {
      ...no,
      ...noAdmin,
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "no", // Default to Norwegian
  fallbackLng: "en",

  ns: ["translation"],
  defaultNS: "translation",

  keySeparator: ".",

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
