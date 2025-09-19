import { useState, useEffect, useCallback } from "react";
import {
  format,
  addDays,
  subDays,
  startOfDay,
  isToday,
  previousMonday,
  isMonday,
} from "date-fns";
import { useSearchParams } from "react-router";

interface UseDateNavigationProps {
  minDate?: Date;
  onDateSelect?: (date: Date) => void;
}

export const useDateNavigation = ({ minDate, onDateSelect }: UseDateNavigationProps) => {
  const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()));
  const [isMobile, setIsMobile] = useState(false);
  const [open, setOpen] = useState(false);

  // Get the Monday that starts the week containing the selected date
  const getWeekStart = useCallback((date: Date) => {
    return isMonday(date) ? date : previousMonday(date);
  }, []);

  const [searchParams, setSearchParams] = useSearchParams();
  const currStr = searchParams.get('date');
  const currDate = currStr ? new Date(currStr) : new Date();

  const [startDate, setStartDate] = useState(() => getWeekStart(currDate));
  const checkMobile = useCallback(() => {
    const wasMobile = isMobile;
    const newIsMobile = window.innerWidth < 640;
    setIsMobile(newIsMobile);

    // If switching to mobile view or initializing as mobile, show current date
    if (newIsMobile && (!wasMobile || !isMobile)) {
      const today = startOfDay(new Date());
      setSelectedDate(today);
      setStartDate(today);
    } else if (!newIsMobile && wasMobile) {
      // When switching back to desktop, ensure we show the proper week
      setStartDate(getWeekStart(selectedDate));
    }
  }, [selectedDate, isMobile, getWeekStart]);

  useEffect(() => {
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [checkMobile]);

  // Generate days based on screen size
  const dates = Array.from({ length: isMobile ? 5 : 7 }, (_, i) =>
    addDays(startDate, i)
  );

  const handlePrevious = useCallback(() => {
    const newSelectedDate = subDays(selectedDate, 1);
    if (
      minDate &&
      format(newSelectedDate, "yyyy-MM-dd") < format(minDate, "yyyy-MM-dd")
    ) {
      return; // Prevent going before minDate
    }
    setSelectedDate(newSelectedDate);
    // If selected date would be before visible range, shift the range
    if (
      format(newSelectedDate, "yyyy-MM-dd") < format(dates[0], "yyyy-MM-dd")
    ) {
      setStartDate(isMobile ? newSelectedDate : getWeekStart(newSelectedDate));
    }
    onDateSelect?.(newSelectedDate);
  }, [selectedDate, minDate, dates, isMobile, getWeekStart, onDateSelect]);

  const handleNext = useCallback(() => {
    const newSelectedDate = addDays(selectedDate, 1);
    setSelectedDate(newSelectedDate);

    // If selected date would be after visible range, shift the range
    const lastVisibleDate = dates[dates.length - 1];
    if (
      format(newSelectedDate, "yyyy-MM-dd") >
      format(lastVisibleDate, "yyyy-MM-dd")
    ) {
      setStartDate(isMobile ? newSelectedDate : getWeekStart(newSelectedDate));
    }
    onDateSelect?.(newSelectedDate);
  }, [selectedDate, dates, isMobile, getWeekStart, onDateSelect]);

  const handleDateSelect = useCallback((date: Date) => {
    setSelectedDate(date);
    setStartDate(isMobile ? date : getWeekStart(date));
    onDateSelect?.(date);
  }, [isMobile, getWeekStart, onDateSelect]);

  const isDateDisabled = useCallback((date: Date) => {
    return minDate && format(date, "yyyy-MM-dd") < format(minDate, "yyyy-MM-dd");
  }, [minDate]);

  const isSelectedDate = useCallback((date: Date) => {
    return format(selectedDate, "yyyy-MM-dd") === format(date, "yyyy-MM-dd");
  }, [selectedDate]);

  const isCurrentDay = useCallback((date: Date) => {
    return isToday(date);
  }, []);

  return {
    selectedDate,
    dates,
    isMobile,
    open,
    setOpen,
    handlePrevious,
    handleNext,
    handleDateSelect,
    isDateDisabled,
    isSelectedDate,
    isCurrentDay,
  };
}; 
