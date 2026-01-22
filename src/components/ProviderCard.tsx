import blobSvg from '../assets/blizbi-blob.svg';
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui";
import { useTranslation } from "react-i18next";

interface ProviderCardProps {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
}

const ProviderCard: React.FC<ProviderCardProps> = ({
  id,
  imageUrl,
  title,
  description,

}) => {
  const { t } = useTranslation();
  return (
    <Link
      to={`/providers/${id}`}
      className="block relative w-full h-[300px] rounded-lg overflow-hidden hover:scale-[1.01] active:scale-[0.98] transition-transform"
    >
      <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex justify-between items-end">
        <div>
          <h3 className="text-white text-xl font-semibold mb-1">{title}</h3>
          <p className="text-white/90 text-sm">{description}</p>
        </div>
      </div>

      <div className="absolute right-2 top-2 ml-8">
        <Button variant="outline" className="bg-yellow-500 text-blizbi-teal border-none pointer-events-none" >
          <span>{t("see_provider")}</span>
          <div className="flex justify-center items-center w-full h-full max-h-[50px]">
            <img
              src={blobSvg}
              alt="Loading..."
              className="w-6 h-6 animate-blob-spin text-white"
            />
          </div>
        </Button>
      </div>
    </Link>
  );
};

export default ProviderCard;
