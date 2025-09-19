import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Shield, Settings, ChevronDown, ChevronUp } from 'lucide-react';
import { useConsent } from '@/contexts/ConsentContext';
import ConsentManager from '@/components/privacy/ConsentManager';

const Privacy: React.FC = () => {
  const { t } = useTranslation();
  const { consentState } = useConsent();
  const [showConsentManager, setShowConsentManager] = useState(false);

  return (
    <div className="max-w-3xl mx-auto py-6 md:p-10">
      <h1 className="text-3xl md:text-4xl font-bold text-blizbi-teal mb-2">{t('privacy.title')}</h1>
      <p className="text-sm text-gray-500 mb-6">{t('privacy.last_updated')}</p>
      
      {/* Consent Management Quick Access */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-medium text-blue-900 mb-2">{t('consent.privacy.manage_button')}</h3>
            <p className="text-sm text-blue-700 mb-3">
              {t('consent.privacy.detailed_description')}
            </p>
            
            {consentState?.timestamp && (
              <p className="text-xs text-blue-600 mb-3">
                {t('consent.privacy.last_updated')} {new Date(consentState.timestamp).toLocaleDateString()}
              </p>
            )}
            
            <Button
              onClick={() => setShowConsentManager(!showConsentManager)}
              className="bg-blizbi-teal hover:bg-blizbi-teal/90 text-white flex items-center gap-2"
              size="sm"
            >
              <Settings className="w-4 h-4" />
              {showConsentManager ? t('consent.privacy.hide_button') : t('consent.privacy.manage_button')}
              {showConsentManager ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Consent Manager Panel */}
      {showConsentManager && (
        <div className="mb-8">
          <ConsentManager />
        </div>
      )}

      <p className="mb-8">{t('privacy.intro')}</p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-blizbi-teal mb-2">{t('privacy.data_controller.title')}</h2>
        <p>
          {t('privacy.data_controller.company')}<br />
          {t('privacy.data_controller.contact_person')}<br />
          {t('privacy.data_controller.email')}
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-blizbi-teal mb-2">{t('privacy.data_collection.title')}</h2>
        <p>{t('privacy.data_collection.intro')}</p>
        <ul className="list-disc list-inside ml-4 mt-2">
          <li>{t('privacy.data_collection.identification')}</li>
          <li>{t('privacy.data_collection.location')}</li>
          <li>{t('privacy.data_collection.usage')}</li>
          <li>{t('privacy.data_collection.technical')}</li>
          <li>{t('privacy.data_collection.settings')}</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-blizbi-teal mb-2">{t('privacy.data_processing.title')}</h2>
        <p>{t('privacy.data_processing.intro')}</p>
        <ul className="list-disc list-inside ml-4 mt-2">
          <li>{t('privacy.data_processing.personalization')}</li>
          <li>{t('privacy.data_processing.improvement')}</li>
          <li>{t('privacy.data_processing.insights')}</li>
          <li>{t('privacy.data_processing.stakeholders')}</li>
        </ul>
        <p className="mt-2">{t('privacy.data_processing.no_advertising')}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-blizbi-teal mb-2">{t('privacy.legal_basis.title')}</h2>
        <p>{t('privacy.legal_basis.intro')}</p>
        <ul className="list-disc list-inside ml-4 mt-2">
          <li>{t('privacy.legal_basis.consent')}</li>
          <li>{t('privacy.legal_basis.legitimate_interest')}</li>
          <li>{t('privacy.legal_basis.legal_obligation')}</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-blizbi-teal mb-2">{t('privacy.data_sharing.title')}</h2>
        <p>{t('privacy.data_sharing.intro')}</p>
        <ul className="list-disc list-inside ml-4 mt-2">
          <li>{t('privacy.data_sharing.authorities')}</li>
          <li>{t('privacy.data_sharing.research')}</li>
        </ul>
        <p className="mt-2">{t('privacy.data_sharing.providers_intro')}</p>
        <p className="mt-2">{t('privacy.data_sharing.dashboard_info')}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-blizbi-teal mb-2">{t('privacy.data_retention.title')}</h2>
        <p>{t('privacy.data_retention.description')}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-blizbi-teal mb-2">{t('privacy.user_rights.title')}</h2>
        <p>{t('privacy.user_rights.intro')}</p>
        <ul className="list-disc list-inside ml-4 mt-2">
          <li>{t('privacy.user_rights.access')}</li>
          <li>{t('privacy.user_rights.correction')}</li>
          <li>{t('privacy.user_rights.restriction')}</li>
          <li>{t('privacy.user_rights.withdraw')}</li>
          <li>{t('privacy.user_rights.portability')}</li>
          <li>
            {t('privacy.user_rights.complaint')}{' '}
            <a href={`https://${t('privacy.user_rights.complaint_url')}`} target="_blank" rel="noopener noreferrer" className="text-blizbi-teal underline">
              {t('privacy.user_rights.complaint_url')}
            </a>
          </li>
        </ul>
        <p className="mt-2">{t('privacy.user_rights.access_note')}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-blizbi-teal mb-2">{t('privacy.policy_changes.title')}</h2>
        <p>
          {t('privacy.policy_changes.description')}{' '}
          <a href={`https://${t('privacy.policy_changes.url')}`} target="_blank" rel="noopener noreferrer" className="text-blizbi-teal underline">
            {t('privacy.policy_changes.url')}
          </a>
        </p>
      </section>
    </div>
  );
};

export default Privacy;
