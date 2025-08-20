import { FormData, AdminUpdateData } from '@/app/types/form';

// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ''

// Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface SubmitResponse {
  message: string;
  id: string;
}

export interface ConsultingDataResponse {
  data: FormData[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    has_more: boolean;
  };
}

// API service class
class ConsultingApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Submit consulting form data to the API
   */
  async submitConsultingData(formData: FormData): Promise<ApiResponse<SubmitResponse>> {
    try {
      const response = await fetch(`${this.baseUrl}/submit-consulting-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.error || `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      return {
        success: true,
        data: result,
        message: result.message,
      };
    } catch (error) {
      console.error('API submission error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred',
      };
    }
  }

  /**
   * Retrieve all consulting data with optional filtering
   */
  async getAllConsultingData(
    options: {
      limit?: number;
      offset?: number;
      userType?: 'tenant' | 'landlord';
    } = {}
  ): Promise<ApiResponse<ConsultingDataResponse>> {
    try {
      const params = new URLSearchParams();
      
      if (options.limit) params.append('limit', options.limit.toString());
      if (options.offset) params.append('offset', options.offset.toString());
      if (options.userType) params.append('userType', options.userType);

      const url = `${this.baseUrl}/get-all-consulting-data${params.toString() ? '?' + params.toString() : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.error || `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error('API retrieval error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred',
      };
    }
  }

  /**
   * Update admin status and comments for a submission
   */
  async updateAdminStatus(adminData: AdminUpdateData): Promise<ApiResponse<{message: string; submission_id: string}>> {
    try {
      const response = await fetch(`${this.baseUrl}/update-admin-status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(adminData),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.error || `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      return {
        success: true,
        data: result,
        message: result.message,
      };
    } catch (error) {
      console.error('API admin update error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred',
      };
    }
  }

  /**
   * Test API connectivity
   */
  async testConnection(): Promise<ApiResponse<string>> {
    try {
      const response = await fetch(`${this.baseUrl}/`, {
        method: 'GET',
        headers: {
          'Accept': 'text/plain',
        },
      });

      if (!response.ok) {
        return {
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      const text = await response.text();
      return {
        success: true,
        data: text,
        message: 'API connection successful',
      };
    } catch (error) {
      console.error('API connection test error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred',
      };
    }
  }
}

// Export singleton instance
export const consultingApi = new ConsultingApiService();

// Export utilities for form validation
export const validateApiResponse = <T>(response: ApiResponse<T>): response is ApiResponse<T> & { success: true; data: T } => {
  return response.success && response.data !== undefined;
};

// Error handling utilities
export const getErrorMessage = (response: ApiResponse): string => {
  return response.error || 'An unexpected error occurred';
};

// Default export
export default consultingApi;