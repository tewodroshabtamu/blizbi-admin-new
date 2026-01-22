import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { auth } from './firebase';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

class ApiClient {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: API_BASE_URL,
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 30000, // 30 seconds
        });

        // Request interceptor to add Firebase auth token
        this.client.interceptors.request.use(
            async (config: InternalAxiosRequestConfig) => {
                try {
                    const user = auth.currentUser;
                    if (user) {
                        const token = await user.getIdToken();
                        config.headers.Authorization = `Bearer ${token}`;
                    }
                } catch (error) {
                    console.error('Error getting Firebase token:', error);
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Response interceptor for error handling
        this.client.interceptors.response.use(
            (response) => response,
            async (error: AxiosError) => {
                if (error.response) {
                    // Server responded with error status
                    const status = error.response.status;
                    const data: any = error.response.data;

                    switch (status) {
                        case 401:
                            // Unauthorized - token might be expired
                            console.error('Unauthorized. Please log in again.');
                            // Optionally trigger logout
                            break;
                        case 403:
                            console.error('Forbidden. You do not have permission.');
                            break;
                        case 404:
                            console.error('Resource not found.');
                            break;
                        case 500:
                            console.error('Server error. Please try again later.');
                            break;
                        default:
                            console.error(`API Error (${status}):`, data);
                    }

                    // Return a structured error
                    return Promise.reject({
                        status,
                        message: data?.error || data?.detail || data?.message || 'An error occurred',
                        data,
                    });
                } else if (error.request) {
                    // Request made but no response
                    console.error('No response from server:', error.request);
                    return Promise.reject({
                        status: 0,
                        message: 'Network error. Please check your connection.',
                    });
                } else {
                    // Something else happened
                    console.error('Request error:', error.message);
                    return Promise.reject({
                        status: 0,
                        message: error.message || 'An unexpected error occurred',
                    });
                }
            }
        );
    }

    // Generic GET request
    async get<T>(url: string, params?: any): Promise<T> {
        const response = await this.client.get<T>(url, { params });
        return response.data;
    }

    // Generic POST request
    async post<T>(url: string, data?: any): Promise<T> {
        const response = await this.client.post<T>(url, data);
        return response.data;
    }

    // Generic PATCH request
    async patch<T>(url: string, data?: any): Promise<T> {
        const response = await this.client.patch<T>(url, data);
        return response.data;
    }

    // Generic PUT request
    async put<T>(url: string, data?: any): Promise<T> {
        const response = await this.client.put<T>(url, data);
        return response.data;
    }

    // Generic DELETE request
    async delete<T = void>(url: string): Promise<T> {
        const response = await this.client.delete<T>(url);
        return response.data;
    }

    // Get the underlying axios instance if needed
    getClient(): AxiosInstance {
        return this.client;
    }
}

// Export a singleton instance
export const apiClient = new ApiClient();

// Export the class for testing
export default ApiClient;
