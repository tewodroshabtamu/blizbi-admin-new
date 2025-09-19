import React from "react";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { FormInput } from "./FormInput";
import { useTranslation } from "react-i18next";

interface TagManagerProps {
  tags: string[];
  currentTag: string;
  onCurrentTagChange: (value: string) => void;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
}

export const TagManager: React.FC<TagManagerProps> = ({
  tags,
  currentTag,
  onCurrentTagChange,
  onAddTag,
  onRemoveTag,
}) => {
  const { t } = useTranslation();

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onAddTag();
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <FormInput
          value={currentTag}
          onChange={(e) => onCurrentTagChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={t("admin.new_event.add_tag_placeholder")}
          className="flex-1"
        />
        <Button
          type="button"
          onClick={onAddTag}
          variant="outline"
          size="sm"
        >
          {t("admin.new_event.add_tag_button")}
        </Button>
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <Badge
              key={index}
              className="bg-blizbi-teal/10 text-blizbi-teal border-blizbi-teal/20 flex items-center gap-1"
            >
              {tag}
              <button
                type="button"
                onClick={() => onRemoveTag(tag)}
                className="ml-1 hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}; 