import { apiClient } from '../lib/api-client';
import { PaginatedResponse } from '../types/api';

export interface ProviderData {
  id: number;
  provider_id?: string; // Unique identifier string (required for creation)
  name: string;
  description?: string;
  short_description?: string;
  logo_url?: string;
  cover_url?: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  location_id?: number; // Required for creation
  municipality_id?: number;
  socials?: Record<string, string>;
  is_featured?: boolean;
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
    return response.results || [];
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
 * 
 * Required fields per API documentation:
 * - provider_id (string, unique, max 255 chars)
 * - name (string, max 255 chars)
 * - website (string, valid URL, unique, max 255 chars)
 * - location_id (integer)
 */
export const createProvider = async (providerData: Partial<ProviderData>): Promise<ProviderData> => {
  try {
    // Validate required fields
    if (!providerData.provider_id) {
      throw new Error('provider_id is required');
    }
    if (!providerData.name) {
      throw new Error('name is required');
    }
    if (!providerData.website) {
      throw new Error('website is required');
    }
    if (!providerData.location_id) {
      throw new Error('location_id is required');
    }
    
    // Build payload with required fields
    const payload: any = {
      provider_id: providerData.provider_id,
      name: providerData.name,
      website: providerData.website,
      location_id: providerData.location_id,
    };
    
    // Add optional fields
    if (providerData.short_description) payload.short_description = providerData.short_description;
    if (providerData.description) payload.description = providerData.description;
    if (providerData.cover_url) payload.cover_url = providerData.cover_url;
    if (providerData.logo_url) payload.cover_url = providerData.logo_url; // Use cover_url if logo_url provided
    if (providerData.address) payload.address = providerData.address;
    if (providerData.municipality_id) payload.municipality_id = providerData.municipality_id;
    if (providerData.socials) payload.socials = providerData.socials;
    if (providerData.is_featured !== undefined) payload.is_featured = providerData.is_featured;
    
    console.log('Creating provider with payload:', payload);
    const result = await apiClient.post<ProviderData>('/providers/', payload);
    return result;
  } catch (error: any) {
    console.error('Error creating provider:', error);
    // Log the full error response for debugging
    if (error?.data) {
      console.error('Backend error details:', JSON.stringify(error.data, null, 2));
    }
    
    // Re-throw with more context
    const errorMessage = error?.data || error?.message || 'Failed to create provider';
    throw new Error(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
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
    return (response.results || []).map((p) => ({
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
