"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { InfoIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function BetaBanner() {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <div className="bg-blizbi-yellow text-black px-4 flex items-center justify-center py-1">
      <div className="flex items-center gap-2 mr-1">
        <InfoIcon className="w-4 h-4" />
        <span className="text-sm border-b border-b-transparent">
          {t("beta_banner.title")}
        </span>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button
            onClick={() => setOpen(true)}
            className="text-sm text-blizbi-teal border-b border-transparent hover:border-blizbi-teal"
          >
            {t("learn_more")}
          </button>
        </DialogTrigger>
        <DialogContent className="w-[calc(100%-2rem)] md:w-[500px] p-6 rounded-md">
          <DialogHeader>
            <DialogTitle className="text-xl mb-2">
              {t("beta_program.title")}
            </DialogTitle>
            <DialogDescription className="text-base">
              {t("beta_program.description")}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
