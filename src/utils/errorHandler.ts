/**
 * Centralized error handling utilities
 */

export interface ErrorInfo {
  message: string;
  code?: string;
  details?: any;
}

/**
 * Extract error message from various error types
 */
export function getErrorMessage(error: unknown, fallback = 'An error occurred'): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }
  return fallback;
}

/**
 * Log error in development, handle silently in production
 */
export function handleError(error: unknown, context?: string): ErrorInfo {
  const message = getErrorMessage(error);
  const errorInfo: ErrorInfo = {
    message,
    details: error,
  };

  // Only log in development
  if (import.meta.env.DEV) {
    if (context) {
      console.error(`[${context}]`, error);
    } else {
      console.error('Error:', error);
    }
  }

  return errorInfo;
}
