/**
 * Consent-aware storage utilities
 * These utilities respect user consent preferences when storing data
 */

import { CONSENT_STORAGE_KEY } from "../types/consent";

// Check if we have consent for a specific category
const hasConsentForCategory = (
  category: "functional" | "analytics" | "personalization"
): boolean => {
  try {
    const consentData = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!consentData) {
      return false; // No consent given, only essential storage allowed
    }

    const consent = JSON.parse(consentData);
    return consent.preferences?.[category] === true;
  } catch (error) {
    console.error("Error checking consent:", error);
    return false;
  }
};

// Consent-aware localStorage operations
export const consentStorage = {
  // Essential storage (always allowed)
  essential: {
    setItem: (key: string, value: string) => {
      try {
        localStorage.setItem(key, value);
      } catch (error) {
        console.error("Error setting essential storage:", error);
      }
    },
    getItem: (key: string): string | null => {
      try {
        return localStorage.getItem(key);
      } catch (error) {
        console.error("Error getting essential storage:", error);
        return null;
      }
    },
    removeItem: (key: string) => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error("Error removing essential storage:", error);
      }
    },
  },

  // Functional storage (user preferences, bookmarks, etc.)
  functional: {
    setItem: (key: string, value: string) => {
      if (hasConsentForCategory("functional")) {
        try {
          localStorage.setItem(key, value);
        } catch (error) {
          console.error("Error setting functional storage:", error);
        }
      } else {
        // Fallback to sessionStorage for non-persistent storage
        try {
          sessionStorage.setItem(key, value);
        } catch (error) {
          console.error("Error setting session storage:", error);
        }
      }
    },
    getItem: (key: string): string | null => {
      if (hasConsentForCategory("functional")) {
        try {
          return localStorage.getItem(key);
        } catch (error) {
          console.error("Error getting functional storage:", error);
          return null;
        }
      } else {
        // Try sessionStorage as fallback
        try {
          return sessionStorage.getItem(key);
        } catch (error) {
          console.error("Error getting session storage:", error);
          return null;
        }
      }
    },
    removeItem: (key: string) => {
      try {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      } catch (error) {
        console.error("Error removing functional storage:", error);
      }
    },
  },

  // Analytics storage (usage tracking, etc.)
  analytics: {
    setItem: (key: string, value: string) => {
      if (hasConsentForCategory("analytics")) {
        try {
          localStorage.setItem(key, value);
        } catch (error) {
          console.error("Error setting analytics storage:", error);
        }
      }
    },
    getItem: (key: string): string | null => {
      if (hasConsentForCategory("analytics")) {
        try {
          return localStorage.getItem(key);
        } catch (error) {
          console.error("Error getting analytics storage:", error);
          return null;
        }
      }
      return null;
    },
    removeItem: (key: string) => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error("Error removing analytics storage:", error);
      }
    },
  },

  // Personalization storage (chat history, recommendations, etc.)
  personalization: {
    setItem: (key: string, value: string) => {
      if (hasConsentForCategory("personalization")) {
        try {
          localStorage.setItem(key, value);
        } catch (error) {
          console.error("Error setting personalization storage:", error);
        }
      }
    },
    getItem: (key: string): string | null => {
      if (hasConsentForCategory("personalization")) {
        try {
          return localStorage.getItem(key);
        } catch (error) {
          console.error("Error getting personalization storage:", error);
          return null;
        }
      }
      return null;
    },
    removeItem: (key: string) => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error("Error removing personalization storage:", error);
      }
    },
  },
};

// Utility to clean up storage when consent is withdrawn
export const cleanupStorageByCategory = (
  category: "functional" | "analytics" | "personalization"
) => {
  // Define which keys belong to which category
  const categoryKeys = {
    functional: [
      "blizbi_bookmarks",
      "blizbi_user_preferences",
      "i18nextLng",
      "blizbi-language",
    ],
    analytics: ["blizbi_analytics", "blizbi_usage_stats"],
    personalization: ["blizbi_chat_history", "blizbi_recommendations"],
  };

  const keys = categoryKeys[category] || [];

  keys.forEach((key) => {
    try {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error(
        `Error removing ${category} storage for key ${key}:`,
        error
      );
    }
  });
};

// Hook for React components to use consent-aware storage
export const useConsentStorage = () => {
  return {
    consentStorage,
    cleanupStorageByCategory,
    hasConsentForCategory,
  };
};
