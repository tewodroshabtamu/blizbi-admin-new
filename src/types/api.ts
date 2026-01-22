// API Response Types
export interface PaginatedResponse<T> {
    data: T[];  // Backend uses 'data' not 'results'
    pagination: {
        total: number;
        count: number;
        page: number;
        page_size: number;
        total_pages: number;
        next?: string | null;
        previous?: string | null;
    };
}

export interface ApiError {
    error?: string;
    detail?: string;
    message?: string;
}

// Event Types
export interface ApiEvent {
    id: number;
    title: string;
    description: string;
    start_date: string;
    end_date: string | null;
    location_id?: number;
    provider_id: number;
    image_url?: string;
    created_at: string;
    updated_at: string;
}

// Provider Types
export interface ApiProvider {
    id: number;
    name: string;
    description: string;
    logo_url?: string;
    website?: string;
    email?: string;
    phone?: string;
    created_at: string;
    updated_at: string;
}

// User Profile Types
export interface ApiUserProfile {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    phone_number?: string;
    avatar_url?: string;
}
