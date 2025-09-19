import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/clerk-react";
import { BlizbiIcon } from "@/components/BlizbiIcon";
import { useTranslation } from "react-i18next";
import { LogIn, User } from "lucide-react";
import BlizbiBlogLoader from "@/components/BlizbiBlogLoader";
import blobSvg from "@/assets/blizbi-blob.svg";

const Welcome = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isSignedIn } = useAuth();

  useEffect(() => {
    if (isSignedIn) {
      navigate("/explore");
    }
  }, [isSignedIn, navigate]);

  if (isSignedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blizbi-purple to-white flex flex-col items-center sm:px-6 px-4">
      {/* Language Switcher */}
      <div className="w-full flex justify-end pt-4">
        {/* <LanguageSwitcher /> */}
      </div>

      <div className="w-full max-w-md flex-1 flex flex-col justify-center items-center">
        <div className="space-y-10 w-full">
          <div className="flex flex-col items-center">
            <div className="flex justify-center items-center w-full h-full">
              <img
                src={blobSvg}
                alt="Blizbi Blog Logo"
                className="w-20 h-20"
              />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mt-4">
              {t("welcome.title")}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-center mt-2 text-gray-700">
              {t("welcome.subtitle")}
            </p>
            <p className="text-center mt-4 text-gray-600 text-sm max-w-xs">
              {t("welcome.description")}
            </p>
          </div>

          <div className="w-full space-y-4">
            <Button
              className="w-full py-6 text-sm sm:text-md bg-blizbi-teal hover:bg-blizbi-teal/90"
              asChild
            >
              <Link to="/signin">
                <LogIn className="w-5 h-5" />
                {t("signin")}
              </Link>
            </Button>
            <Button
              variant="outline"
              className="w-full py-6 text-sm sm:text-md border-blizbi-teal text-blizbi-teal hover:bg-blizbi-teal/10"
              asChild
            >
              <Link to="/explore" className="flex items-center gap-2">
                <User className="w-5 h-5" />
                {t("continue.anonymous")}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
