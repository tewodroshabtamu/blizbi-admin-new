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
import Table from "../../components/Table";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { supabase } from "../../lib/supabase-client";
import { Database } from "../../types/supabase";
import { useTranslation } from "react-i18next";

type Provider = Database["public"]["Tables"]["providers"]["Row"] & {
  eventsCount?: number;
};

const Providers: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEventRange, setSelectedEventRange] = useState("all");
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch providers from database
  const fetchProviders = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: providersData, error: providersError } = await supabase
        .from("providers")
        .select("*")
        .order("created_at", { ascending: false });

      if (providersError) throw providersError;

      if (!providersData) {
        setProviders([]);
        return;
      }

      // Get actual event counts for each provider
      const providersWithEventCount = await Promise.all(
        providersData.map(async (provider) => {
          const { count, error: countError } = await supabase
            .from("event")
            .select("*", { count: "exact", head: true })
            .eq("provider_id", provider.id);

          if (countError) {
            console.warn(
              `Error counting events for provider ${provider.id}:`,
              countError
            );
          }

          return {
            ...provider,
            eventsCount: count || 0,
          };
        })
      );

      const sortedProviders = providersWithEventCount.sort((a, b) => {
        // First sort by events count (descending)
        if (b.eventsCount !== a.eventsCount) {
          return b.eventsCount - a.eventsCount;
        }
        // Then sort by created_at (ascending)
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      });
      setProviders(sortedProviders);
    } catch (err) {
      console.error("Error fetching providers:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch providers"
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteProvider = async (id: string) => {
    try {
      const { data: events, error: eventsError } = await supabase
        .from("event")
        .select("id")
        .eq("provider_id", id);

      if (eventsError) throw eventsError;

      if (events && events.length > 0) {
        return {
          success: false,
          error: t("admin.providers.cannot_delete_with_events"),
        };
      }

      const { error } = await supabase.from("providers").delete().eq("id", id);

      if (error) throw error;

      // Remove from local state
      setProviders((prev) => prev.filter((provider) => provider.id !== id));
      return { success: true };
    } catch (err) {
      console.error("Error deleting provider:", err);
      return {
        success: false,
        error:
          err instanceof Error
            ? err.message
            : t("admin.providers.failed_to_delete"),
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

  const handleDelete = async (providerId: string) => {
    if (window.confirm(t("admin.providers.delete_confirmation"))) {
      const result = await deleteProvider(providerId);
      if (!result.success) {
        alert(result.error || t("admin.providers.failed_to_delete"));
      }
    }
  };

  const handleEdit = (providerId: string) => {
    navigate(`/admin/providers/new?edit=${providerId}`, {
      state: { from: "providers_table" },
    });
  };

  const handleView = (providerId: string) => {
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
      accessor: (provider: Provider) => (
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-gray-400" />
          <a
            href={provider.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blizbi-teal hover:text-blizbi-teal/80 font-medium"
          >
            {provider.website_url.replace("https://", "")}
          </a>
        </div>
      ),
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
            onClick={() => handleDelete(provider.id)}
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
        <Table
          columns={columns}
          data={filteredProviders}
          keyExtractor={(provider) => provider.id}
        />
      </Card>
    </div>
  );
};

export default Providers;
