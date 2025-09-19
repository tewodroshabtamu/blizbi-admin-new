import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search as SearchIcon, X, ArrowLeft } from "lucide-react";
import EventCard from "../../components/EventCard";
import { format } from "date-fns";
import { searchEvents, SearchFilters, EventData } from "../../api/events";
import { useTranslation } from "react-i18next";

const SearchResult: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [displayQuery, setDisplayQuery] = useState(searchParams.get("q") || "");
  const [debouncedQuery, setDebouncedQuery] = useState(searchParams.get("q") || "");
  const [results, setResults] = useState<EventData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync displayQuery with URL changes
  useEffect(() => {
    const urlQuery = searchParams.get("q") || "";
    setSearchQuery(urlQuery);
    setDisplayQuery(urlQuery);
    setDebouncedQuery(urlQuery);
  }, [searchParams]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Extract filter values from URL params
  const category = searchParams.get("category") || "";
  const location = searchParams.get("location") || "";
  const dateFrom = searchParams.get("dateFrom") ? searchParams.get("dateFrom")! : undefined;
  const dateTo = searchParams.get("dateTo") ? searchParams.get("dateTo")! : undefined;

  // Helper function to format date as YYYY-MM-DD using user's current timezone
  const formatDateForAPI = (dateString: string): string => {
    const date = new Date(dateString);
    // Use the user's current timezone explicitly
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const formatter = new Intl.DateTimeFormat('en-CA', { // 'en-CA' gives YYYY-MM-DD format
      timeZone: userTimezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    return formatter.format(date);
  };

  // Handle search input changes - simple search as you type
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    // If user completely clears the search input and no other filters, go back to popular events page
    if (!value.trim() && !category && !location && !dateFrom && !dateTo) {
      navigate('/search');
      return;
    }
  };

  // Build search filters using debounced query with useMemo to prevent unnecessary re-creation
  const searchFilters: SearchFilters = useMemo(() => ({
    query: debouncedQuery,
    category: category,
    location: location,
    dateFrom: dateFrom ? formatDateForAPI(dateFrom) : undefined,
    dateTo: dateTo ? formatDateForAPI(dateTo) : undefined,
  }), [debouncedQuery, category, location, dateFrom, dateTo]);

  // Execute search when debounced query or filters change
  useEffect(() => {
    if (debouncedQuery.trim() || category || location || dateFrom || dateTo) {
      executeSearch();
    } else {
      setResults([]);
      setIsLoading(false);
    }
  }, [debouncedQuery, category, location, dateFrom, dateTo]);

  const executeSearch = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await searchEvents(searchFilters);
      setResults(result.events);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Transform search results for EventCard - handle SearchResult object structure
  const searchResults = results ? results : [];
  const totalCount = results?.length || 0;

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      // Optional: Enter key triggers immediate search without waiting for debounce
      setDebouncedQuery(searchQuery);
      setDisplayQuery(searchQuery);

      // Update URL immediately
      if (searchQuery.trim()) {
        const queryParams = new URLSearchParams(searchParams);
        queryParams.set("q", searchQuery.trim());
        window.history.replaceState({}, '', `/search/result?${queryParams.toString()}`);
      } else {
        const queryParams = new URLSearchParams(searchParams);
        queryParams.delete("q");
        const newUrl = queryParams.toString() ? `/search/result?${queryParams.toString()}` : '/search/result';
        window.history.replaceState({}, '', newUrl);
      }
    }
  };

  // Helper functions to clear filters
  const clearFilter = (filterType: string) => {
    const queryParams = new URLSearchParams(searchParams);
    queryParams.delete(filterType);
    navigate(`/search/result?${queryParams.toString()}`);
  };

  const clearDateFilter = () => {
    const queryParams = new URLSearchParams(searchParams);
    queryParams.delete('dateFrom');
    queryParams.delete('dateTo');
    navigate(`/search/result?${queryParams.toString()}`);
  };

  const clearAllFilters = () => {
    navigate('/search');
  };

  const goBackToSearch = () => {
    navigate('/search');
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
            onChange={handleSearchInputChange}
            onKeyDown={handleSearch}
            className={`w-full px-4 py-3 pl-12 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blizbi-teal focus:border-transparent transition-all ${searchQuery !== debouncedQuery ? 'border-blizbi-teal/50' : ''
              }`}
          />
          <SearchIcon className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors ${searchQuery !== debouncedQuery ? 'text-blizbi-teal' : 'text-gray-400'
            }`} />
          {searchQuery !== debouncedQuery && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-blizbi-teal border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </div>

      {/* Search Results */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={goBackToSearch}
              className="flex items-center gap-2 text-gray-600 hover:text-blizbi-teal transition-colors"
              title={t("search_results.back_to_search")}
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">{t("search_results.back")}</span>
            </button>
            <h2 className="text-2xl font-bold text-gray-800">
              {debouncedQuery ? t("search_results.results_for", { query: debouncedQuery }) :
                (category || location || dateFrom || dateTo) ? t("search_results.filtered_results") : t("search_results.search_results")}
            </h2>
          </div>
          <div className="text-sm text-gray-500">
            {isLoading ?
              (searchQuery !== debouncedQuery ? t("search_results.typing") : t("search_results.searching")) :
              t("search_results.results_count", {
                count: totalCount,
                results: totalCount === 1 ? t("search_results.result") : t("search_results.results")
              })}
          </div>
        </div>

        {/* Active Filters */}
        {(category || location || dateFrom || dateTo) && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2 items-center">
              {category && (
                <div className="bg-blizbi-teal/10 text-blizbi-teal px-3 py-1 rounded-full text-sm flex items-center gap-2 group hover:bg-blizbi-teal/20 transition-colors">
                  <span>{t("search_results.category")}: {category}</span>
                  <button
                    onClick={() => clearFilter('category')}
                    className="hover:bg-blizbi-teal/30 rounded-full p-0.5 transition-colors"
                    title={t("search_results.remove_category_filter")}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              {location && (
                <div className="bg-blizbi-teal/10 text-blizbi-teal px-3 py-1 rounded-full text-sm flex items-center gap-2 group hover:bg-blizbi-teal/20 transition-colors">
                  <span>{t("search_results.location")}: {location}</span>
                  <button
                    onClick={() => clearFilter('location')}
                    className="hover:bg-blizbi-teal/30 rounded-full p-0.5 transition-colors"
                    title={t("search_results.remove_location_filter")}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              {(dateFrom || dateTo) && (
                <div className="bg-blizbi-teal/10 text-blizbi-teal px-3 py-1 rounded-full text-sm flex items-center gap-2 group hover:bg-blizbi-teal/20 transition-colors">
                  <span>{t("search_results.date")}: {dateFrom ? format(new Date(dateFrom), 'MMM d') : ''}{dateTo ? ` - ${format(new Date(dateTo), 'MMM d')}` : ''}</span>
                  <button
                    onClick={() => {
                      clearDateFilter();
                    }}
                    className="hover:bg-blizbi-teal/30 rounded-full p-0.5 transition-colors"
                    title={t("search_results.remove_date_filter")}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              {(category || location || dateFrom || dateTo) && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-gray-500 hover:text-blizbi-teal underline transition-colors ml-2"
                >
                  {t("search_results.clear_all_filters")}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="text-gray-500">{t("search_results.searching_events")}</div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">{t("search_results.error_searching")}</div>
            <p className="text-gray-600">{t("search_results.error_message")}</p>
          </div>
        )}

        {/* Results */}
        {!isLoading && !error && (
          <>
            {searchResults.length > 0 ? (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-4 justify-items-center">
                {searchResults.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                {!debouncedQuery && !category && !location && !dateFrom && !dateTo ? (
                  <div>
                    <div className="mb-4">{t("search_results.start_typing")}</div>
                    <p className="text-sm">{t("search_results.start_typing_hint")}</p>
                  </div>
                ) : (
                  <div>
                    <div className="mb-4">{t("search_results.no_events_found")}</div>
                    <p className="text-sm">{t("search_results.try_different")}</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchResult;
