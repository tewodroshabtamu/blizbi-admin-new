import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  MessageCircle, 
  Mail, 
  Book, 
  ChevronDown, 
  ChevronUp, 
  Search,
  Users,
  Shield,
  Settings,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSection {
  title: string;
  icon: React.ReactNode;
  items: FAQItem[];
}

const Support: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const faqSections: FAQSection[] = [
    {
      title: t('support.getting_started.title', 'Getting Started'),
      icon: <Book className="w-5 h-5" />,
      items: [
        {
          question: t('support.getting_started.how_to_start', 'How do I get started with Blizbi?'),
          answer: t('support.getting_started.how_to_start_answer', 'Welcome to Blizbi! Start by signing up for an account, then set your interests to get personalized event recommendations. You can browse events, bookmark favorites, and use our AI assistant for help.')
        },
        {
          question: t('support.getting_started.create_account', 'Do I need to create an account?'),
          answer: t('support.getting_started.create_account_answer', 'While you can browse events as a guest, creating an account unlocks features like bookmarking events, personalized recommendations, chat history, and customized settings.')
        },
        {
          question: t('support.getting_started.find_events', 'How do I find events I\'m interested in?'),
          answer: t('support.getting_started.find_events_answer', 'Use the Explore page to discover events, or use the Search feature to find specific activities. Set your interests in your profile for personalized recommendations, and browse events by date using the calendar view.')
        }
      ]
    },
    {
      title: t('support.events.title', 'Events & Bookmarks'),
      icon: <Users className="w-5 h-5" />,
      items: [
        {
          question: t('support.events.bookmark_events', 'How do I bookmark events?'),
          answer: t('support.events.bookmark_events_answer', 'Click the bookmark icon on any event card or event details page. Bookmarked events are saved to your Bookmarked page where you can view them organized by date.')
        },
        {
          question: t('support.events.event_details', 'How do I see more details about an event?'),
          answer: t('support.events.event_details_answer', 'Click on any event card to view the full event details page. Here you\'ll find complete information about the event, organizer details, location, pricing, and additional resources.')
        },
        {
          question: t('support.events.add_calendar', 'Can I add events to my calendar?'),
          answer: t('support.events.add_calendar_answer', 'Yes! On the event details page, click "Add to Google Calendar" to automatically add the event to your Google Calendar with all the event information.')
        }
      ]
    },
    {
      title: t('support.account.title', 'Account & Settings'),
      icon: <Settings className="w-5 h-5" />,
      items: [
        {
          question: t('support.account.change_language', 'How do I change the language?'),
          answer: t('support.account.change_language_answer', 'Go to Settings and select your preferred language from the Language Selector. Blizbi supports English and Norwegian. Your language preference is saved for future visits.')
        },
        {
          question: t('support.account.manage_interests', 'How do I update my interests?'),
          answer: t('support.account.manage_interests_answer', 'Visit your Profile page and click "Edit" next to your interests. Select at least 5 interests to get the best personalized recommendations. You can update these anytime.')
        },
        {
          question: t('support.account.delete_account', 'How do I delete my account?'),
          answer: t('support.account.delete_account_answer', 'Currently, account deletion needs to be requested through our support team. Contact us at kontakt@blizbi.no with your account details, and we\'ll help you with the process.')
        }
      ]
    },
    {
      title: t('support.chat.title', 'Blizbi Assistant'),
      icon: <MessageCircle className="w-5 h-5" />,
      items: [
        {
          question: t('support.chat.how_to_use', 'How do I use the Blizbi Assistant?'),
          answer: t('support.chat.how_to_use_answer', 'Click on the Chat tab to start a conversation with our AI assistant. Ask about events, get recommendations, or request help with planning activities. The assistant can help you find events based on your preferences.')
        },
        {
          question: t('support.chat.clear_history', 'How do I clear my chat history?'),
          answer: t('support.chat.clear_history_answer', 'In the chat interface, look for the "Clear chat history" option. This will permanently delete your conversation history and cannot be undone.')
        },
        {
          question: t('support.chat.privacy', 'Is my chat data private?'),
          answer: t('support.chat.privacy_answer', 'Yes, your chat conversations are private and secure. We use your chat data only to provide personalized assistance. Check our Privacy Policy for detailed information about data handling.')
        }
      ]
    },
    {
      title: t('support.privacy.title', 'Privacy & Security'),
      icon: <Shield className="w-5 h-5" />,
      items: [
        {
          question: t('support.privacy.data_usage', 'How is my data used?'),
          answer: t('support.privacy.data_usage_answer', 'We use your data to provide personalized event recommendations, save your preferences, and improve our service. We never sell your personal information. See our Privacy Policy for complete details.')
        },
        {
          question: t('support.privacy.cookies', 'What cookies does Blizbi use?'),
          answer: t('support.privacy.cookies_answer', 'We use essential cookies for functionality, functional cookies for preferences, analytics cookies for improvements, and personalization cookies for recommendations. You can manage your cookie preferences in our consent banner.')
        },
        {
          question: t('support.privacy.data_deletion', 'Can I request my data to be deleted?'),
          answer: t('support.privacy.data_deletion_answer', 'Yes, you have the right to request deletion of your personal data. Contact our support team at kontakt@blizbi.no with your request, and we\'ll process it according to applicable privacy laws.')
        }
      ]
    },
    {
      title: t('support.technical.title', 'Technical Issues'),
      icon: <HelpCircle className="w-5 h-5" />,
      items: [
        {
          question: t('support.technical.loading_issues', 'Events or pages won\'t load properly'),
          answer: t('support.technical.loading_issues_answer', 'Try refreshing the page or clearing your browser cache. Check your internet connection. If the problem persists, try using a different browser or contact support with details about the issue.')
        },
        {
          question: t('support.technical.mobile_issues', 'The app doesn\'t work well on mobile'),
          answer: t('support.technical.mobile_issues_answer', 'Blizbi is optimized for mobile devices. Try updating your browser, clearing cache, or switching to a different mobile browser. Contact support if you continue experiencing issues.')
        },
        {
          question: t('support.technical.browser_support', 'Which browsers are supported?'),
          answer: t('support.technical.browser_support_answer', 'Blizbi works best on modern browsers including Chrome, Firefox, Safari, and Edge. Make sure your browser is updated to the latest version for the best experience.')
        }
      ]
    }
  ];

  const filteredSections = !searchTerm.trim() 
    ? faqSections 
    : faqSections.map(section => ({
        ...section,
        items: section.items.filter(item => 
          item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })).filter(section => section.items.length > 0);

  const QuickActionCard = ({ icon, title, description, action }: {
    icon: React.ReactNode;
    title: string;
    description: string;
    action: () => void;
  }) => (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={action}>
      <CardContent className="p-6 text-center">
        <div className="flex justify-center mb-4 text-blizbi-teal">
          {icon}
        </div>
        <h3 className="font-semibold mb-2">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );

  const FAQItem = ({ item, sectionIndex, itemIndex }: {
    item: FAQItem;
    sectionIndex: number;
    itemIndex: number;
  }) => {
    const id = `faq-${sectionIndex}-${itemIndex}`;
    const isExpanded = expandedItems.includes(id);

    return (
      <div className="border-b border-gray-200 last:border-b-0">
        <button
          className="w-full py-4 px-0 text-left flex justify-between items-center hover:text-blizbi-teal transition-colors"
          onClick={() => toggleExpanded(id)}
        >
          <span className="font-medium pr-4">{item.question}</span>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 flex-shrink-0" />
          ) : (
            <ChevronDown className="w-5 h-5 flex-shrink-0" />
          )}
        </button>
        {isExpanded && (
          <div className="pb-4 text-gray-600 leading-relaxed whitespace-pre-line">
            {item.answer}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {t('support.title', 'Help & Support')}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('support.subtitle', 'Find answers to common questions or get in touch with our support team')}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <QuickActionCard
            icon={<MessageCircle className="w-8 h-8" />}
            title={t('support.quick_actions.chat_title', 'Chat with Blizbi')}
            description={t('support.quick_actions.chat_description', 'Get instant help from our AI assistant')}
            action={() => window.location.href = '/chat'}
          />
          <QuickActionCard
            icon={<Mail className="w-8 h-8" />}
            title={t('support.quick_actions.email_title', 'Email Support')}
            description={t('support.quick_actions.email_description', 'Contact our support team directly')}
            action={() => {
              const contactSection = document.getElementById('contact-support');
              contactSection?.scrollIntoView({ behavior: 'smooth' });
            }}
          />
          <QuickActionCard
            icon={<Book className="w-8 h-8" />}
            title={t('support.quick_actions.guide_title', 'Getting Started')}
            description={t('support.quick_actions.guide_description', 'Learn how to use Blizbi effectively')}
            action={() => {
              const gettingStarted = document.getElementById('getting-started');
              gettingStarted?.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder={t('support.search_placeholder', 'Search help articles...')}
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-8">
          {filteredSections.map((section, sectionIndex) => (
            <Card key={sectionIndex} id={sectionIndex === 0 ? 'getting-started' : undefined}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="text-blizbi-teal">{section.icon}</span>
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-0">
                  {section.items.map((item, itemIndex) => (
                    <FAQItem
                      key={itemIndex}
                      item={item}
                      sectionIndex={sectionIndex}
                      itemIndex={itemIndex}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Section */}
        <Card className="mt-12" id="contact-support">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-blizbi-teal" />
              {t('support.contact.title', 'Contact Support')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">{t('support.contact.general_title', 'General Support')}</h4>
                <p className="text-gray-600 mb-4">{t('support.contact.general_description', 'Need help? Have questions? We\'re here to help you get the most out of Blizbi.')}</p>
                <Button variant="outline" asChild>
                  <a href="mailto:kontakt@blizbi.no" className="inline-flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    kontakt@blizbi.no
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              </div>
              <div>
                <h4 className="font-semibold mb-2">{t('support.contact.response_title', 'Response Time')}</h4>
                <p className="text-gray-600 mb-2">{t('support.contact.response_time', 'We typically respond within 24 hours')}</p>
                <p className="text-sm text-gray-500">{t('support.contact.business_hours', 'Monday - Friday, 9:00 AM - 5:00 PM (CET)')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Support;