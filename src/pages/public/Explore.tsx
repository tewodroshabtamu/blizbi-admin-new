import React, { useEffect, useState } from "react";
import DateNavigation from "../../components/DateNavigation";
import { ProviderCarousel } from "../../components/ProviderCarousel";
import { EventsSection } from "../../components/EventsSection";
import { useSearchParams } from "react-router";
import { format } from "date-fns";

const Explore: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const dateParam = searchParams.get('date');
    if (dateParam) {
      const formattedDate = new Date(dateParam);
      setSelectedDate(formattedDate);
    } else {
      setSearchParams((prev) => {
        const newParam = new URLSearchParams(prev);
        const formattedDate = format(selectedDate, "yyyy-MM-dd");
        newParam.set('date', formattedDate);
        return newParam;
      })
    }
  }, []);


  const handleDateSelect = (date: Date) => {
    setSearchParams((prev) => {
      const newParam = new URLSearchParams(prev);
      const formattedDate = format(date, "yyyy-MM-dd");
      newParam.set('date', formattedDate);
      return newParam;
    });
    setSelectedDate(date);
  };

  return (
    <>
      <ProviderCarousel />
      <DateNavigation onDateSelect={handleDateSelect} minDate={new Date()} selectedDate={selectedDate} />
      <EventsSection selectedDate={selectedDate} />
    </>
  );
};

export default Explore;
