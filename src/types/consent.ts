export interface ConsentPreferences {
  essential: boolean;        // Always true - auth, security, basic functionality
  functional: boolean;       // Language settings, bookmarks, user preferences
  analytics: boolean;        // Usage tracking, performance monitoring
  personalization: boolean;  // AI chat history, personalized recommendations
}

export interface ConsentState {
  hasResponded: boolean;
  preferences: ConsentPreferences;
  timestamp: string;
  version: string; // For tracking consent policy changes
}

export interface ConsentContextType {
  consentState: ConsentState | null;
  updateConsent: (preferences: Partial<ConsentPreferences>) => void;
  acceptAll: () => void;
  rejectAll: () => void;
  resetConsent: () => void;
  requestDataDeletion: () => Promise<{ success: boolean; message: string }>;
  hasConsent: (category: keyof ConsentPreferences) => boolean;
  isConsentRequired: boolean;
}

export const CONSENT_VERSION = '1.0.0';
export const CONSENT_STORAGE_KEY = 'blizbi_consent';

export const DEFAULT_CONSENT: ConsentPreferences = {
  essential: true,  // Always true, required for basic app functionality
  functional: false,
  analytics: false,
  personalization: false,
}; 