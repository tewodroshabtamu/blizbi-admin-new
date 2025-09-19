import blobSvg from "../assets/blizbi-blob.svg";
import { useTranslation } from "react-i18next";


const FeatureComingSoon = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh)] gap-6">
      <div className="w-32 h-32 mb-2">
        <img src={blobSvg} alt="Blizbi Blob" className="w-full h-full animate-blob-spin-slow" />
      </div>
      <h1 className="text-xl sm:text-2xl font-bold text-center">
        {t("coming_soon.title")}
      </h1>
      <p className="text-center text-gray-600 max-w-md">
        {t("coming_soon.description")}
      </p>
    </div>
  );
};

export default FeatureComingSoon;
