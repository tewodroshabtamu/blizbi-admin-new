import { Link } from "react-router-dom";
import blobSvg from "../assets/blizbi-blob.svg";
import { LogIn } from "lucide-react";
import { useTranslation } from "react-i18next";


const MustSignIn = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] gap-6">
      <div className="w-32 h-32 mb-2">
        <img src={blobSvg} alt="Blizbi Blob" className="w-full h-full" />
      </div>
      <h1 className="text-xl sm:text-2xl font-bold text-center">
        {t("must_sign_in.title")}
      </h1>
      <p className="text-center text-gray-600 max-w-md">
        {t("must_sign_in.description")}
      </p>
      <Link to="/signin" className="w-fit">
        <button className="flex items-center gap-2 text-blizbi-teal/80 hover:text-blizbi-teal bg-blizbi-yellow rounded-full py-2 px-4 h-11">
          <LogIn className="w-5 h-5" />
          <span className="text-md font-medium">{t("signin")}</span>
        </button>
      </Link>
    </div>
  );
};

export default MustSignIn;
