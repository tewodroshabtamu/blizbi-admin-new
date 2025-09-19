import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { toast } from "sonner";
import { Interest } from "@/types/interest";
import InterestCard from "./InterestCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslation } from "react-i18next";
import { useConsentStorage } from "@/utils/storage";

// Create Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

interface InterestsModalProps {
  isOpen: boolean;
  onClose: () => void;
  interests: Interest[];
  userInterests: string[];
  userId: string;
  onUpdate: (newInterests: string[]) => void;
}

const InterestsModal: React.FC<InterestsModalProps> = ({
  isOpen,
  onClose,
  interests,
  userInterests,
  userId,
  onUpdate,
}) => {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { consentStorage } = useConsentStorage();
  // Use consent-aware storage for language preference
  const language = consentStorage.functional.getItem("blizbi-language") || "en";
  const { t } = useTranslation();

  // Reset selected interests when modal opens or userInterests change
  useEffect(() => {
    if (isOpen) {
      setSelectedInterests(userInterests);
    }
  }, [isOpen, userInterests]);

  const handleInterestToggle = (interestId: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interestId)
        ? prev.filter((id) => id !== interestId)
        : [...prev, interestId]
    );
  };

  const handleCancel = () => {
    setSelectedInterests(userInterests);
    onClose();
  };

  const handleUpdate = async () => {
    try {
      setIsSubmitting(true);

      onUpdate(selectedInterests);

      const { error } = await supabase
        .from("profiles")
        .update({
          interest_ids: selectedInterests,
        })
        .eq("clerk_id", userId);

      if (error) throw error;

      toast.success(t("success"), {
        description: t("interests.updated"),
      });
      onClose();
    } catch (error) {
      toast.error(t("error"), {
        description: t("error.something_went_wrong"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const groupedInterests = interests.reduce<Record<string, Interest[]>>(
    (acc, interest) => {
      const category =
        language === "no"
          ? interest.category_translations.no
          : interest.category;
      if (!acc[category]) acc[category] = [];
      acc[category].push(interest);
      return acc;
    },
    {}
  );

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(isOpen: boolean) => !isOpen && handleCancel()}
    >
      <DialogContent className="max-w-2xl h-[80vh] p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="text-blizbi-teal">
            {t("profile.interests.title")}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-full px-6">
          <div className="space-y-4 pb-6">
            <p className="text-gray-600">{t("interests.description")}</p>
            <div className="text-sm text-gray-500">
              {t("selected")}: {selectedInterests.length}
              {selectedInterests.length < 5 && ` (${t("interests.minimum")})`}
            </div>

            {selectedInterests.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {interests
                  .filter((interest) => selectedInterests.includes(interest.id))
                  .map((interest) => {
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

            <div className="space-y-6">
              {Object.entries(groupedInterests).map(
                ([category, categoryInterests]) => (
                  <div key={category} className="space-y-3">
                    <h2 className="text-xl font-semibold text-blizbi-teal">
                      {category}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                )
              )}
            </div>
          </div>
        </ScrollArea>

        <div className="flex justify-end gap-3 p-6 border-t">
          <Button variant="outline" onClick={handleCancel}>
            {t("cancel")}
          </Button>
          <Button
            onClick={handleUpdate}
            disabled={selectedInterests.length < 5 || isSubmitting}
          >
            {isSubmitting ? t("loading") : t("update")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InterestsModal;
