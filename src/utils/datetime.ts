import i18n from "@/i18n";
import { format, getYear } from "date-fns";
import { enUS, nb } from "date-fns/locale";

const formatStartAndEndDate = (
  startDate: string,
  endDate: string | null
): string | null => {
  //get current locale
  try {
    const locale = i18n.language;
    const localeObject = locale === "no" ? nb : enUS;
    if (!startDate) return null;

    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : null;

    if (end && startDate !== endDate) {
      const sameYear = getYear(start) === getYear(end);
      return sameYear
        ? `${format(start, "d. MMM", { locale: localeObject })} – ${format(
            end,
            "d. MMM yyyy",
            { locale: localeObject }
          )}`
        : `${format(start, "d. MMM yyyy", { locale: nb })} – ${format(
            end,
            "d. MMM yyyy",
            { locale: localeObject }
          )}`;
    }

    return format(start, "d. MMM yyyy", { locale: localeObject }); // "1. juni 2025"
  } catch (error) {
    console.error("Error formatting date:", error);
    return null;
  }
};

const formatStartAndEndTime = (
  startTime: string | null,
  endTime: string | null
): string | null => {
  if (!startTime && !endTime) return null;

  const formatTime = (time: string) => {
    const date = new Date(`1970-01-01T${time}`);
    return format(date, "HH:mm");
  };

  if (startTime && endTime) {
    return `${formatTime(startTime)} - ${formatTime(endTime)}`;
  }

  if (startTime) {
    return formatTime(startTime);
  }

  return null;
};

const formatTime = (time: string) => {
  try {
    if (!time || typeof time !== "string") {
      return "Time TBD";
    }

    const cleanTime = time.includes(":") ? time : `${time}:00`;
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

    if (!timeRegex.test(cleanTime)) {
      return time; // Return original if it doesn't match expected format
    }

    const dateTime = new Date(`2000-01-01T${cleanTime}`);

    if (isNaN(dateTime.getTime())) {
      return time; // Return original if invalid
    }

    return format(dateTime, "HH:mm");
  } catch (error) {
    console.error("Error formatting single time:", error, { time });
    return time || "Time TBD";
  }
};

export { formatStartAndEndDate, formatStartAndEndTime, formatTime };
