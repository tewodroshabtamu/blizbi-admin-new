import React from 'react';
import { useTranslation } from 'react-i18next';

const About: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-3xl mx-auto py-6 md:p-10">
      <h1 className="text-3xl md:text-4xl font-bold text-blizbi-teal mb-2">
        {t('about.title')}
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        {t('about.founded')}
      </p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-blizbi-teal mb-2">
          {t('about.history.title')}
        </h2>
        <p className="mb-4">
          {t('about.history.paragraph1')}
        </p>
        <p>
          {t('about.history.paragraph2')}
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-blizbi-teal mb-2">
          {t('about.mission.title')}
        </h2>
        <p className="mb-4">
          {t('about.mission.paragraph')}
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-blizbi-teal mb-2">
          {t('about.team.title')}
        </h2>
        <p className="mb-4">
          {t('about.team.paragraph1')}
        </p>
        <p>
          {t('about.team.paragraph2')}
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-blizbi-teal mb-2">
          {t('about.contact.title')}
        </h2>
        <p>
          {t('about.contact.description')}{' '}
          <a href="mailto:contact@blizbi.no" className="text-blizbi-teal underline">
            {t('about.contact.email')}
          </a>{' '}
          {t('about.contact.website_text')}{' '}
          <a href="https://www.blizbi.no" target="_blank" rel="noopener noreferrer" className="text-blizbi-teal underline">
            {t('about.contact.website_url')}
          </a>
        </p>
      </section>
    </div>
  );
};

export default About;
