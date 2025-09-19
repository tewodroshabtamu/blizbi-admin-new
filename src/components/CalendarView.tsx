import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { nb } from "date-fns/locale"; // Norwegian Bokmål locale
import { useTranslation } from "react-i18next";

const CalendarView = ({ selectedDate, setSelectedDate }: CalendarViewProps) => {
  const { i18n } = useTranslation();
  const [calendarSelectedDate, setCalendarSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());

  // Get the appropriate locale for date-fns based on current language
  const getDateLocale = () => {
    switch (i18n.language) {
      case "no":
        return nb; // Norwegian Bokmål
      default:
        return undefined; // English (default)
    }
  };

  const formatDate = (date: Date, formatStr: string) => {
    return format(date, formatStr, { locale: getDateLocale() });
  };

  // Get day letters based on language
  const getDayLetters = () => {
    switch (i18n.language) {
      case "no":
        return ["M", "T", "O", "T", "F", "L", "S"]; // Norwegian: Man, Tir, Ons, Tor, Fre, Lør, Søn
      default:
        return ["M", "T", "W", "T", "F", "S", "S"]; // English: Mon, Tue, Wed, Thu, Fri, Sat, Sun
    }
  };

  const getCurrentMonth = () => {
    const month = formatDate(calendarSelectedDate, "MMMM");
    const year = calendarSelectedDate.getFullYear();
    return { month, year };
  };

  const getDaysInMonth = () => {
    const year = calendarSelectedDate.getFullYear();
    const month = calendarSelectedDate.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const handlePreviousMonth = () => {
    const newDate = new Date(calendarSelectedDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCalendarSelectedDate(newDate);
    setCurrentMonth(newDate.getMonth());
  };

  const handleNextMonth = () => {
    const newDate = new Date(calendarSelectedDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCalendarSelectedDate(newDate);
    setCurrentMonth(newDate.getMonth());
  };

  const isCurrentDate = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      calendarSelectedDate.getMonth() === today.getMonth() &&
      calendarSelectedDate.getFullYear() === today.getFullYear()
    );
  };

  const isSelectedDate = (day: number) => {
    return (
      day === selectedDate.getDate() &&
      calendarSelectedDate.getMonth() === selectedDate.getMonth() &&
      calendarSelectedDate.getFullYear() === selectedDate.getFullYear()
    );
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(calendarSelectedDate);
    newDate.setDate(day);
    setSelectedDate(newDate);
  };

  const Header = () => {
    return (
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1">
          <h1 className="text-2xl font-bold">{getCurrentMonth().month}</h1>
          <span className="text-sm text-gray-500">
            {getCurrentMonth().year}
          </span>
        </div>
        <div className="flex gap-2">
          <ChevronLeftIcon
            className="cursor-pointer hover:text-gray-600 h-6 w-6"
            onClick={handlePreviousMonth}
          />
          <ChevronRightIcon
            className="cursor-pointer hover:text-gray-600 h-6 w-6"
            onClick={handleNextMonth}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="bg-blizbi-yellow p-4 rounded-lg">
      <Header />
      <div className="mt-4">
        <div className="grid grid-cols-7 mb-2">
          {getDayLetters().map((day, index) => (
            <div
              key={index}
              className="text-center font-semibold text-gray-500"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: getDaysInMonth() }).map((_, index) => (
            <div
              key={index}
              onClick={() => handleDateClick(index + 1)}
              className={`aspect-square flex flex-col items-center justify-center rounded-full hover:bg-white/50 hover:shadow-md transition-all duration-200 cursor-pointer text-gray-700 hover:text-gray-900 hover:scale-105 relative ${
                isSelectedDate(index + 1)
                  ? "bg-white/50 shadow-md scale-105"
                  : ""
              }`}
            >
              {isCurrentDate(index + 1) && (
                <div className="absolute top-2 right-2 w-2 h-2 bg-blizbi-teal rounded-full" />
              )}
              <span
                className={`text-lg font-semibold ${
                  isSelectedDate(index + 1)
                    ? "text-blizbi-teal"
                    : "text-gray-700"
                }`}
              >
                {index + 1}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface CalendarViewProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

export default CalendarView;
