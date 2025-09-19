import React, { useCallback } from "react";
import { format, subDays } from "date-fns";
import { nb } from "date-fns/locale"; // Norwegian Bokmål locale
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useDateNavigation } from "../hooks/useDateNavigation";
import { useTranslation } from "react-i18next";

interface DatePickerProps {
  minDate?: Date;
  onDateSelect?: (date: Date) => void;
  selectedDate: Date;
}

const DateNavigation: React.FC<DatePickerProps> = ({
  onDateSelect,
  minDate,
  selectedDate
}) => {
  const { t, i18n } = useTranslation();

  const getDateLocale = () => {
    switch (i18n.language) {
      case "no":
        return nb;
      default:
        return undefined; // English (default)
    }
  };

  const formatDate = (date: Date, formatStr: string) => {
    return format(date, formatStr, { locale: getDateLocale() });
  };

  const isSelectedDate = useCallback((date: Date) => {
    return format(selectedDate, "yyyy-MM-dd") === format(date, "yyyy-MM-dd");
  }, [selectedDate]);
  const {
    dates,
    open,
    setOpen,
    handlePrevious,
    handleNext,
    handleDateSelect,
    isDateDisabled,
    isCurrentDay,
  } = useDateNavigation({ minDate, onDateSelect});

  const isPreviousDisabled = isDateDisabled(subDays(selectedDate, 1));

  return (
    <div className="w-full mb-4">
      <div className="mx-auto flex flex-col gap-2 sm:gap-4">
        <div className="flex items-center gap-1">
          <h1 className="text-xl sm:text-2xl font-bold">
            {formatDate(selectedDate, "MMMM")}
          </h1>
          <span className="text-sm text-gray-500">
            {formatDate(selectedDate, "yyyy")}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevious}
            className="text-blizbi-teal hover:text-blizbi-teal/80 transition-colors p-1"
            disabled={isPreviousDisabled}
            style={{ opacity: isPreviousDisabled ? 0.5 : 1 }}
          >
            <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
          </button>

          <div className="flex items-center gap-[2px] sm:gap-3 overflow-x-auto px-1 scrollbar-hide">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <button
                  onClick={() => setOpen(true)}
                  className="flex flex-col items-center max-w-[38px] sm:max-w-[55px] py-1 sm:py-2 px-2 sm:px-4 sm:rounded-lg rounded-sm transition-all relative text-blizbi-teal hover:bg-blizbi-teal hover:bg-opacity-10"
                >
                  <div className="flex flex-col items-center sm:gap-2 gap-1">
                    <CalendarIcon className="w-4 h-4 sm:w-6 sm:h-6" />
                    <span className="text-[8px] sm:text-sm leading-tight capitalize">
                      {t("calendar")}
                    </span>
                  </div>
                </button>
              </PopoverTrigger>

              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date: Date | undefined) => {
                    if (date && !isDateDisabled(date)) {
                      handleDateSelect(date);
                      setOpen(false);
                    }
                  }}
                  locale={getDateLocale()}
                  initialFocus
                  {...(minDate ? { fromDate: minDate } : {})}
                />
              </PopoverContent>
            </Popover>

            {dates.map((date) => {
              const selected = isSelectedDate(date);
              const currentDay = isCurrentDay(date);
              const beforeMin = isDateDisabled(date);

              return (
                <button
                  key={date.toISOString()}
                  onClick={() => !beforeMin && handleDateSelect(date)}
                  className={
                    `flex flex-col items-center max-w-[38px] sm:max-w-[55px] py-1 sm:py-2 px-2 sm:px-4 sm:rounded-lg rounded-sm transition-all relative ` +
                    (selected
                      ? "bg-blizbi-teal text-blizbi-yellow"
                      : beforeMin
                        ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                        : "text-blizbi-teal hover:bg-blizbi-teal hover:bg-opacity-10") +
                    (currentDay && !selected && !beforeMin
                      ? " ring-1 sm:ring-2 ring-blizbi-teal ring-inset"
                      : "")
                  }
                  disabled={beforeMin}
                  style={{ opacity: beforeMin ? 0.5 : 1 }}
                >
                  <div className="flex flex-col items-center sm:gap-2 gap-1">
                    <span className="text-xl sm:text-2xl font-semibold">
                      {formatDate(date, "d")}
                    </span>
                    <span className="text-[8px] sm:text-sm leading-tight capitalize">
                      {formatDate(date, "EEE")}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <button
            onClick={handleNext}
            className="text-blizbi-teal hover:text-blizbi-teal/80 transition-colors p-1"
          >
            <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DateNavigation;
