import React from 'react';
import { useTranslation } from 'react-i18next';

const TermsOfUse: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-3xl mx-auto py-6 md:p-10">
      <h1 className="text-3xl md:text-4xl font-bold text-blizbi-teal mb-2">{t('terms.title')}</h1>
      <p className="text-sm text-gray-500 mb-6">{t('terms.last_updated')}</p>
      
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-blizbi-teal mb-2">{t('terms.welcome.title')}</h2>
        <p className="mb-4">{t('terms.welcome.description')}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-blizbi-teal mb-2">{t('terms.what_we_do.title')}</h2>
        <p>{t('terms.what_we_do.description')}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-blizbi-teal mb-2">{t('terms.partners.title')}</h2>
        <p>{t('terms.partners.description')}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-blizbi-teal mb-2">{t('terms.user_responsibility.title')}</h2>
        <p>{t('terms.user_responsibility.description')}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-blizbi-teal mb-2">{t('terms.copyright.title')}</h2>
        <p>
          {t('terms.copyright.description')}{' '}
          <a href={`mailto:${t('terms.copyright.email')}`} className="text-blizbi-teal underline">
            {t('terms.copyright.email')}
          </a>.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-blizbi-teal mb-2">{t('terms.your_data.title')}</h2>
        <p>{t('terms.your_data.description')}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-blizbi-teal mb-2">{t('terms.transparency.title')}</h2>
        <p>{t('terms.transparency.intro')}</p>
        <ul className="list-disc list-inside ml-4 mt-2">
          <li>{t('terms.transparency.show_source')}</li>
          <li>{t('terms.transparency.link_back')}</li>
          <li>{t('terms.transparency.no_copy')}</li>
          <li>{t('terms.transparency.respect_guidelines')}</li>
          <li>{t('terms.transparency.listen_concerns')}</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-blizbi-teal mb-2">{t('terms.changes.title')}</h2>
        <p>
          {t('terms.changes.description')}{' '}
          <a href={`https://${t('terms.changes.url')}`} target="_blank" rel="noopener noreferrer" className="text-blizbi-teal underline">
            {t('terms.changes.url')}
          </a>.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-blizbi-teal mb-2">{t('terms.organizers.title')}</h2>
        <p>{t('terms.organizers.description')}</p>
      </section>
    </div>
  );
};

export default TermsOfUse;
