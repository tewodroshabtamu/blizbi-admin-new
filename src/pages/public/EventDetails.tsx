import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  Bookmark,
  Calendar as CalendarIcon,
  DollarSign,
  User,
  Globe,
} from "lucide-react";
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useScrollToTop } from "../../hooks/useScrollToTop";
import { useQuery } from "@tanstack/react-query";
import { useBookmarkContext } from "@/contexts/BookmarkContext";
import { getEventById } from "@/api/events";
import { formatStartAndEndDate, formatStartAndEndTime } from "@/utils/datetime";
import { useTranslation } from "react-i18next";
import generateSVG from "@/utils/image";
import * as cheerio from 'cheerio';
const EventDetails: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    isBookmarked,
    toggleBookmark,
    loading: bookmarkLoading,
  } = useBookmarkContext();
  useScrollToTop();

  const {
    data: event,
    isPending,
    error,
  } = useQuery({
    queryKey: ["event-details", id],
    queryFn: () => getEventById(id as string),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  const EventDetailItem = ({
    icon: Icon,
    text,
  }: {
    icon: React.ElementType;
    text: string;
  }) => (
    <div className="flex items-center gap-2 text-gray-600">
      <Icon className="h-4 w-4" />
      <span>{text}</span>
    </div>
  );

  const DetailRow = ({
    label,
    value,
    valueType = "string",
  }: {
    label: string;
    value: string;
    valueType?: "string" | "link";
  }) => (
    <div className="flex justify-between py-1 border-b border-gray-100 last:border-0">
      <span className="text-gray-600">{label}</span>
      {valueType === "string" ? (
        <span className="font-medium text-right">{value}</span>
      ) : (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-right hover:underline"
        >
          {value}
        </a>
      )}
    </div>
  );

  const handleAddToCalendar = () => {
    if (!event) return;

    const startDateTime = new Date(
      `${event.start_date} ${event.start_time || "00:00"}`
    );
    const endDateTime =
      event.end_date && event.end_time
        ? new Date(`${event.end_date} ${event.end_time}`)
        : new Date(startDateTime.getTime() + 2 * 60 * 60 * 1000);

    const formatDate = (date: Date) => {
      return date.toISOString().replace(/-|:|\.\d+/g, "");
    };

    const calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      event.title,
    )}&dates=${formatDate(startDateTime)}/${formatDate(
      endDateTime,
    )}&details=${encodeURIComponent(
      event.details.description || "",
    )}&location=${encodeURIComponent(
      event.details.address || event.details.location || "",
    )}`;

    window.open(calendarUrl, "_blank");
  };

  const getPriceDisplay = () => {
    if (event?.price_type === "free") {
      return t("free");
    } else if (event?.price_type === "paid") {
      return event.price_amount;
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-gray-500">Loading event details...</div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">Error loading event details</div>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blizbi-teal text-white rounded-md hover:bg-blizbi-teal/90"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const description = event.details.description ? cheerio.load(event.details.description) : null;

  return (
    <div className="min-h-screen pb-20">
      <div className="relative w-full h-[400px]">
        <img
          src={event.cover_url || generateSVG(event.providers.name)}
          alt="Event"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30"></div>
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft />
        </button>
      </div>

      <div className="w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] lg:w-[calc(100%-16rem)] xl:w-[calc(100%-20rem)] max-w-6xl mx-auto">
        <div className="py-6">
          <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
          <div className="space-y-3">
            <EventDetailItem
              icon={Calendar}
              text={formatStartAndEndDate(event.start_date, event.end_date)!}
            />
            {event.start_time && (
              <EventDetailItem
                icon={Clock}
                text={formatStartAndEndTime(event.start_time, event.end_time)!}
              />
            )}
            {event.price_type && event.price_type !== null && (
              <EventDetailItem icon={DollarSign} text={getPriceDisplay()} />
            )}
          </div>
        </div>

        {event.details.description && (
          <div className="py-6 border-t border-gray-100">
            <h2 className="text-xl font-semibold mb-4">{t("event.about")}</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {description ? description.text() : ""}
            </p>
          </div>
        )}

        <div className="py-6 border-t border-gray-100">
          <h2 className="text-xl font-semibold mb-4">
            {t("event.source_information")}
          </h2>
          <div className="space-y-0">
            <DetailRow label={t("organizer")} value={event.details.organizer} />
            <DetailRow label={t("provider")} value={event.providers.name} />
            <DetailRow
              label={t("event.link")}
              value={event.details.link}
              valueType="link"
            />
          </div>
        </div>

        <div className="py-6 border-t border-gray-100">
          <h2 className="text-xl font-semibold mb-4">
            {t("provider.information")}
          </h2>
          <div className="space-y-3">
            <EventDetailItem icon={User} text={event.providers.name} />
            {event.providers.address && (
              <EventDetailItem icon={MapPin} text={event.providers.address} />
            )}
            {event.providers.website_url && (
              <div className="flex items-center gap-2 text-gray-600">
                <Globe className="h-4 w-4" />
                <a
                  href={event.providers.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className=" hover:underline"
                >
                  {event.providers.website_url}
                </a>
              </div>
            )}
          </div>
        </div>

        {event.details.location && (
          <div className="py-6 border-t border-gray-100">
            <h2 className="text-xl font-semibold mb-4">Location</h2>
            <div className="mb-4">
              <p className="text-gray-600">{event.details.address}</p>
            </div>
            <div className="w-full h-[300px] bg-gray-100 rounded-lg overflow-hidden">
              <iframe
                src={`https://maps.google.com/maps?q=${typeof event.details.location === "object"
                  ? `${event.details.location.latitude},${event.details.location.longitude}`
                  : encodeURIComponent(
                    event.details.location || event.details.address || ""
                  )
                  }&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-lg">
        <div className="w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] lg:w-[calc(100%-16rem)] xl:w-[calc(100%-20rem)] max-w-6xl mx-auto py-4 flex items-center justify-between">
          <button
            onClick={() => toggleBookmark(event.id)}
            disabled={bookmarkLoading}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors disabled:opacity-50 ${isBookmarked(event.id)
              ? "bg-blizbi-orange text-white hover:bg-blizbi-orange/90"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
          >
            <Bookmark
              className={`h-4 w-4 ${isBookmarked(event.id) ? "fill-current" : ""
                }`}
            />
            <span className="text-sm sm:text-base">
              {isBookmarked(event.id) ? t("bookmarked") : t("bookmark")}
            </span>
          </button>
          <button
            onClick={handleAddToCalendar}
            className="flex items-center gap-2 px-4 py-2 bg-blizbi-teal text-white rounded-full hover:bg-blizbi-teal/90 transition-colors"
          >
            <CalendarIcon className="h-4 w-4" />
            <span className="text-sm sm:text-base">
              {t("add_to_google_calendar")}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
