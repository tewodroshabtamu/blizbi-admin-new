import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { supabase } from '../supabase-client';
import {
  ConsentState,
  ConsentPreferences,
  ConsentContextType,
  DEFAULT_CONSENT,
  CONSENT_VERSION,
  CONSENT_STORAGE_KEY,
} from '../types/consent';
import { updateLanguageFromStorage } from '../i18n';
import { consentStorage, cleanupStorageByCategory } from '../utils/storage';

const ConsentContext = createContext<ConsentContextType | undefined>(undefined);

interface ConsentProviderProps {
  children: ReactNode;
}

export const ConsentProvider: React.FC<ConsentProviderProps> = ({ children }) => {
  const [consentState, setConsentState] = useState<ConsentState | null>(null);
  const { isSignedIn, userId } = useAuth();

  // Load consent on mount
  useEffect(() => {
    loadConsent();
  }, [isSignedIn, userId]);

  // Initialize language when consent state changes
  useEffect(() => {
    if (consentState && consentState.hasResponded) {
      // Update language from storage after consent is established
      updateLanguageFromStorage(consentStorage);
    }
  }, [consentState]);

  const loadConsent = async () => {
    try {
      // Try to load from localStorage first
      const localConsent = localStorage.getItem(CONSENT_STORAGE_KEY);
      let consent: ConsentState | null = null;

      if (localConsent) {
        consent = JSON.parse(localConsent);
        // Check if consent version is outdated
        if (consent && consent.version !== CONSENT_VERSION) {
          consent = null; // Reset consent for new version
        }
      }

      // If user is signed in, try to sync with Supabase
      if (isSignedIn && userId) {
        try {
          const { data: userConsent } = await supabase
            .from('user_consent')
            .select('*')
            .eq('user_id', userId)
            .single();

          if (userConsent && userConsent.version === CONSENT_VERSION) {
            consent = {
              hasResponded: true,
              preferences: userConsent.preferences,
              timestamp: userConsent.updated_at,
              version: userConsent.version,
            };
          }
        } catch (error) {
          console.log('No user consent found in database');
        }
      }

      setConsentState(consent);
    } catch (error) {
      console.error('Error loading consent:', error);
      setConsentState(null);
    }
  };

  const saveConsent = async (preferences: ConsentPreferences, action?: string) => {
    const timestamp = new Date().toISOString();
    const newConsentState: ConsentState = {
      hasResponded: true,
      preferences,
      timestamp,
      version: CONSENT_VERSION,
    };

    // Log the consent action for audit purposes
    console.log(`Consent ${action || 'updated'}:`, {
      timestamp,
      preferences,
      userId: userId || 'anonymous',
      version: CONSENT_VERSION,
    });

    setConsentState(newConsentState);

    // Save to localStorage (always, for anonymous users)
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(newConsentState));
    } catch (error) {
      console.error('Error saving consent to localStorage:', error);
    }

    // Save to Supabase if user is signed in
    if (isSignedIn && userId) {
      try {
        const { error } = await supabase
          .from('user_consent')
          .upsert({
            user_id: userId,
            preferences,
            version: CONSENT_VERSION,
            updated_at: timestamp,
          });

        if (error) {
          console.error('Error saving consent to database:', error);
          // Still continue - local storage is the fallback
        } else {
          console.log('Consent successfully saved to database');
        }
      } catch (error) {
        console.error('Error saving consent to database:', error);
      }
    }
  };

  const updateConsent = (preferences: Partial<ConsentPreferences>) => {
    const currentPreferences = consentState?.preferences || DEFAULT_CONSENT;
    const newPreferences: ConsentPreferences = {
      ...currentPreferences,
      ...preferences,
      essential: true, // Essential is always true
    };
    
    // Determine the action type for logging
    const action = consentState?.hasResponded ? 'updated' : 'granted';
    saveConsent(newPreferences, action);
  };

  const acceptAll = () => {
    const allAccepted: ConsentPreferences = {
      essential: true,
      functional: true,
      analytics: true,
      personalization: true,
    };
    
    const action = consentState?.hasResponded ? 'accepted_all' : 'granted_all';
    saveConsent(allAccepted, action);
  };

  const rejectAll = () => {
    const action = consentState?.hasResponded ? 'rejected_all' : 'granted_essential_only';
    saveConsent(DEFAULT_CONSENT, action);
  };

  // Comprehensive data deletion function (GDPR Right to Erasure)
  const requestDataDeletion = async (): Promise<{ success: boolean; message: string }> => {
    if (!isSignedIn || !userId) {
      return {
        success: false,
        message: 'Must be signed in to request data deletion'
      };
    }

    try {
      console.log('Data deletion requested:', {
        timestamp: new Date().toISOString(),
        userId,
        action: 'data_deletion_requested',
      });

      // Delete from all relevant tables
      const deletionPromises = [
        // Delete user consent
        supabase.from('user_consent').delete().eq('user_id', userId),
        // Delete user profile
        supabase.from('profiles').delete().eq('clerk_id', userId),
        // Add other user data tables as needed
        // Example: supabase.from('user_bookmarks').delete().eq('user_id', userId),
        // Example: supabase.from('user_chat_history').delete().eq('user_id', userId),
      ];

      const results = await Promise.allSettled(deletionPromises);
      
      // Check for any failures
      const failures = results.filter(result => result.status === 'rejected');
      if (failures.length > 0) {
        console.error('Some data deletion operations failed:', failures);
        return {
          success: false,
          message: 'Some data could not be deleted. Please contact support.'
        };
      }

      // Clean up local storage
      cleanupStorageByCategory('functional');
      cleanupStorageByCategory('analytics');
      cleanupStorageByCategory('personalization');
      
      // Remove consent from localStorage
      localStorage.removeItem(CONSENT_STORAGE_KEY);

      console.log('Data deletion completed successfully');

      return {
        success: true,
        message: 'All your data has been successfully deleted.'
      };

    } catch (error) {
      console.error('Error during data deletion:', error);
      return {
        success: false,
        message: 'An error occurred during data deletion. Please contact support.'
      };
    }
  };

  const resetConsent = () => {
    console.log('Consent withdrawn and reset:', {
      timestamp: new Date().toISOString(),
      userId: userId || 'anonymous',
      action: 'withdrawn_and_reset',
    });

    setConsentState(null);
    
    // Clean up all stored data when consent is withdrawn
    cleanupStorageByCategory('functional');
    cleanupStorageByCategory('analytics');
    cleanupStorageByCategory('personalization');
    
    try {
      localStorage.removeItem(CONSENT_STORAGE_KEY);
    } catch (error) {
      console.error('Error removing consent from localStorage:', error);
    }

    // Remove from Supabase if user is signed in
    if (isSignedIn && userId) {
      supabase
        .from('user_consent')
        .delete()
        .eq('user_id', userId)
        .then(({ error }) => {
          if (error) {
            console.error('Error removing consent from database:', error);
          } else {
            console.log('Consent successfully removed from database');
          }
        });
    }
  };

  const hasConsent = (category: keyof ConsentPreferences): boolean => {
    if (!consentState || !consentState.hasResponded) {
      return category === 'essential'; // Only essential is allowed without consent
    }
    return consentState.preferences[category];
  };

  const isConsentRequired = !consentState || !consentState.hasResponded;

  const contextValue: ConsentContextType = {
    consentState,
    updateConsent,
    acceptAll,
    rejectAll,
    resetConsent,
    requestDataDeletion,
    hasConsent,
    isConsentRequired,
  };

  return (
    <ConsentContext.Provider value={contextValue}>
      {children}
    </ConsentContext.Provider>
  );
};

export const useConsent = (): ConsentContextType => {
  const context = useContext(ConsentContext);
  if (context === undefined) {
    throw new Error('useConsent must be used within a ConsentProvider');
  }
  return context;
}; 