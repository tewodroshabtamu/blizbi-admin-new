import React from "react";
import { Link } from "react-router-dom";
import { useBookmarkContext } from "@/contexts/BookmarkContext";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Bookmark,
  BookmarkCheck,
  Calendar1,
  CircleDollarSign,
  CircleUser,
  Clock,
  MapPin,
  MapPinHouse,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatStartAndEndDate, formatStartAndEndTime } from "@/utils/datetime";
import generateSVG from "@/utils/image";

interface EventCardProps {
  event: any;
  showBookmark?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  showBookmark = true,
}) => {
  const { t } = useTranslation();
  const { isBookmarked, toggleBookmark, loading } = useBookmarkContext();

  // Handle both chat event format and database event format
  const isSimplifiedChatFormat =
    "location" in event && "date" in event && "time" in event;

  let eventData;
  if (isSimplifiedChatFormat) {
    // Chat event format - already simplified
    eventData = {
      id: event.id,
      title: event.title,
      start_date: event.date,
      end_date: null,
      start_time: event.time,
      end_time: null,
      price_type: event.price?.type || "free",
      price_amount: event.price?.amount,
      details: {
        address:
          typeof event.location === "string" ? event.location : "Location TBD",
      },
      providers: {
        name: event.provider,
      },
      cover_url: event.imageUrl || event.cover_url,
    };
  } else {
    // Database event format - use as is
    eventData = event;
  }

  const {
    id,
    title,
    start_date,
    end_date,
    start_time,
    end_time,
    price_type,
    price_amount,
    details = {}, // Provide default empty object
    providers,
    cover_url,
  } = eventData;

  // Safely destructure details with defaults
  const { address, address_2 } = details;

  // Safely format date and time with fallbacks
  const date = formatStartAndEndDate(start_date, end_date);
  const time = formatStartAndEndTime(start_time, end_time);
  const provider = providers?.name || providers;

  // Utility function to safely format provider name
  const formatProvider = (prov: any): string => {
    if (!prov) return "Unknown Provider";
    if (typeof prov === "string") return prov;
    if (typeof prov === "object" && prov.name) return String(prov.name);
    return String(prov);
  };

  const formattedProvider = formatProvider(provider);

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleBookmark(id);
  };

  const getPriceDisplay = () => {
    switch (price_type) {
      case "free":
        return <span className="text-green-600 font-medium">{t("free")}</span>;
      case "paid":
        const amount = price_amount || 0;
        return <span className="font-medium">{amount.toString().toUpperCase()}</span>;
      default:
        return null;
    }
  };

 
  return (
    <Link
      to={`/events/${id}`}
      className="block bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all w-full cursor-pointer hover:scale-[1.02] active:scale-[0.98] relative"
    >
      {showBookmark && (
        <button
          onClick={handleBookmarkClick}
          disabled={loading}
          className="absolute top-2 right-2 z-10 p-2 rounded-full bg-white/80 hover:bg-white transition-all shadow-sm hover:shadow-md disabled:opacity-50"
          title={
            isBookmarked(id) ? "Remove from bookmarks" : "Add to bookmarks"
          }
        >
          {isBookmarked(id) ? (
            <BookmarkCheck className="h-4 w-4 text-blizbi-orange fill-current" />
          ) : (
            <Bookmark className="h-4 w-4 text-gray-600 hover:text-blizbi-orange transition-colors" />
          )}
        </button>
      )}

      <div className="relative h-[150px]">
        <img
          src={cover_url ?? generateSVG(formattedProvider)}
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = generateSVG(formattedProvider);
          }}
        />
      </div>
      <div className="p-3">
        <h3 className="text-sm font-semibold mb-2 line-clamp-2">{title}</h3>
        <div className="space-y-1 text-xs text-gray-600">
          {address && (
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3 text-gray-600" />
              <span className="line-clamp-1">{address}</span>
            </div>
          )}
          {address_2 && (
            <div className="flex items-center gap-1">
              <MapPinHouse className="h-3 w-3 text-gray-600" />
              <span className="line-clamp-1">{address_2}</span>
            </div>
          )}
          {date && (
            <div className="flex items-center gap-1">
              <Calendar1 className="h-3 w-3 text-gray-600" />
              <span>{date}</span>
            </div>
          )}
          {time && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-gray-600" />
              <span>{time}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <CircleUser className="h-3 w-3 text-gray-600" />
            <span className="line-clamp-1">{formattedProvider}</span>
          </div>
          {price_type && price_type !== null && (
            <div className="flex items-center gap-1 mt-2 pt-2 border-t border-gray-100">
              <CircleDollarSign className="h-3 w-3 text-gray-600" />
              {getPriceDisplay()}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export const EventCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md w-full relative">
      <div className="relative h-[150px]">
        <Skeleton className="w-full h-full rounded-none" />
      </div>
      <div className="p-3">
        <Skeleton className="h-5 w-3/4 mb-2" />
        <div className="space-y-2 text-xs">
          <Skeleton className="h-3 w-2/3" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-3 w-1/3" />
          <Skeleton className="h-3 w-2/3" />
          <div className="mt-2 pt-2 border-t border-gray-300">
            <Skeleton className="h-3 w-1/4" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
