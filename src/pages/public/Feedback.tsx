import React from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, MessageCircle, Heart, Lightbulb, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

const Feedback: React.FC = () => {
  const { t } = useTranslation();

  const feedbackTopics = [
    {
      icon: <CheckCircle className="w-5 h-5" />,
      text: t('feedback.topics.0')
    },
    {
      icon: <Lightbulb className="w-5 h-5" />,
      text: t('feedback.topics.1')
    },
    {
      icon: <Heart className="w-5 h-5" />,
      text: t('feedback.topics.2')
    },
    {
      icon: <MessageCircle className="w-5 h-5" />,
      text: t('feedback.topics.3')
    }
  ];

  const handleEmailClick = () => {
    window.location.href = `mailto:${t('feedback.contact_email')}`;
  };

  return (
    <div className="min-h-screen from-blizbi-teal/5 to-blizbi-yellow/5">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blizbi-teal/10 rounded-full mb-6">
            <MessageCircle className="w-8 h-8 text-blizbi-teal" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('feedback.title')}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {t('feedback.subtitle')}
          </p>
        </div>

        {/* Description Card */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm border-blizbi-teal/20">
          <CardContent className="p-6">
            <p className="text-gray-700 leading-relaxed text-center">
              {t('feedback.description')}
            </p>
          </CardContent>
        </Card>

        {/* Topics Section */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm border-blizbi-teal/20">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-blizbi-teal text-center">
              {t('feedback.topics_title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {feedbackTopics.map((topic, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-r from-blizbi-teal/5 to-blizbi-yellow/5 border border-blizbi-teal/10 hover:border-blizbi-teal/20 transition-all duration-200"
                >
                  <div className="flex-shrink-0 mt-0.5 text-blizbi-teal">
                    {topic.icon}
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {topic.text}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card className="bg-gradient-to-r from-blizbi-teal/10 to-blizbi-yellow/10 border-blizbi-teal/30">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-blizbi-teal text-center flex items-center justify-center gap-2">
              <Mail className="w-5 h-5" />
              {t('feedback.contact_title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="mb-6">
              <Button
                onClick={handleEmailClick}
                className="bg-blizbi-teal hover:bg-blizbi-teal/90 text-white px-8 py-3 text-lg font-medium rounded-lg transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Mail className="w-5 h-5 mr-2" />
                {t('feedback.contact_email')}
              </Button>
            </div>
            <p className="text-gray-600 leading-relaxed">
              {t('feedback.contact_description')}
            </p>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            {t('feedback.navigation')} • {t('feedback.title')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
