// src/utils/apiInterceptor.ts

interface ApiRequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = '/api/v1') {
    this.baseUrl = baseUrl;
  }

  private getAuthToken(): string | null {
    return localStorage.getItem('agri_token');
  }

  private getActiveFarmId(): string | null {
    const user = localStorage.getItem('agri_user');
    if (user) {
      try {
        const parsed = JSON.parse(user);
        return parsed.farmId ? String(parsed.farmId) : null;
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  async request<T>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
    const { params, headers = {}, ...restOptions } = options;

    let url = `${this.baseUrl}${endpoint}`;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) searchParams.append(key, String(value));
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += (url.includes('?') ? '&' : '?') + queryString;
      }
    }

    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    const token = this.getAuthToken();
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const farmId = this.getActiveFarmId();
    if (farmId) {
      defaultHeaders['x-farm-id'] = farmId;
    }

    try {
      const response = await fetch(url, {
        ...restOptions,
        headers: {
          ...defaultHeaders,
          ...(headers as Record<string, string>),
        },
      });

      // Handle 401 Unauthorized
      if (response.status === 401) {
        localStorage.removeItem('agri_token');
        throw new Error('Session expired. Please log in again.');
      }

      // Handle 403 Tier Limit Exceeded
      if (response.status === 403) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Subscription quota reached.');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Request failed with status ${response.status}`);
      }

      return (await response.json()) as T;
    } catch (error: any) {
      console.warn(`[API Client] Error on ${endpoint}:`, error.message);
      throw error;
    }
  }

  get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', params });
  }

  post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const api = new ApiClient();
