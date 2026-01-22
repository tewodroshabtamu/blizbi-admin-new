import { Upload } from "lucide-react";
import { useTranslation } from "react-i18next";

const ImageUpload: React.FC<ImageUploadProps> = ({
  imagePreview,
  onImageChange,
}) => {
  const { t } = useTranslation();
  
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <label
        htmlFor="image-upload"
        className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
      >
        <div className="flex flex-col items-center justify-center w-full h-full">
          {imagePreview ? (
            <div className="relative w-full h-full overflow-hidden rounded-lg">
              <img
                src={imagePreview}
                alt={t("admin.new_event.image_preview")}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          ) : (
            <>
              <Upload className="w-8 h-8 mb-4 text-gray-500" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">{t("admin.new_event.click_to_upload")}</span> {t("admin.new_event.drag_and_drop")}
              </p>
              <p className="text-xs text-gray-500">
                {t("admin.new_event.image_formats")}
              </p>
            </>
          )}
        </div>
        <input
          id="image-upload"
          type="file"
          className="hidden"
          accept="image/*"
          onChange={onImageChange}
        />
      </label>
    </div>
  );
};

interface ImageUploadProps {
  imagePreview: string | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default ImageUpload;
