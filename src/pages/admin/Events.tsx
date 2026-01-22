import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Edit, Eye, Plus, Trash2, Search, Users } from "lucide-react";
import Table from "../../components/Table";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import Pagination from "../../components/ui/Pagination";
import { searchEvents, createEvent as createEventService, updateEvent as updateEventService, deleteEvent as deleteEventService, EventData } from "../../services/events";

type Event = {
  id: number | string;
  title: string;
  event_type?: string;
  start_date: string;
  end_date: string | null;
  created_at: string;
  provider_name?: string;
  provider?: {
    id: number;
    name: string;
  };
  views?: number;
  participants?: number;
};

const Events: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("all");
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const ITEMS_PER_PAGE = 10;

  // Fetch events from API
  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all events for client-side filtering (like providers page)
      // Using a large page_size to get all events for filtering
      const result = await searchEvents({ page_size: 1000 });

      const transformedEvents: Event[] = result.events.map(event => ({
        ...event,
        id: event.id.toString(),
        provider_name: event.provider?.name || t('admin.events.unknown_provider'),
        views: 0, // TODO: Add views from analytics when available
        participants: 0, // TODO: Add participants from analytics when available
      }));

      setEvents(transformedEvents);
      setTotalCount(result.totalCount);
    } catch (err: any) {
      console.error('Error fetching events:', err);
      setError(err?.message || 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  }, [t]);

  // Fetch events when page changes
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Reset page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Client-side filtering like providers page
  const filteredEvents = events.filter((event) => {
    if (!searchTerm) return true;

    return (
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.provider_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedEvents = filteredEvents.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Create event
  const createEvent = async (eventData: Partial<EventData>) => {
    try {
      const data = await createEventService(eventData);

      // Add to local state with mock metrics
      const newEvent: Event = {
        ...data,
        id: data.id.toString(),
        provider_name: data.provider?.name || t('admin.events.unknown_provider'),
        views: 0,
        participants: 0,
      };
      setEvents(prev => [newEvent, ...prev]);
      setTotalCount(prev => prev + 1);
      return { success: true, data };
    } catch (err: any) {
      console.error('Error creating event:', err);
      return {
        success: false,
        error: err?.message || 'Failed to create event'
      };
    }
  };

  // Update event
  const updateEvent = async (id: string, updates: Partial<EventData>) => {
    try {
      const data = await updateEventService(id, updates);

      // Update local state
      setEvents(prev => prev.map(event =>
        event.id === id
          ? { ...event, ...data, id: data.id.toString(), provider_name: data.provider?.name || event.provider_name }
          : event
      ));

      return { success: true, data };
    } catch (err: any) {
      console.error('Error updating event:', err);
      return {
        success: false,
        error: err?.message || 'Failed to update event'
      };
    }
  };

  // Delete event
  const deleteEvent = async (id: string) => {
    try {
      await deleteEventService(id);

      // Remove from local state
      setEvents(prev => prev.filter(event => event.id !== id));
      setTotalCount(prev => prev - 1);
      return { success: true };
    } catch (err: any) {
      console.error('Error deleting event:', err);
      return {
        success: false,
        error: err?.message || 'Failed to delete event'
      };
    }
  };

  const handleDelete = async (eventId: string) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      const result = await deleteEvent(eventId);
      if (result.success) {
        toast.success('Event deleted successfully');
      } else {
        toast.error(result.error || 'Failed to delete event');
      }
    }
  };

  const handleEdit = (eventId: string) => {
    navigate(`/admin/events/new?edit=${eventId}`);
  };

  const handleView = (eventId: string) => {
    navigate(`/admin/events/${eventId}`);
  };

  const getEventStatus = (eventType: string) => {
    // Since we don't have a status field in the schema, we'll use event_type
    switch (eventType) {
      case 'event':
        return { label: t("admin.events.status.published"), color: 'bg-green-100 text-green-800' };
      case 'recurrent':
        return { label: t("admin.events.status.recurring"), color: 'bg-blue-100 text-blue-800' };
      default:
        return { label: t("admin.events.status.draft"), color: 'bg-gray-100 text-gray-800' };
    }
  };

  const columns = [
    {
      header: t("admin.events.table.name"),
      width: "30%",
      accessor: (event: Event) => (
        <div className="flex flex-col py-1 min-h-[60px]">
          <span className="font-medium text-gray-900 leading-tight break-words hyphens-auto max-w-[180px] sm:max-w-[240px] md:max-w-[300px] lg:max-w-[400px] xl:max-w-none">{event.title}</span>
          <div className="flex gap-2 mt-2">
            <Badge
              className={`w-fit text-xs ${getEventStatus(event.event_type).color}`}
            >
              {getEventStatus(event.event_type).label}
            </Badge>
          </div>
          <span className="text-xs text-gray-500 mt-1">
            {new Date(event.created_at).toLocaleDateString()}
          </span>
        </div>
      ),
    },
    {
      header: t("admin.events.table.provider"),
      width: "15%",
      accessor: (event: Event) => (
        <span className="text-blizbi-teal font-medium text-sm truncate block max-w-[100px] sm:max-w-[150px] lg:max-w-[200px]">{event.provider_name}</span>
      ),
    },
    {
      header: t("admin.events.table.dates"),
      width: "18%",
      accessor: (event: Event) => (
        <div className="text-xs sm:text-sm">
          <div className="font-medium">{new Date(event.start_date).toLocaleDateString()}</div>
          <div className="text-gray-500">
            {event.end_date ? new Date(event.end_date).toLocaleDateString() : t("admin.events.table.no_end_date")}
          </div>
        </div>
      ),
    },
    {
      header: t("admin.events.table.views"),
      width: "10%",
      accessor: (event: Event) => (
        <div className="flex items-center gap-1 sm:gap-2">
          <Eye className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
          <span className="text-sm font-medium">{event.views?.toLocaleString() || '0'}</span>
        </div>
      ),
    },
    {
      header: t("admin.events.table.participants"),
      width: "12%",
      accessor: (event: Event) => (
        <div className="flex items-center gap-1 sm:gap-2">
          <Users className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
          <span className="text-sm font-medium">
            {event.participants?.toLocaleString() || '0'}
          </span>
        </div>
      ),
    },
    {
      header: t("admin.events.table.actions"),
      width: "23%",
      align: "right" as const,
      accessor: (event: Event) => (
        <div className="flex items-center justify-end gap-1 sm:gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleView(event.id)}
            className="text-gray-600 hover:text-gray-900 p-1 sm:p-2"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(event.id)}
            className="text-gray-600 hover:text-gray-900 p-1 sm:p-2"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(event.id)}
            className="text-red-600 hover:text-red-700 p-1 sm:p-2"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">{t("admin.events.loading")}</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-red-500">{t("admin.events.error")}: {error}</div>
          <Button
            onClick={fetchEvents}
            className="ml-4"
            variant="outline"
          >
            {t("admin.events.retry")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Section */}

      {/* Header and Table */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{t("admin.events.title")}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {t("admin.events.events_count", {
              filtered: filteredEvents.length,
              total: totalCount,
              type: searchTerm ? t("admin.events.filtered") : t("admin.events.total")
            })}
          </p>
        </div>
      </div>
      <div className="flex justify-between gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder={t("admin.events.search_placeholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blizbi-teal focus:border-transparent"
            />
          </div>
        </div>
        <Link
          to="/admin/events/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blizbi-teal text-white rounded-sm hover:bg-blizbi-teal/90 transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>{t("admin.events.new_event")}</span>
        </Link>
      </div>

      <Card>
        <Table
          columns={columns}
          data={paginatedEvents}
          keyExtractor={(event) => event.id}
        />

        {/* Updated pagination controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t">
            <div className="text-sm text-gray-500">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredEvents.length)} of {filteredEvents.length} events
              {searchTerm && ` (filtered from ${totalCount} total)`}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              showPreviousNext={true}
              maxVisiblePages={5}
            />
          </div>
        )}
      </Card>
    </div>
  );
};

export default Events;
