import { apiClient } from '../lib/api-client';

export interface HealthCheckResponse {
    status: string;
    timezone: string;
    current_time: string;
    message: string;
}

/**
 * Test API connectivity and authentication
 */
export const checkHealth = async (): Promise<HealthCheckResponse> => {
    return apiClient.get<HealthCheckResponse>('/health/');
};

/**
 * Test authenticated endpoint
 */
export const getUserProfile = async () => {
    return apiClient.get('/profile/');
};
