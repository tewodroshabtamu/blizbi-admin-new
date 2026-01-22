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
 * Note: This endpoint requires authentication
 */
export const getLocations = async (): Promise<LocationData[]> => {
  try {
    // This endpoint requires authentication, so the API client will automatically
    // add the Firebase token if the user is logged in
    return await apiClient.get<LocationData[]>('/core/locations/');
  } catch (error: any) {
    console.error('Error fetching locations:', error);
    
    // Provide more helpful error messages
    if (error?.status === 401) {
      throw new Error('Authentication required. Please log in to access locations.');
    } else if (error?.status === 403) {
      throw new Error('You do not have permission to access locations.');
    } else if (error?.message) {
      throw error;
    } else {
      throw new Error('Failed to fetch locations. Please ensure you are authenticated.');
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
