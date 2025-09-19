import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Settings, Shield, Eye, User, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useConsent } from '../../contexts/ConsentContext';
import { ConsentPreferences } from '../../types/consent';

const ConsentBanner: React.FC = () => {
  const { t } = useTranslation();
  const { isConsentRequired, acceptAll, rejectAll, updateConsent } = useConsent();
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<ConsentPreferences>({
    essential: true,
    functional: false,
    analytics: false,
    personalization: false,
  });

  if (!isConsentRequired) {
    return null;
  }

  const handleCustomSave = () => {
    updateConsent(preferences);
  };

  const togglePreference = (key: keyof ConsentPreferences) => {
    if (key === 'essential') return; // Essential cannot be disabled
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const consentCategories = [
    {
      key: 'essential' as const,
      icon: Shield,
      titleKey: 'consent.essential.title',
      descriptionKey: 'consent.essential.description',
      required: true,
    },
    {
      key: 'functional' as const,
      icon: Zap,
      titleKey: 'consent.functional.title',
      descriptionKey: 'consent.functional.description',
      required: false,
    },
    {
      key: 'analytics' as const,
      icon: Eye,
      titleKey: 'consent.analytics.title',
      descriptionKey: 'consent.analytics.description',
      required: false,
    },
    {
      key: 'personalization' as const,
      icon: User,
      titleKey: 'consent.personalization.title',
      descriptionKey: 'consent.personalization.description',
      required: false,
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center p-4">
      <div className="bg-white rounded-t-xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-blizbi-teal px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-blizbi-yellow" />
            <h2 className="text-xl font-semibold text-white">
              {t('consent.banner.title')}
            </h2>
          </div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-blizbi-yellow hover:text-yellow-200 transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {!showDetails ? (
              // Simple banner view
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  {t('consent.banner.description')}
                </p>
                <p className="text-sm text-gray-600">
                  {t('consent.banner.details')}
                </p>
              </div>
            ) : (
              // Detailed preferences view
              <div className="space-y-6">
                <p className="text-gray-700 mb-6">
                  {t('consent.panel.description')}
                </p>
                
                {consentCategories.map(({ key, icon: Icon, titleKey, descriptionKey, required }) => (
                  <div key={key} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <Icon className="w-5 h-5 text-blizbi-teal mt-0.5 flex-shrink-0" />
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
                            {t(descriptionKey)}
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
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer - Always visible */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex-shrink-0">
          <div className="flex flex-col gap-4">
            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={rejectAll}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 flex-1"
              >
                {t('consent.reject_all')}
              </Button>
              
              <Button
                onClick={acceptAll}
                className="bg-blizbi-yellow hover:bg-yellow-500 text-black font-medium flex-1"
              >
                {t('consent.accept_all')}
              </Button>

              {!showDetails ? (
                <Button
                  variant="outline"
                  onClick={() => setShowDetails(true)}
                  className="border-blizbi-teal text-blizbi-teal hover:bg-blizbi-teal/10 flex-1"
                >
                  {t('consent.customize')}
                </Button>
              ) : (
                <Button
                  onClick={handleCustomSave}
                  className="bg-blizbi-teal hover:bg-blizbi-teal/90 text-white flex-1"
                >
                  {t('consent.accept_selected')}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsentBanner; 