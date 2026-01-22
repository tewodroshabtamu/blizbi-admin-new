import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProviderById, deleteProvider as deleteProviderService, ProviderData } from '../../services/providers';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

type ProviderDetails = ProviderData & {
  cover_url?: string;
  website_url?: string;
  short_description?: string;
  rss_urls?: string[];
};

const ProviderDetails: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [provider, setProvider] = useState<ProviderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProviderDetails();
  }, [id]);

  const fetchProviderDetails = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const data = await getProviderById(id);
      setProvider(data as ProviderDetails);
    } catch (err: any) {
      console.error('Error fetching provider details:', err);
      setError(err?.message || t('admin.provider_details.failed_to_fetch'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!provider) return;
    if (window.confirm(t('admin.provider_details.delete_confirmation'))) {
      try {
        await deleteProviderService(provider.id);
        toast.success(t('admin.provider_details.provider_deleted'));
        navigate('/admin/providers');
      } catch (err: any) {
        console.error('Error deleting provider:', err);
        toast.error(err?.message || t('admin.provider_details.failed_to_delete'));
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">{t('admin.provider_details.loading')}</div>
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">{t('admin.provider_details.error')}: {error || t('admin.provider_details.provider_not_found')}</div>
      </div>
    );
  }

  // Add additional provider details
  const coverImage = provider.cover_url ? (
    <img src={provider.cover_url} alt={provider.name} className="w-full h-48 object-cover rounded-md" />
  ) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          to="/admin/providers"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('admin.provider_details.back_to_providers')}</span>
        </Link>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/admin/providers/new?edit=${provider.id}`, {
              state: { from: 'provider_details' }
            })}
            className="flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            {t('admin.provider_details.edit_provider')}
          </Button>
          <Button
            variant="outline"
            onClick={handleDelete}
            className="flex items-center gap-2 text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
            {t('admin.provider_details.delete_provider')}
          </Button>
        </div>
      </div>

      <Card className="p-6">
        {coverImage}
        <h1 className="text-2xl font-semibold text-gray-900 mt-4">{provider.name}</h1>
        <p className="text-sm text-gray-500 mt-1">{t('admin.provider_details.joined_on')} {new Date(provider.created_at).toLocaleDateString()}</p>

        <div className="mt-4 space-y-2">
          <div>
            <span className="font-medium">{t('admin.provider_details.email')}:</span> {provider.email}
          </div>
          <div>
            <span className="font-medium">{t('admin.provider_details.phone')}:</span> {provider.phone}
          </div>
          <div>
            <span className="font-medium">{t('admin.provider_details.address')}:</span> {provider.address}
          </div>
          {provider.website_url || provider.website ? (
            <div>
              <span className="font-medium">{t('admin.provider_details.website')}:</span> <a href={provider.website_url || provider.website} className="text-blizbi-teal hover:underline">{provider.website_url || provider.website}</a>
            </div>
          ) : null}
          <div>
            <span className="font-medium">{t('admin.provider_details.short_description')}:</span> {provider.short_description}
          </div>
          {provider.rss_urls && provider.rss_urls.length > 0 && (
            <div>
              <span className="font-medium">{t('admin.provider_details.rss_urls')}:</span>
              <ul className="list-disc list-inside">
                {provider.rss_urls.map((url, index) => (
                  <li key={index}>
                    <a href={url} className="text-blizbi-teal hover:underline">{url}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ProviderDetails;
