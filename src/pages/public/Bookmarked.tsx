import { useState, useMemo, useEffect } from "react";
import EventCard from "../../components/EventCard";
import CalendarView from "../../components/CalendarView";
import { useBookmarkContext } from "@/contexts/BookmarkContext";
import { format, isSameDay } from "date-fns";
import { nb } from "date-fns/locale"; // Norwegian Bokmål locale
import MustSignIn from "@/components/MustSignIn";
import festivities from "../../assets/festivities.svg";
import { useTranslation } from "react-i18next";

const Bookmarked = () => {
  const { t, i18n } = useTranslation();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const {
    bookmarkedEventsDetails,
    bookmarkedEventsLoading,
    isSignedIn,
    refetchBookmarkedEvents,
  } = useBookmarkContext();

  console.log(bookmarkedEventsDetails);

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

  // Get locale string for toLocaleDateString
  const getLocaleString = () => {
    switch (i18n.language) {
      case "no":
        return "nb-NO"; // Norwegian Bokmål
      default:
        return undefined; // English (default)
    }
  };

  useEffect(() => {
    refetchBookmarkedEvents();
  }, [refetchBookmarkedEvents]);

  const eventsForSelectedDate = useMemo(() => {
    return bookmarkedEventsDetails.filter((bookmark) => {
      if (!bookmark.event) return false;
      const eventDate = new Date(bookmark.event.start_date);
      return isSameDay(eventDate, selectedDate);
    });
  }, [bookmarkedEventsDetails, selectedDate]);

  if (!isSignedIn) {
    return (
      <div className="w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] lg:w-[calc(100%-16rem)] xl:w-[calc(100%-20rem)] max-w-6xl mx-auto">
        <MustSignIn />
      </div>
    );
  }

  if (bookmarkedEventsLoading) {
    return (
      <div className="min-h-[calc(100vh-8rem)] md:w-[calc(100%-4rem)] lg:w-[calc(100%-16rem)] xl:w-[calc(100%-20rem)] max-w-6xl mx-auto flex flex-col items-center justify-center py-16">
        <div className="text-gray-500">{t("loading")}</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 mb-20">
      <div className="flex flex-col md:flex-row gap-4 py-4">
        <div className="w-full md:w-1/2">
          <CalendarView
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
        </div>
        <div className="w-full md:w-1/2">
          {eventsForSelectedDate.length === 0 ? (
            <div className="col-span-full h-[calc(100%)] flex flex-col items-center  justify-center pb-12 sm:pt-4 pt-0 text-gray-500">
              <img
                src={festivities}
                alt="No events"
                style={{
                  width: "50%",
                  height: "auto",
                }}
                loading="lazy"
              />
              <div className="text-gray-500 my-6 text-[12px] sm:text-lg ">
                {`${t("bookmarked.page.no_events")} ${formatDate(
                  selectedDate,
                  "MMMM d, yyyy"
                )}`}
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold mb-2 text-gray-800">
                {t("bookmarked.page.title")}
                {selectedDate.toLocaleDateString(getLocaleString(), {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </h2>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-4 justify-items-center">
                {eventsForSelectedDate.map((event) => (
                  <EventCard key={event.id} event={event.event} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Bookmarked;
