import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { LucideIcon, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import * as LucideIcons from "lucide-react";
import { Interest } from "@/types/interest";
import { fetchInterests } from "@/api/interests";
import { getProfileByClerkId, updateProfileInterests } from "@/api/profiles";
import InterestCard from "@/components/InterestCard";
import { useNavigate } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";
import { toast } from "sonner";
import BlizbiBlogLoader from "@/components/BlizbiBlogLoader";
import { useConsentStorage } from "@/utils/storage";

const Interests = () => {
  const { t } = useTranslation();
  const { consentStorage } = useConsentStorage();
  const language = consentStorage.functional.getItem("blizbi-language") || "no";
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAllInterests, setShowAllInterests] = useState(false);
  const [suggestedInterests, setSuggestedInterests] = useState<Interest[]>([]);
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();

  const { isLoading: isLoadingProfile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      try {
        const profile = await getProfileByClerkId(user!.id);
        console.log(profile?.interest_ids, "INTERESTS");
        if (profile?.interest_ids && profile.interest_ids.length > 0) {
          navigate("/");
        }
        return profile;
      } catch (error) {
        console.error("Error checking profile interests:", error);
        toast.error(t("errors.load_profile"));
        throw error;
      }
    },
  });

  const { data: interests = [], isLoading: isLoadingInterests } = useQuery({
    queryKey: ["interests"],
    queryFn: fetchInterests,
  });

  const handleSubmit = async () => {
    if (!user) return;

    try {
      setIsSubmitting(true);
      await updateProfileInterests(user.id, selectedInterests);
      navigate("/explore");
      toast.success(t("interests.updated"));
    } catch (error) {
      console.error("Error updating interests:", error);
      toast.error(t("errors.update_interests"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInterestToggle = (interestId: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interestId)
        ? prev.filter((id) => id !== interestId)
        : [...prev, interestId]
    );
  };

  useEffect(() => {
    if (interests.length > 0 && suggestedInterests.length === 0) {
      const shuffled = [...interests].sort(() => 0.5 - Math.random());
      setSuggestedInterests(shuffled.slice(0, 10));
    }
  }, [interests, suggestedInterests.length]);

  const groupedInterests = interests.reduce((acc, interest) => {
    const category =
      language === "no" ? interest.category_translations.no : interest.category;
    if (!acc[category]) acc[category] = [];
    acc[category].push(interest);
    return acc;
  }, {} as Record<string, Interest[]>);

  const interestsMap = interests.reduce((acc, interest) => {
    acc[interest.id] = interest;
    return acc;
  }, {} as Record<string, Interest>);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate("/explore");
    }
  }, [isLoaded, isSignedIn, navigate]);

  if (!isLoaded || !isSignedIn || !user || isLoadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <BlizbiBlogLoader />
      </div>
    );
  }

  const InterestSkeleton = () => (
    <div className="bg-gray-100 flex items-center gap-2 p-3 rounded-lg w-full">
      <Skeleton className="h-5 w-5 rounded-full bg-gray-200" />
      <Skeleton className="h-4 w-32 bg-gray-200" />
    </div>
  );

  const renderSkeletons = (count: number) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <InterestSkeleton key={i} />
        ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blizbi-purple to-white">
      <div className="py-10 w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] lg:w-[calc(100%-16rem)] xl:w-[calc(100%-20rem)] max-w-6xl mx-auto">
        <div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold mb-2">
            {t("interests.title")}
          </h1>
          <p className="text-sm sm:text-base md:text-lg mt-2 text-gray-700">
            {t("interests.description")}
          </p>
          <div className="mt-4 text-gray-600 text-sm max-w-xs">
            {t("selected")}: {selectedInterests.length}
            {selectedInterests.length < 5 && ` (${t("interests.minimum")})`}
          </div>
        </div>
        <div>
          {selectedInterests.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {selectedInterests.map((interestId) => {
                const interest = interestsMap[interestId];
                const IconComponent =
                  (LucideIcons as unknown as Record<string, LucideIcon>)[
                    interest.icon
                  ] || LucideIcons.Circle;
                const label =
                  language === "no"
                    ? interest.name_translations.no
                    : interest.name;
                return (
                  <div
                    key={interest.id}
                    className="flex items-center gap-1 bg-blizbi-teal text-white px-2 py-1 rounded-full text-sm"
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="mb-16 mt-4">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-blizbi-teal">
              {t("interests.suggested")}
            </h2>
            {isLoadingInterests ? (
              renderSkeletons(9)
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {suggestedInterests.map((interest) => (
                  <InterestCard
                    key={interest.id}
                    interest={interest}
                    selectedInterests={selectedInterests}
                    handleInterestToggle={handleInterestToggle}
                    language={language}
                  />
                ))}
              </div>
            )}
          </div>

          {!showAllInterests ? (
            <Button
              onClick={() => setShowAllInterests(true)}
              variant="outline"
              className="w-full mt-8"
              disabled={isLoadingInterests}
            >
              {t("show_all")}
            </Button>
          ) : (
            <div className="mt-8 space-y-6">
              {isLoadingInterests
                ? Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="space-y-3">
                        <Skeleton className="h-8 w-32" />
                        {renderSkeletons(6)}
                      </div>
                    ))
                : (
                    Object.entries(groupedInterests) as [string, Interest[]][]
                  ).map(([category, categoryInterests]) => (
                    <div key={category} className="space-y-3">
                      <h2 className="text-xl font-semibold text-blizbi-teal">
                        {category}
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {categoryInterests.map((interest) => (
                          <InterestCard
                            key={interest.id}
                            interest={interest}
                            selectedInterests={selectedInterests}
                            handleInterestToggle={handleInterestToggle}
                            language={language}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
              <Button
                onClick={() => setShowAllInterests(false)}
                variant="outline"
                className="w-full mt-4"
                disabled={isLoadingInterests}
              >
                {t("show_less")}
              </Button>
            </div>
          )}
        </div>
        <div className="flex items-center h-16 fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-lg">
          <div className="flex justify-end w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] lg:w-[calc(100%-16rem)] xl:w-[calc(100%-20rem)] max-w-6xl mx-auto">
            <Button
              onClick={handleSubmit}
              className="min-w-[120px]"
              disabled={selectedInterests.length < 5 || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("loading")}
                </>
              ) : (
                t("continue")
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Interests;
