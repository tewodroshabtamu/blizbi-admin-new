import { apiClient } from '../lib/api-client';
import { PaginatedResponse } from '../types/api';

export interface ProviderData {
  id: number;
  name: string;
  description?: string;
  logo_url?: string;
  website?: string;
  email?: string;
  phone?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Get all providers with pagination
 */
export const getProviders = async (page: number = 1, page_size: number = 25) => {
  try {
    const response = await apiClient.get<PaginatedResponse<ProviderData>>('/providers/', {
      page,
      page_size,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching providers:', error);
    throw error;
  }
};

/**
 * Get provider by ID
 */
export const getProviderById = async (id: string | number): Promise<ProviderData> => {
  try {
    return await apiClient.get<ProviderData>(`/providers/${id}/`);
  } catch (error) {
    console.error('Error fetching provider:', error);
    throw error;
  }
};

/**
 * Create a new provider
 */
export const createProvider = async (providerData: Partial<ProviderData>): Promise<ProviderData> => {
  try {
    return await apiClient.post<ProviderData>('/providers/', providerData);
  } catch (error) {
    console.error('Error creating provider:', error);
    throw error;
  }
};

/**
 * Update an existing provider
 */
export const updateProvider = async (
  id: string | number,
  providerData: Partial<ProviderData>
): Promise<ProviderData> => {
  try {
    return await apiClient.patch<ProviderData>(`/providers/${id}/`, providerData);
  } catch (error) {
    console.error('Error updating provider:', error);
    throw error;
  }
};

/**
 * Delete a provider
 */
export const deleteProvider = async (id: string | number): Promise<void> => {
  try {
    await apiClient.delete(`/providers/${id}/`);
  } catch (error) {
    console.error('Error deleting provider:', error);
    throw error;
  }
};

/**
 * Get featured providers
 */
export const getFeaturedProviders = async () => {
  try {
    // TODO: Add a filter for featured providers when backend supports it
    const response = await apiClient.get<PaginatedResponse<ProviderData>>('/providers/', {
      page_size: 10,
    });
    return response.data.map((p) => ({
      id: p.id,
      imageUrl: p.logo_url,
      title: p.name,
      description: p.description,
    }));
  } catch (error) {
    console.error('Error fetching featured providers:', error);
    throw error;
  }
};
