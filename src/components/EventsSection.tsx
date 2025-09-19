import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { nb } from "date-fns/locale"; // Norwegian Bokmål locale
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import EventCard, { EventCardSkeleton } from "./EventCard";
import { getAllLocations, getEventsByDate } from "../api/events";
import festivities from "../assets/festivities.svg";
import { SelectItem, Select, SelectContent, SelectTrigger, SelectValue } from "./ui/select";
import { useSearchParams } from "react-router";

interface EventsSectionProps {
  selectedDate: Date;
}

export const EventsSection: React.FC<EventsSectionProps> = ({
  selectedDate,
}) => {
  const { t, i18n } = useTranslation();
  const [location, setLocation] = useState<string>('');
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const locationParam = searchParams.get('location');
    if (locationParam && locationParam != "all") {
      setLocation(locationParam);
    } else {
      setLocation('');
    }
  }, [searchParams]);

  useEffect(() => {
    const selectedLocation = location ? location : 'all';
    setSearchParams((prev) => {
      const newParam = new URLSearchParams(prev);
      newParam.set('location', selectedLocation);
      return newParam;
    });
  }, [location]);

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

  const {
    data: locations,
    isPending: locationPending,
    error: locationError,
  } = useQuery({
    queryKey: ["location"],
    queryFn: () => getAllLocations(),
    staleTime: 1000 * 60 * 60 * 1, // 1 hour
    gcTime: 1000 * 60 * 60 * 1, // 1 hour
  })


  const {
    data: events,
    isPending,
    error,
    refetch,
  } = useQuery({
    queryKey: ["events-by-date", format(selectedDate, "yyyy-MM-dd"), "location", location],
    queryFn: () => {
      return getEventsByDate(selectedDate, (location === 'All' || location === "") ? null : locations[location]);
    },
    staleTime: 1000 * 60 * 60 * 1, // 1 hour
    gcTime: 1000 * 60 * 60 * 1, // 1 hour
  });



  return (
    <div className="py-4">
      <div className="flex justify-between">
        <h2 className="text-xl sm:text-2xl font-bold mb-6">
          {t("events_on")} {formatDate(selectedDate, "MMMM d, yyyy")}
        </h2>
        <Select value={location} onValueChange={setLocation}>
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder={t("location")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All" className="px-4 py-2 rounded-md">{t("all_location")}</SelectItem>
            {(!locationPending && !locationError) &&
              Object.keys(locations).map((loc, idx) => (<SelectItem key={idx} value={loc}>{loc}</SelectItem>))
            }
          </SelectContent>
        </Select>
      </div>

      {events && events.length > 0 ? (
        <>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-4 justify-items-center mb-20 sm:mb-0">
            {events.map((event: any, index: number) => (
              <EventCard key={index} event={event} />
            ))}
          </div>
        </>
      ) : isPending ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-4 justify-items-center">
          {[...Array(4)].map((_, index) => (
            <EventCardSkeleton key={index} />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">
            Unable to load events. Please try again.
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blizbi-teal text-white rounded-lg hover:bg-blizbi-teal/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : !events || events.length === 0 && (
        <div className="col-span-full flex flex-col items-center justify-center pb-12 sm:pt-4 pt-0 text-gray-500">
          <img
            src={festivities}
            alt="No events"
            style={{
              width: "35%",
              height: "auto",
            }}
            loading="lazy"
          />
          <p className="text-[12px] sm:text-lg my-6">
            {t("no_events_found_date")}
          </p>
        </div>
      )}
    </div>
  );
};
