import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Edit,
  Eye,
  Plus,
  Trash2,
  Search,
  Building,
  Globe,
  Calendar,
} from "lucide-react";
import { DataTable } from "../../components/ui/DataTable";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { getProviders, deleteProvider as deleteProviderService, ProviderData } from "../../services/providers";
import { searchEvents } from "../../services/events";
import { DeleteConfirmationModal } from "../../components/ui/DeleteConfirmationModal";

import { AdminProvider } from '../../types/admin';

const Providers: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEventRange, setSelectedEventRange] = useState("all");
  const [providers, setProviders] = useState<AdminProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [providerToDelete, setProviderToDelete] = useState<string | number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  // Fetch providers from API
  const fetchProviders = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all providers (using large page_size to get all)
      const providersData = await getProviders(1, 1000);

      if (!providersData || providersData.length === 0) {
        setProviders([]);
        return;
      }

      // Use event_count from backend response if available, otherwise count manually
      const providersWithEventCount = providersData.map(provider => ({
        ...provider,
        website_url: provider.website || '',
        eventsCount: (provider as any).event_count || 0, // Backend provides event_count
      }));

      const sortedProviders = providersWithEventCount.sort((a, b) => {
        // First sort by events count (descending)
        if (b.eventsCount !== a.eventsCount) {
          return (b.eventsCount || 0) - (a.eventsCount || 0);
        }
        // Then sort by created_at (ascending)
        const aDate = a.created_at ? new Date(a.created_at).getTime() : 0;
        const bDate = b.created_at ? new Date(b.created_at).getTime() : 0;
        return aDate - bDate;
      });
      setProviders(sortedProviders);
    } catch (err: any) {
      setError(
        err?.message || "Failed to fetch providers"
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteProvider = async (id: string | number) => {
    try {
      // Check if provider has events
      const allEvents = await searchEvents({ page_size: 1000 });
      const providerEvents = allEvents.events.filter(
        event => event.provider_id === Number(id)
      );

      if (providerEvents.length > 0) {
        return {
          success: false,
          error: t("admin.providers.cannot_delete_with_events"),
        };
      }

      await deleteProviderService(id);

      // Remove from local state
      setProviders((prev) => prev.filter((provider) => provider.id !== id));
      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || t("admin.providers.failed_to_delete"),
      };
    }
  };

  // Load providers on component mount
  useEffect(() => {
    fetchProviders();
  }, []);

  // Listen for refresh events from other components
  useEffect(() => {
    const handleRefreshProviders = () => {
      fetchProviders();
    };

    window.addEventListener("refreshProviders", handleRefreshProviders);

    return () => {
      window.removeEventListener("refreshProviders", handleRefreshProviders);
    };
  }, []);

  // Filter providers based on search and event count
  const filteredProviders = providers.filter((provider) => {
    const matchesSearch =
      provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.website_url.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesEventRange = true;
    const eventsCount = provider.eventsCount || 0;
    if (selectedEventRange === "low") {
      matchesEventRange = eventsCount <= 2;
    } else if (selectedEventRange === "medium") {
      matchesEventRange = eventsCount >= 3 && eventsCount <= 5;
    } else if (selectedEventRange === "high") {
      matchesEventRange = eventsCount > 5;
    }

    return matchesSearch && matchesEventRange;
  });

  const handleDeleteClick = (providerId: string | number) => {
    setProviderToDelete(providerId);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!providerToDelete) return;
    
    setIsDeleting(true);
    const result = await deleteProvider(providerToDelete);
    setIsDeleting(false);
    
    if (result.success) {
      setDeleteModalOpen(false);
      setProviderToDelete(null);
    } else {
      toast.error(result.error || t("admin.providers.failed_to_delete"));
    }
  };

  const handleEdit = (providerId: string | number) => {
    navigate(`/admin/providers/new?edit=${providerId}`, {
      state: { from: "providers_table" },
    });
  };

  const handleView = (providerId: string | number) => {
    navigate(`/admin/providers/${providerId}`);
  };

  const columns = [
    {
      header: t("admin.providers.table.name"),
      accessor: (provider: Provider) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blizbi-teal/10 rounded-full flex items-center justify-center">
            <Building className="w-5 h-5 text-blizbi-teal" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-gray-900">{provider.name}</span>
          </div>
        </div>
      ),
    },
    {
      header: t("admin.providers.table.website"),
      accessor: (provider: Provider) => {
        const websiteUrl = provider.website_url || provider.website || '';
        return (
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-gray-400" />
            {websiteUrl ? (
              <a
                href={websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blizbi-teal hover:text-blizbi-teal/80 font-medium"
              >
                {websiteUrl.replace(/^https?:\/\//, "")}
              </a>
            ) : (
              <span className="text-gray-400 text-sm">{t("admin.providers.no_website")}</span>
            )}
          </div>
        );
      },
    },
    {
      header: t("admin.providers.table.events"),
      accessor: (provider: Provider) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="font-medium">{provider.eventsCount || 0}</span>
          <span className="text-sm text-gray-500">
            {t("admin.providers.table.events_label")}
          </span>
        </div>
      ),
    },
    {
      header: t("admin.providers.table.actions"),
      align: "right" as const,
      accessor: (provider: Provider) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleView(provider.id)}
            className="text-gray-600 hover:text-gray-900"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(provider.id)}
            className="text-gray-600 hover:text-gray-900"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteClick(provider.id.toString())}
            className="text-red-600 hover:text-red-700"
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
          <div className="text-gray-500">{t("loading")}</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-red-500">
            {t("admin.providers.error")}: {error}
          </div>
          <Button onClick={fetchProviders} className="ml-4" variant="outline">
            {t("admin.providers.retry")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Table */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {t("admin.providers.title")}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {t("admin.providers.providers_count", {
              filtered: filteredProviders.length,
              total: providers.length,
              type:
                searchTerm || selectedEventRange !== "all"
                  ? t("admin.providers.filtered")
                  : t("admin.providers.total"),
            })}
          </p>
        </div>
      </div>
      <div className="flex justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder={t("admin.providers.search_placeholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blizbi-teal focus:border-transparent"
          />
        </div>
        <Link
          to="/admin/providers/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blizbi-teal text-white rounded-sm hover:bg-blizbi-teal/90 transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>{t("admin.providers.new_provider")}</span>
        </Link>
      </div>
      <Card>
        <DataTable
          columns={columns}
          data={filteredProviders}
          keyExtractor={(provider) => provider.id.toString()}
          emptyMessage={t("admin.providers.no_providers")}
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          open={deleteModalOpen}
          onOpenChange={setDeleteModalOpen}
          onConfirm={handleDeleteConfirm}
          title={(() => {
            const translated = t("admin.providers.delete_confirmation_title");
            return translated !== "admin.providers.delete_confirmation_title" ? translated : "Delete Provider";
          })()}
          description={(() => {
            const translated = t("admin.providers.delete_confirmation_message");
            return translated !== "admin.providers.delete_confirmation_message" ? translated : "Are you sure you want to delete this provider? This action cannot be undone.";
          })()}
          itemName={providerToDelete ? providers.find(p => p.id === providerToDelete)?.name : undefined}
          isLoading={isDeleting}
        />
      </Card>
    </div>
  );
};

export default Providers;
