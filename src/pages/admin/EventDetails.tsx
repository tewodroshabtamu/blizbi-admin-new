import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Clock, Users, DollarSign, Edit, Trash2 } from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { getEventById, deleteEvent as deleteEventService, EventData } from '../../services/events';

interface EventDetails {
  id: string;
  title: string;
  provider_id: string;
  provider_name?: string;
  event_type: 'event' | 'recurrent';
  start_date: string;
  end_date: string | null;
  start_time: string;
  end_time: string | null;
  cover_url: string | null;
  details: {
    description: string;
    location: string;
    address: string;
    category: string;
    price: string;
    capacity: string;
    tags: string[];
  };
  created_at: string;
  updated_at: string;
  providers?: {
    id: string;
    name: string;
  };
}

interface Provider {
  id: string;
  name: string;
}

interface EventData {
  id: string;
  title: string;
  provider_id: string;
  event_type: 'event' | 'recurrent';
  start_date: string;
  end_date: string | null;
  start_time: string;
  end_time: string | null;
  cover_url: string | null;
  created_at: string;
  updated_at: string;
  details: EventDetails['details'];
  providers: Provider;
}

const EventDetails: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<EventDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    if (!id) {
      setError(t('admin.event_details.event_id_required'));
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await getEventById(id);

      // Transform the data to match EventDetails type
      const transformedData: EventDetails = {
        id: data.id.toString(),
        title: data.title,
        provider_id: data.provider_id.toString(),
        provider_name: data.provider?.name,
        event_type: 'event' as const, // Default, adjust based on API response
        start_date: data.start_date,
        end_date: data.end_date || null,
        start_time: '', // Extract from start_date if needed
        end_time: null,
        cover_url: data.image_url || null,
        created_at: data.created_at || new Date().toISOString(),
        updated_at: data.updated_at || new Date().toISOString(),
        details: {
          description: data.description || '',
          location: '',
          address: '',
          category: '',
          price: '',
          capacity: '',
          tags: [],
        },
        providers: data.provider ? {
          id: data.provider.id.toString(),
          name: data.provider.name,
        } : undefined,
      };

      setEvent(transformedData);
    } catch (err: any) {
      console.error('Error fetching event details:', err);
      const errorMessage = err?.message || t('admin.event_details.failed_to_fetch');
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!event || !window.confirm(t('admin.event_details.delete_confirmation'))) return;

    try {
      await deleteEventService(event.id);
      toast.success(t('admin.event_details.event_deleted'));
      navigate('/admin/events');
    } catch (err: any) {
      console.error('Error deleting event:', err);
      toast.error(err?.message || t('admin.event_details.failed_to_delete'));
    }
  };

  const handleEdit = () => {
    navigate(`/admin/events/new?edit=${id}`);
  };

  const getEventStatus = (eventType: string) => {
    switch (eventType) {
      case 'event':
        return { label: t('admin.events.status.published'), color: 'bg-green-100 text-green-800' };
      case 'recurrent':
        return { label: t('admin.events.status.recurring'), color: 'bg-blue-100 text-blue-800' };
      default:
        return { label: t('admin.events.status.draft'), color: 'bg-gray-100 text-gray-800' };
    }
  };

  // Add issued date to the event details
  const formatDate = (date: string | undefined) => {
    if (!date) return t('admin.event_details.not_available');
    return new Date(date).toLocaleDateString();
  };

  const formatUpdateDate = (date: string | undefined) => {
    if (!date) return t('admin.event_details.not_available');
    return format(new Date(date), 'MMM d, yyyy');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">{t('admin.event_details.loading')}</div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">{t('admin.event_details.error')}: {error || t('admin.event_details.event_not_found')}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/admin/events"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('admin.event_details.back_to_events')}</span>
          </Link>
          <div className="h-6 w-px bg-gray-300" />
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{event.title}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={`${getEventStatus(event.event_type).color}`}>
                {getEventStatus(event.event_type).label}
              </Badge>
              <span className="text-sm text-gray-500">
                {t('admin.event_details.last_updated')} {formatUpdateDate(event?.updated_at)}
              </span>
              <span className="text-sm text-gray-500">
                {t('admin.event_details.issued_on')} {formatDate(event?.created_at)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleEdit}
            className="flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            {t('admin.event_details.edit_event')}
          </Button>
          <Button
            variant="outline"
            onClick={handleDelete}
            className="flex items-center gap-2 text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
            {t('admin.event_details.delete')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="col-span-2 space-y-6">
          {/* Cover Image */}
          {event.cover_url && (
            <Card className="overflow-hidden">
              <img
                src={event.cover_url}
                alt={event.title}
                className="w-full h-[300px] object-cover"
              />
            </Card>
          )}

          {/* Description */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">{t('admin.event_details.description')}</h2>
            <p className="text-gray-600 whitespace-pre-wrap break-words overflow-wrap-anywhere">{event.details.description}</p>
          </Card>

          {/* Location */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blizbi-teal" />
              {t('admin.event_details.location')}
            </h2>
            <div className="space-y-2">
              <p className="font-medium">{event.details.location}</p>
              <p className="text-gray-600">{event.details.address}</p>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Event Details */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">{t('admin.event_details.event_details')}</h2>
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium">{t('admin.event_details.date_time')}</span>
                </div>
                <div className="ml-6">
                  <p>{format(new Date(event.start_date), 'MMMM d, yyyy')}</p>
                  <p className="text-gray-600">
                    {event.start_time}
                    {event.end_time ? ` - ${event.end_time}` : ''}
                  </p>
                  {event.end_date && (
                    <p className="text-gray-600 mt-1">
                      {t('admin.event_details.until')} {format(new Date(event.end_date), 'MMMM d, yyyy')}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <Users className="w-4 h-4" />
                  <span className="font-medium">{t('admin.event_details.capacity')}</span>
                </div>
                <p className="ml-6">{event.details.capacity}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <DollarSign className="w-4 h-4" />
                  <span className="font-medium">{t('admin.event_details.price')}</span>
                </div>
                <p className="ml-6">{event.details.price}</p>
              </div>
            </div>
          </Card>

          {/* Category & Tags */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">{t('admin.event_details.category_tags')}</h2>
            <div className="space-y-4">
              <div>
                <p className="text-gray-600 mb-1">{t('admin.event_details.category')}</p>
                <Badge variant="outline">{event.details.category}</Badge>
              </div>
              {event.details.tags && event.details.tags.length > 0 && (
                <div>
                  <p className="text-gray-600 mb-2">{t('admin.event_details.tags')}</p>
                  <div className="flex flex-wrap gap-2">
                    {event.details.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Provider Info */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">{t('admin.event_details.provider')}</h2>
            <Link
              to={`/admin/providers/${event.provider_id}`}
              className="text-blizbi-teal hover:underline font-medium"
            >
              {event.provider_name}
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
