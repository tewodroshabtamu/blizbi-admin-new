import { ArrowLeft, MapPin, Globe, Filter, CalendarIcon } from "lucide-react";
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { nb } from "date-fns/locale"; // Norwegian Bokmål locale
import EventCard from "../../components/EventCard";
import { useScrollToTop } from "../../hooks/useScrollToTop";
import { supabase } from "@/supabase-client";
import { useQuery } from "@tanstack/react-query";
import { format, endOfWeek } from "date-fns";
import { useTranslation } from "react-i18next";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

interface SearchFilters {
  category: string;
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  location: string;
}
const ProviderDetails: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();


  const getDefaultDateRange = () => {
    const today = new Date();
    const sixMonthsFromNow = new Date();
    sixMonthsFromNow.setMonth(today.getMonth() + 6);

    return {
      from: today,
      to: sixMonthsFromNow,
    };
  };

  const defaultDateRange = getDefaultDateRange();


  const [selectedDateRange, setSelectedDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>(defaultDateRange);

  const [filters, setFilters] = useState<SearchFilters>({
    category: "All",
    dateRange: defaultDateRange,
    location: "",
  });
  // const [startDate, setStartDate] = useState(
  //   format(startOfMonth(new Date()), "yyyy-MM-dd")
  // );
  // const [endDate, setEndDate] = useState(
  //   format(endOfMonth(new Date()), "yyyy-MM-dd")
  // );

  const getProviderDetails = async () => {
    const { data, error } = await supabase
      .from("providers")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  };

  const getDateLocale = () => {
    switch (i18n.language) {
      case "no":
        return nb;
      default:
        return undefined;
    }
  };
  const getProviderEvents = async () => {
    if (!id) return [];

    try {
      let query = supabase
        .from("event")
        .select(
          `
          id,
          title,
          start_date,
          end_date,
          start_time,
          end_time,
          cover_url,
          price_type,
          price_amount,
          details,
          providers!provider_id (
            name
          )
        `
        )
        .eq("provider_id", id)
        .order("start_date", { ascending: true });

      if (filters.dateRange.from && filters.dateRange.to) {
        // Convert Date objects to YYYY-MM-DD format
        const fromDate = format(filters.dateRange.from, "yyyy-MM-dd");
        const toDate = format(filters.dateRange.to, "yyyy-MM-dd");

        if (fromDate === toDate) {
          query = query.eq("start_date", fromDate);
        } else {
          query = query.gte("start_date", fromDate).lte("start_date", toDate);
        }
      } else if (filters.dateRange.from) {
        // Only from date
        const fromDate = format(filters.dateRange.from, "yyyy-MM-dd");
        query = query.gte("start_date", fromDate);
      } else if (filters.dateRange.to) {
        // Only to date
        const toDate = format(filters.dateRange.to, "yyyy-MM-dd");
        query = query.lte("start_date", toDate);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Supabase query error:", error);
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error("Error in getProviderEvents:", error);
      throw error;
    }
  };

  useScrollToTop();

  const {
    data: providerDetails,
    isPending: providerLoading,
    error: providerError,
  } = useQuery({
    queryKey: ["provider", id],
    queryFn: getProviderDetails,
  });

  const {
    data: providerEvents = [],
    isPending: eventsLoading,
    error: eventsError,
    // refetch: refetchEvents,
  } = useQuery({
    queryKey: ["provider-events", id, filters.dateRange.from, filters.dateRange.to],
    queryFn: getProviderEvents,
    enabled: !!id,
  });

  // const handleDateRangeChange = () => {
  //   refetchEvents();
  // };
  //
  // const resetToCurrentMonth = () => {
  //   setStartDate(format(startOfMonth(new Date()), "yyyy-MM-dd"));
  //   setEndDate(format(endOfMonth(new Date()), "yyyy-MM-dd"));
  // };

  // Function to apply the selected date range
  const applyDateFilter = () => {
    setFilters({
      ...filters,
      dateRange: selectedDateRange,
    });
  };

  // Function to clear the selected date range
  const clearDateFilter = () => {
    setSelectedDateRange({
      from: undefined,
      to: undefined,
    });
    setFilters({
      ...filters,
      dateRange: {
        from: undefined,
        to: undefined,
      },
    });
  };

  const ProviderDetailItem = ({
    icon: Icon,
    text,
    type,
  }: {
    icon: React.ElementType;
    text: string;
    type?: "website" | "email" | "phone";
  }) => {
    const getLinkProps = () => {
      switch (type) {
        case "website":
          return {
            href: text,
            children: text,
          };
        default:
          return null;
      }
    };

    const linkProps = getLinkProps();

    return (
      <div className="flex items-center gap-2 text-gray-600">
        <Icon className="h-5 w-5" />
        {linkProps ? (
          <a
            href={linkProps.href}
            target={type === "website" ? "_blank" : undefined}
            rel={type === "website" ? "noopener noreferrer" : undefined}
            className="text-blizbi-teal hover:underline"
          >
            {linkProps.children}
          </a>
        ) : (
          <span>{text}</span>
        )}
      </div>
    );
  };

  if (providerLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-gray-500">{t("provider_details.loading")}</div>
      </div>
    );
  }

  if (providerError || !providerDetails) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-red-500">{t("provider_details.error")}</div>
      </div>
    );
  }


  return (
    <div className="min-h-screen pb-20">
      <div className="relative w-full h-[400px]">
        <img
          src={providerDetails.cover_url}
          alt="Provider"
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
          <h1 className="text-3xl font-bold mb-4">{providerDetails.name}</h1>
          <div className="space-y-2 mb-6">
            {providerDetails.address && (
              <ProviderDetailItem
                icon={MapPin}
                text={providerDetails.address}
              />
            )}
            <ProviderDetailItem
              icon={Globe}
              text={providerDetails.website_url}
              type="website"
            />
          </div>
          <p className="text-gray-600 leading-relaxed">
            {providerDetails.short_description}
          </p>

          <p className="text-gray-600 leading-relaxed mt-4">
            {providerDetails.description}
          </p>
        </div>

        {/* Events Section */}
        <div className="py-6 border-t border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {t("provider_details.events")}
            </h2>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-500">
                {t("provider_details.filter_by_date")}
              </span>
            </div>
          </div>

          {/* Date Range Filter 

          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <label className="text-sm font-medium text-gray-700">
                  {t("provider_details.from")}
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blizbi-teal focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">
                  {t("provider_details.to")}
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blizbi-teal focus:border-transparent"
                />
              </div>
              <button
                onClick={handleDateRangeChange}
                className="px-4 py-2 bg-blizbi-teal text-white rounded-md text-sm hover:bg-blizbi-teal/90 transition-colors"
              >
                {t("provider_details.apply_filter")}
              </button>
              <button
                onClick={resetToCurrentMonth}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300 transition-colors"
              >
                {t("provider_details.current_month")}
              </button>
            </div>
          </div>

          */}

          <div className="mt-4 mb-6 flex flex-wrap gap-2">
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
                    from: selectedDateRange.from,
                    to: selectedDateRange.to,
                  }}
                  onSelect={(range) => {
                    if (range) {
                      // Check if we have both from and to dates (proper range)
                      if (range.from && range.to) {
                        // Proper range selection - use different dates
                        setSelectedDateRange({
                          from: range.from,
                          to: range.to,
                        });
                      } else if (range.from && !range.to) {
                        // Single date selection - set both to same date
                        setSelectedDateRange({
                          from: range.from,
                          to: range.from,
                        });
                      } else {
                        // Handle edge case where only 'to' is set
                        setSelectedDateRange({
                          from: range.to,
                          to: range.to,
                        });
                      }
                    } else {
                      // Clear selection
                      setSelectedDateRange({
                        from: undefined,
                        to: undefined,
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
                  {(selectedDateRange.from || selectedDateRange.to) && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearDateFilter}
                        className="flex-1"
                      >
                        {t("search.clear")}
                      </Button>
                      <Button
                        onClick={applyDateFilter}
                        className="bg-blizbi-teal hover:bg-blizbi-teal/90 text-white flex-1"
                        size="sm"
                      >
                        {t("search.filter")}
                      </Button>
                    </>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>
          {/* Events Grid */}
          {eventsLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="text-gray-500">
                {t("provider_details.loading_events")}
              </div>
            </div>
          ) : eventsError ? (
            <div className="flex justify-center items-center h-32">
              <div className="text-red-500">
                {t("provider_details.error_loading_events")}
              </div>
            </div>
          ) : providerDetails.name == "Stavanger RIB" && providerEvents.length === 0 ?
            <div
              className="w-[500px] h-[250px] hover:scale-[1.03] shadow-md hover:shadow-lg transition-all rounded-md bg-white flex flex-col hover:cursor-pointer"
              onClick={() => window.open(providerDetails.website_url, '_blank', 'noopener,noreferrer')}>
              <div className="w-full h-[180px] flex flex-col">
                <img
                  src={providerDetails.cover_url}
                  alt="Provider"
                  className="w-full h-full object-cover rounded-tr-md rounded-tl-md"
                />
              </div>
              <div className="text-l pl-10 pt-3 font-bold">{t("provider_details.daily_departures")}</div>
              <div className="pl-10 text-gray-400"><p>{providerDetails.website_url}</p></div>
            </div>
            : providerEvents.length > 0 ? (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-4 justify-items-center">
                {providerEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-500 mb-2">
                  {t("provider_details.no_events_found")}
                </div>
                <p className="text-sm text-gray-400">
                  {t("provider_details.no_events_description")}
                </p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ProviderDetails;
