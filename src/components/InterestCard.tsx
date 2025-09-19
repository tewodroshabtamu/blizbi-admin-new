import { cn } from "@/lib/utils";
import { Interest } from "@/types/interest";
import { LucideIcon } from "lucide-react";
import * as LucideIcons from "lucide-react";

const InterestCard = ({
  interest,
  selectedInterests,
  handleInterestToggle,
  language,
}: InterestCardProps) => {
  const IconComponent =
    (LucideIcons as unknown as Record<string, LucideIcon>)[interest.icon] ||
    LucideIcons.Circle;
  const isSelected = selectedInterests.includes(interest.id);
  let label = interest.name;

  if (language === "no") {
    label = interest.name_translations["no"];
  }

  return (
    <button
      onClick={() => handleInterestToggle(interest.id)}
      className={cn(
        "flex items-center gap-2 p-2 rounded-lg transition-all w-full",
        "border-2 hover:border-blizbi-teal",
        isSelected
          ? "bg-blizbi-teal text-white border-blizbi-teal"
          : "bg-white border-gray-200"
      )}
    >
      <IconComponent className="w-4 h-4" />
      <span className="text-left text-sm sm:text-base">{label}</span>
    </button>
  );
};

interface InterestCardProps {
  interest: Interest;
  selectedInterests: string[];
  handleInterestToggle: (interestId: string) => void;
  language: string;
}

export default InterestCard;
