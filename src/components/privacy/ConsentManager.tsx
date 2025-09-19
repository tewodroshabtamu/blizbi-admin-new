import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Eye, User, Zap, Clock, AlertCircle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useConsent } from '../../contexts/ConsentContext';
import { ConsentPreferences } from '../../types/consent';

const ConsentManager: React.FC = () => {
  const { t } = useTranslation();
  const { consentState, updateConsent, acceptAll, rejectAll } = useConsent();
  const [preferences, setPreferences] = useState<ConsentPreferences>(
    consentState?.preferences || { essential: true, functional: false, analytics: false, personalization: false }
  );
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize preferences from current consent state
  useEffect(() => {
    if (consentState?.preferences) {
      setPreferences(consentState.preferences);
    }
  }, [consentState]);

  // Check for changes
  useEffect(() => {
    if (consentState?.preferences) {
      setHasChanges(JSON.stringify(preferences) !== JSON.stringify(consentState.preferences));
    }
  }, [preferences, consentState]);

  const togglePreference = (key: keyof ConsentPreferences) => {
    if (key === 'essential') return; // Essential cannot be disabled
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = () => {
    updateConsent(preferences);
    setHasChanges(false);
  };

  const handleReset = () => {
    setPreferences(consentState?.preferences || { essential: true, functional: false, analytics: false, personalization: false });
    setHasChanges(false);
  };

  // Export consent data for user (GDPR compliance)
  const exportConsentData = () => {
    const data = {
      consent_preferences: consentState?.preferences,
      timestamp: consentState?.timestamp,
      version: consentState?.version,
      exported_at: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${t('consent.export.filename')}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const consentCategories = [
    {
      key: 'essential' as const,
      icon: Shield,
      titleKey: 'consent.essential.title',
      descKey: 'consent.essential.description',
      required: true,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      key: 'functional' as const,
      icon: Zap,
      titleKey: 'consent.functional.title',
      descKey: 'consent.functional.description',
      required: false,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      key: 'analytics' as const,
      icon: Eye,
      titleKey: 'consent.analytics.title',
      descKey: 'consent.analytics.description',
      required: false,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      key: 'personalization' as const,
      icon: User,
      titleKey: 'consent.personalization.title',
      descKey: 'consent.personalization.description',
      required: false,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  if (!consentState) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-yellow-600" />
          <p className="text-sm text-yellow-800">
            {t('consent.manager.no_consent')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with GDPR Notice */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {t('consent.manager.title')}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {t('consent.manager.description')}
          </p>
          <div className="mt-2 text-xs text-blue-600 bg-blue-50 rounded-md px-2 py-1 inline-block">
            {t('consent.manager.update_notice')}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {consentState.timestamp && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Clock className="w-4 h-4" />
              <span>
                {t('consent.privacy.last_updated')} {new Date(consentState.timestamp).toLocaleDateString()}
              </span>
            </div>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={exportConsentData}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            {t('consent.export.button')}
          </Button>
        </div>
      </div>

      {/* Consent Categories */}
      <div className="space-y-4">
        {consentCategories.map(({ key, icon: Icon, titleKey, descKey, required, color, bgColor }) => (
          <div key={key} className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`p-2 rounded-lg ${bgColor}`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-gray-900">
                        {t(titleKey)}
                      </h3>
                      {required && (
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">
                          {t('consent.required')}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {t(descKey)}
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer ml-4">
                  <input
                    type="checkbox"
                    checked={preferences[key]}
                    onChange={() => togglePreference(key)}
                    disabled={required}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blizbi-teal/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blizbi-teal"></div>
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <Button
            variant="outline"
            onClick={rejectAll}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            {t('consent.reject_all')}
          </Button>
          
          <Button
            onClick={acceptAll}
            className="bg-blizbi-yellow hover:bg-yellow-500 text-black font-medium"
          >
            {t('consent.accept_all')}
          </Button>
        </div>

        <div className="flex gap-3">
          {hasChanges && (
            <Button
              variant="outline"
              onClick={handleReset}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              {t('consent.actions.reset_changes')}
            </Button>
          )}
          
          <Button
            onClick={handleSave}
            disabled={!hasChanges}
            className="bg-blizbi-teal hover:bg-blizbi-teal/90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {hasChanges ? t('consent.actions.save_changes') : t('consent.actions.saved')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConsentManager; 