import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Lock, Settings, Trash2, UserX } from 'lucide-react';
import { useConsent } from '@/contexts/ConsentContext';
import ConsentManager from '@/components/privacy/ConsentManager';

const DataSettings: React.FC = () => {
  const { t } = useTranslation();
  const { resetConsent, requestDataDeletion } = useConsent();
  const [showConsentManager, setShowConsentManager] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  const handleWithdrawConsent = () => {
    resetConsent();
    // Show success message or redirect
    alert(t('consent.in_app_settings.button_states.consent_withdrawn'));
  };

  const handleDeleteData = async () => {
    if (!confirm(t('consent.in_app_settings.confirmations.delete_confirm'))) {
      return;
    }

    setIsDeleting(true);
    setDeleteStatus(null);

    try {
      const result = await requestDataDeletion();
      setDeleteStatus(result);
    } catch (error) {
      setDeleteStatus({
        success: false,
        message: t('consent.in_app_settings.button_states.error_occurred')
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6 md:p-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Lock className="w-8 h-8 text-blizbi-teal" />
        <h1 className="text-3xl md:text-4xl font-bold text-blizbi-teal">
          {t('consent.in_app_settings.title')}
        </h1>
      </div>

      {/* Description */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <p className="text-gray-700 leading-relaxed">
          {t('consent.in_app_settings.description')}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="space-y-4 mb-8">
        {/* Change Settings Button */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start gap-4">
            <Settings className="w-6 h-6 text-blizbi-teal mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">
                {t('consent.in_app_settings.buttons.change_settings')}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {t('consent.in_app_settings.descriptions.change_settings')}
              </p>
              <Button
                onClick={() => setShowConsentManager(!showConsentManager)}
                className="bg-blizbi-teal hover:bg-blizbi-teal/90 text-white"
              >
                {showConsentManager ? t('consent.in_app_settings.button_states.hide_settings') : t('consent.in_app_settings.buttons.change_settings')}
              </Button>
              
              {/* Consent Manager Panel - appears right under the button */}
              {showConsentManager && (
                <div className="mt-6">
                  <ConsentManager />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Withdraw Consent Button */}
        <div className="bg-white rounded-lg border border-orange-200 p-6">
          <div className="flex items-start gap-4">
            <UserX className="w-6 h-6 text-orange-600 mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">
                {t('consent.in_app_settings.buttons.withdraw_consent')}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {t('consent.in_app_settings.descriptions.withdraw_consent')}
              </p>
              <Button
                onClick={handleWithdrawConsent}
                variant="outline"
                className="border-orange-300 text-orange-700 hover:bg-orange-50"
              >
                {t('consent.in_app_settings.buttons.withdraw_consent')}
              </Button>
            </div>
          </div>
        </div>

        {/* Delete Data Button */}
        <div className="bg-white rounded-lg border border-red-200 p-6">
          <div className="flex items-start gap-4">
            <Trash2 className="w-6 h-6 text-red-600 mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">
                {t('consent.in_app_settings.buttons.delete_data')}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {t('consent.in_app_settings.descriptions.delete_data')}
              </p>
              
              {deleteStatus && (
                <div className={`mb-4 p-3 rounded text-sm ${deleteStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {deleteStatus.message}
                </div>
              )}
              
              <Button
                onClick={handleDeleteData}
                disabled={isDeleting}
                variant="destructive"
                className="bg-red-600 hover:bg-red-700"
              >
                {isDeleting ? t('consent.in_app_settings.button_states.deleting') : t('consent.in_app_settings.buttons.delete_data')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataSettings; 