import { supabase } from "@/lib/supabase-client";
import { format } from "date-fns";

export interface EventData {
  id: string;
  title: string;
  start_date: string;
  end_date: string | null;
  start_time: string | null;
  end_time: string | null;
  cover_url: string | null;
  price_type: "free" | "paid";
  details: {
    description?: string;
    location?: { latitude: number; longitude: number } | string;
    address?: string;
    category?: string;
    price?: string;
    capacity?: string;
    tags?: string[];
  };
  providers: {
    id: string;
    name: string;
  };
}

export interface SearchFilters {
  query?: string;
  category?: string;
  location?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export interface SearchResult {
  events: any[];
  totalCount: number;
  hasMore: boolean;
}

// Search events with filters (optimized with pagination and full-text search)
export const searchEvents = async (
  filters: SearchFilters
): Promise<SearchResult> => {
  try {
    const page = filters.page || 0;
    const limit = filters.limit || 20; // Add pagination with default limit
    const offset = page * limit;

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
          id,
          name
        )
      `,
        { count: "exact" }
      )
      .order("start_date", { ascending: true });

    // Apply search query filter - only search in event title for better relevance
    if (filters.query && filters.query.trim()) {
      const searchTerm = filters.query.trim();
      // Only search in title, not description, for more accurate results
      query = query.ilike("title", `%${searchTerm}%`);
    }

    // Apply date range filter (now indexed)
    if (filters.dateFrom && filters.dateTo) {
      // Check if it's a single day filter (same from and to date)
      if (filters.dateFrom === filters.dateTo) {
        // For single day filtering, match exactly on start_date
        query = query.eq("start_date", filters.dateFrom);
      } else {
        // For date range filtering, use between logic
        query = query
          .gte("start_date", filters.dateFrom)
          .lte("start_date", filters.dateTo);
      }
    } else {
      // Handle cases where only one date is provided
      if (filters.dateFrom) {
        query = query.gte("start_date", filters.dateFrom);
      }
      if (filters.dateTo) {
        query = query.lte("start_date", filters.dateTo);
      }
    }

    // Add pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error("Search events error:", error);
      throw error;
    }

    // Transform data to match EventData interface

    return {
      events: data,
      totalCount: count || 0,
      hasMore: offset + limit < (count || 0),
    };
  } catch (error) {
    console.error("Error searching events:", error);
    throw error;
  }
};

// Get popular/featured events for the search page
export const getPopularEvents = async (
  limit: number = 8
): Promise<EventData[]> => {
  try {
    const { data, error } = await supabase
      .from("event")
      .select(
        `
        *,
        providers!provider_id (
          id,
          name
        )
      `
      )
      .gte("start_date", new Date().toISOString().split("T")[0]) // Future events only
      .order("start_date", { ascending: true })
      .limit(limit);

    if (error) {
      console.error("Get popular events error:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error fetching popular events:", error);
    throw error;
  }
};

// Get available categories from events (optimized with aggregation)
export const getEventCategories = async (): Promise<string[]> => {
  try {
    // First try to get categories from the event_categories table (if it has data)
    const { data: categoryTableData, error: categoryTableError } =
      await supabase.from("event_categories").select("name").order("name");

    if (
      !categoryTableError &&
      categoryTableData &&
      categoryTableData.length > 0
    ) {
      const categories = categoryTableData
        .map((cat) => cat.name)
        .filter(Boolean);
      return ["All", ...categories];
    }

    // Fallback to getting categories from event details
    const { data: eventCategoriesData, error: eventCategoriesError } =
      await supabase
        .from("event")
        .select("details->>category")
        .not("details->>category", "is", null)
        .limit(1000); // Limit to prevent memory issues

    if (eventCategoriesError) throw eventCategoriesError;

    const categories = [
      ...new Set(
        eventCategoriesData.map((item: any) => item.category).filter(Boolean)
      ),
    ];
    return ["All", ...categories.sort()];
  } catch (error) {
    console.error("Error fetching categories:", error);
    // Return static fallback categories
    return [
      "All",
      "Music",
      "Food & Drink",
      "Arts",
      "Sports",
      "Technology",
      "Business",
      "Lifestyle",
      "Education",
    ];
  }
};

// Transform event data for EventCard component

// Enhanced Supabase query with timeout
const queryWithTimeout = async (query: any, timeoutMs: number = 8000) => {
  return Promise.race([
    query,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Query timeout")), timeoutMs)
    ),
  ]);
};
interface Provider {
  id: string;
  location: string | null;
}

interface LocationMap {
  [key: string]: string[];
}
export const getAllLocations = async () => {
  const query = supabase.from("providers").select("id, detail->>location");
  const { data, error } = await queryWithTimeout(query);
  if (error) {
    console.error("error fetching locations");
    throw error;
  }
  const locationMap = data.reduce((map: LocationMap, item: Provider) => {
    let loc = item.location ?? "unknowm";
    loc = loc === "" ? "unknown" : loc;
    if (!map[loc]) {
      map[loc] = [];

    }
    if (map[loc]) {
      map[loc].push(item.id);
    }
    return map;
  }, {} as LocationMap);

  return locationMap;
}

export const getEventsByDate = async (date: Date, providersIds?: string[] | null) => {
  const dateStr = format(date, "yyyy-MM-dd");
  let query = supabase
    .from("event")
    .select(`*, providers!provider_id(id, name)`)
    .or(
      `start_date.eq.${dateStr},and(start_date.lt.${dateStr},end_date.gt.${dateStr})`
    )
  if (providersIds !== null) {
    query = query.in("provider_id", providersIds!);
  }
  query = query.order("start_date", { ascending: false });

  const { data, error } = await queryWithTimeout(query);

  if (providersIds != null && data.length <= 3) {

    const dateFrom = format(date, "yyyy-MM-dd");
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 30);
    const dateTo = format(endDate, "yyyy-MM-dd");

    let newquery = supabase
      .from("event")
      .select(`*, providers!provider_id(id, name)`)
      .or(`and(start_date.lte.${dateTo},or(end_date.is.null,end_date.gte.${dateFrom}))`);

    newquery = newquery.in("provider_id", providersIds!);
    newquery = newquery.order("start_date", { ascending: true });

    const { data, error } = await queryWithTimeout(newquery);

    if (error) {
      console.error("Database error fetching events by month and location:", error);
      throw error;
    }

    return data;
  }

  if (error) {
    console.error("Database error fetching events by date:", error);
    throw error;
  }

  return data;
};

export const getEventById = async (id: string) => {
  const { data, error } = await supabase
    .from("event")
    .select(`*, providers!provider_id (id, name, website_url, address)`)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Database error fetching event by id:", error);
    throw error;
  }

  return data;
};

