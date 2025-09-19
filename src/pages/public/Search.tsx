import React, { useState } from "react";
import {
  Search as SearchIcon,
  Calendar as CalendarIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import EventCard from "../../components/EventCard";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { Button } from "../../components/ui/button";
import { Calendar } from "../../components/ui/calendar";
import { format } from "date-fns";
import { nb } from "date-fns/locale"; // Norwegian Bokmål locale
import { getPopularEvents } from "../../api/events";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

interface SearchFilters {
  category: string;
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  location: string;
}

const Search: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<SearchFilters>({
    category: "All",
    dateRange: {
      from: undefined,
      to: undefined,
    },
    location: "",
  });
  const navigate = useNavigate();

  // Get the appropriate locale for date-fns based on current language
  const { t, i18n } = useTranslation();
  const getDateLocale = () => {
    switch (i18n.language) {
      case "no":
        return nb; // Norwegian Bokmål
      default:
        return undefined; // English (default)
    }
  };

  // Helper function to format date as YYYY-MM-DD using user's current timezone
  const formatDateForAPI = (date: Date): string => {
    // Use the user's current timezone explicitly
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const formatter = new Intl.DateTimeFormat("en-CA", {
      // 'en-CA' gives YYYY-MM-DD format
      timeZone: userTimezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return formatter.format(date);
  };

  // Fetch popular events
  const { data: popularEvents = [], isLoading: popularEventsLoading } =
    useQuery({
      queryKey: ["popular-events"],
      queryFn: () => getPopularEvents(8),
      staleTime: 5 * 60 * 1000, // 5 minutes
    });

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      navigateToSearchResults();
    }
  };

  // Function to navigate to search results with current filters
  const navigateToSearchResults = () => {
    const queryParams = new URLSearchParams();

    // Add search query if present
    if (searchQuery.trim()) {
      queryParams.set("q", searchQuery.trim());
    }

    // Add category if not 'All'
    if (filters.category !== "All") {
      queryParams.set("category", filters.category);
    }

    // Add location if present
    if (filters.location) {
      queryParams.set("location", filters.location);
    }

    // Add dates if present - format as YYYY-MM-DD WITHOUT timezone conversion
    if (filters.dateRange.from) {
      queryParams.set("dateFrom", formatDateForAPI(filters.dateRange.from));
    }
    if (filters.dateRange.to) {
      queryParams.set("dateTo", formatDateForAPI(filters.dateRange.to));
    }

    navigate(`/search/result?${queryParams.toString()}`);
  };

  return (
    <div className="py-4">
      {/* Search Input */}
      <div className="w-full mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder={t("search.placeholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blizbi-teal focus:border-transparent"
          />
          <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        </div>

        {/* Filters Section */}
        <div className="mt-4 flex flex-wrap gap-2">
          {/* Date Range Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                {filters.dateRange.from
                  ? filters.dateRange.to &&
                    filters.dateRange.from.getTime() !==
                    filters.dateRange.to.getTime()
                    ? `${format(filters.dateRange.from, "MMM d")} - ${format(
                      filters.dateRange.to,
                      "MMM d"
                    )}`
                    : format(filters.dateRange.from, "MMM d")
                  : t("search.date")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div className="p-3 border-b">
                <span className="text-sm text-gray-600">
                  {t("search.date.select_range")}
                </span>
              </div>
              <Calendar
                mode="range"
                selected={{
                  from: filters.dateRange.from,
                  to: filters.dateRange.to,
                }}
                onSelect={(range) => {
                  if (range) {
                    // Check if we have both from and to dates (proper range)
                    if (range.from && range.to) {
                      // Proper range selection - use different dates
                      setFilters({
                        ...filters,
                        dateRange: {
                          from: range.from,
                          to: range.to,
                        },
                      });
                    } else if (range.from && !range.to) {
                      // Single date selection - set both to same date
                      setFilters({
                        ...filters,
                        dateRange: {
                          from: range.from,
                          to: range.from,
                        },
                      });
                    } else {
                      // Handle edge case where only 'to' is set
                      setFilters({
                        ...filters,
                        dateRange: {
                          from: range.to,
                          to: range.to,
                        },
                      });
                    }
                  } else {
                    // Clear selection
                    setFilters({
                      ...filters,
                      dateRange: {
                        from: undefined,
                        to: undefined,
                      },
                    });
                  }
                }}
                disabled={(date) => {
                  // Disable dates before today
                  const today = new Date();
                  today.setHours(0, 0, 0, 0); // Reset time to start of day
                  return date < today;
                }}
                initialFocus
                locale={getDateLocale()}
              />
              {/* Action buttons */}
              <div className="p-3 border-t flex gap-2">
                {(filters.dateRange.from || filters.dateRange.to) && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setFilters({
                          ...filters,
                          dateRange: {
                            from: undefined,
                            to: undefined,
                          },
                        })
                      }
                      className="flex-1"
                    >
                      {t("search.clear")}
                    </Button>
                    <Button
                      onClick={navigateToSearchResults}
                      className="bg-blizbi-teal hover:bg-blizbi-teal/90 text-white flex-1"
                      size="sm"
                    >
                      <SearchIcon className="h-4 w-4 mr-1" />
                      {t("search.search")}
                    </Button>
                  </>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Popular Events Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {t("search.popular_events")}
        </h2>

        {popularEventsLoading ? (
          <div className="text-center py-8">
            <div className="text-gray-500">{t("search.loading_events")}</div>
          </div>
        ) : popularEvents.length > 0 ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-4 justify-items-center">
            {popularEvents?.map((event) => {
              return <EventCard key={event.id} event={event} />;
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-500">{t("search.no_popular_events")}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
