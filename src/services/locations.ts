import { apiClient } from '../lib/api-client';

export interface LocationData {
  id: number;
  name: string;
  address?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  created_at?: string;
  updated_at?: string;
}

/**
 * Get all locations
 * Note: This endpoint is public (AllowAny permission)
 */
export const getLocations = async (): Promise<LocationData[]> => {
  try {
    const response = await apiClient.get<LocationData[] | { results: LocationData[] }>('/core/locations/');
    console.log('Locations API response:', response);

    // Handle both direct array and paginated response
    if (Array.isArray(response)) {
      return response;
    } else if (response && typeof response === 'object' && 'results' in response && Array.isArray(response.results)) {
      return response.results;
    } else {
      console.warn('Locations API returned unexpected format:', response);
      return [];
    }
  } catch (error: any) {
    console.error('Error fetching locations:', error);

    // Provide more helpful error messages
    if (error?.status === 500) {
      throw new Error('Server error occurred while fetching locations.');
    } else if (error?.status === 404) {
      throw new Error('Locations endpoint not found.');
    } else if (error?.message) {
      throw error;
    } else {
      throw new Error('Failed to fetch locations. Please check your connection.');
    }
  }
};

/**
 * Get location by ID
 */
export const getLocationById = async (id: string | number): Promise<LocationData> => {
  try {
    return await apiClient.get<LocationData>(`/core/locations/${id}/`);
  } catch (error) {
    console.error('Error fetching location:', error);
    throw error;
  }
};

/**
 * Create a new location
 */
export const createLocation = async (locationData: Partial<LocationData>): Promise<LocationData> => {
  try {
    return await apiClient.post<LocationData>('/core/locations/', locationData);
  } catch (error) {
    console.error('Error creating location:', error);
    throw error;
  }
};
