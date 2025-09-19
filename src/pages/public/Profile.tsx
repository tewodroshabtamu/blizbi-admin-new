import React, { useEffect, useState } from "react";
import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import InterestsModal from "@/components/InterestsModal";
import { Interest } from "@/types/interest";
import { createClient } from "@supabase/supabase-js";
import * as LucideIcons from "lucide-react";
import { useTranslation } from "react-i18next";
import { useConsentStorage } from "@/utils/storage";
import { Button } from "@/components/ui/button";
import { Shield, Settings, ChevronRight } from "lucide-react";
import { useConsent } from "@/contexts/ConsentContext";
import ConsentManager from "@/components/privacy/ConsentManager";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const Profile: React.FC = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();
  const [isInterestsModalOpen, setIsInterestsModalOpen] = useState(false);
  const [userInterests, setUserInterests] = useState<string[]>([]);
  const [allInterests, setAllInterests] = useState<Interest[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<Interest[]>([]);
  const [showPrivacySettings, setShowPrivacySettings] = useState(false);
  const { consentStorage } = useConsentStorage();
  const language = consentStorage.functional.getItem("blizbi-language") || "no";
  const { t } = useTranslation();
  const { consentState } = useConsent();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate("/explore");
    }
  }, [isLoaded, isSignedIn, navigate]);

  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const { data: interests, error: interestsError } = await supabase
          .from("interests")
          .select("*");

        if (interestsError) throw interestsError;
        setAllInterests(interests || []);

        if (user) {
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("interest_ids")
            .eq("clerk_id", user.id)
            .single();

          if (profileError) throw profileError;

          const userInterestIds = profile?.interest_ids || [];
          setUserInterests(userInterestIds);

          const selectedInterests =
            interests?.filter((interest) =>
              userInterestIds.includes(interest.id)
            ) || [];
          setSelectedInterests(selectedInterests);
        }
      } catch (error) {
        console.error("Error fetching interests:", error);
      }
    };

    if (isLoaded && isSignedIn) {
      fetchInterests();
    }
  }, [isLoaded, isSignedIn, user]);

  const handleInterestsUpdate = (newInterests: string[]) => {
    setUserInterests(newInterests);
    const selected = allInterests.filter((interest) =>
      newInterests.includes(interest.id)
    );
    setSelectedInterests(selected);
  };

  if (!isLoaded || !isSignedIn || !user) {
    return null;
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] lg:w-[calc(100%-16rem)] xl:w-[calc(100%-20rem)] max-w-4xl mx-auto pt-10 relative">
        <div className="flex flex-col items-center space-y-4">
          <img
            src={user.imageUrl}
            alt={user.fullName || "Profile"}
            className="w-28 h-28 rounded-full border-2 border-yellow-300 object-cover shadow-md"
          />
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800">
              {user.fullName}
            </h2>
            <span className="text-gray-600">
              {user.primaryEmailAddress?.emailAddress}
            </span>
          </div>
        </div>

        {/* Privacy Settings Quick Access */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow divide-y divide-neutral-100 overflow-hidden">
            <div className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-5 h-5 text-blizbi-teal" />
                <h3 className="font-medium text-gray-900">{t('consent.privacy.section_title')}</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                {t('consent.privacy.section_description')}
              </p>
              
              {consentState?.timestamp && (
                <p className="text-xs text-gray-500 mb-3">
                  {t('consent.privacy.last_updated')} {new Date(consentState.timestamp).toLocaleDateString()}
                </p>
              )}
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPrivacySettings(!showPrivacySettings)}
                  className="flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  {showPrivacySettings ? t('consent.privacy.hide_button') : t('consent.privacy.manage_button')}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Settings Panel */}
        {showPrivacySettings && (
          <div className="mt-6">
            <ConsentManager />
          </div>
        )}

        <div className="mt-10">
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-semibold text-gray-800">
              {t("profile.your_interests")}
            </span>
            <button
              className="text-blizbi-teal font-medium hover:underline"
              onClick={() => setIsInterestsModalOpen(true)}
            >
              {t("edit")}
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-2">
            {selectedInterests.map((interest) => {
              const IconComponent =
                (LucideIcons as unknown as Record<string, LucideIcon>)[
                  interest.icon
                ] || LucideIcons.Circle;
              return (
                <Card
                  key={interest.id}
                  className="flex flex-col items-center justify-center gap-2 py-4 bg-blizbi-teal text-yellow-200 font-medium text-sm rounded-xl shadow  border-none"
                >
                  <IconComponent className="w-6 h-6" />
                  <span>
                    {language === "no"
                      ? interest.name_translations.no
                      : interest.name}
                  </span>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      <InterestsModal
        isOpen={isInterestsModalOpen}
        onClose={() => setIsInterestsModalOpen(false)}
        interests={allInterests}
        userInterests={userInterests}
        userId={user.id}
        onUpdate={handleInterestsUpdate}
      />
    </div>
  );
};

export default Profile;
