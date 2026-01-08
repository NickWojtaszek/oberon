// API Client - Centralized HTTP communication layer
// Supports both backend API and localStorage fallback

export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
}

export class ApiClient {
  private baseURL: string;
  private authToken: string | null = null;
  private useBackend: boolean;

  constructor(baseURL?: string, useBackend = false) {
    this.baseURL = baseURL || 'http://localhost:3001/api';
    this.useBackend = useBackend;
    
    // Restore auth token from localStorage on init
    const savedToken = localStorage.getItem('auth_token');
    if (savedToken) {
      this.authToken = savedToken;
    }
  }

  setAuthToken(token: string | null) {
    this.authToken = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  getAuthToken(): string | null {
    return this.authToken;
  }

  isBackendEnabled(): boolean {
    return this.useBackend;
  }

  setBackendEnabled(enabled: boolean) {
    this.useBackend = enabled;
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      let errorData: any = null;

      try {
        const errorJson = await response.json();
        errorMessage = errorJson.message || errorMessage;
        errorData = errorJson;
      } catch {
        // If response isn't JSON, use default error message
      }

      // Handle specific status codes
      if (response.status === 401) {
        // Unauthorized - clear auth token and redirect to login
        this.setAuthToken(null);
        window.dispatchEvent(new CustomEvent('auth:unauthorized'));
      }

      throw new ApiError(response.status, errorMessage, errorData);
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return null as T;
    }

    return response.json();
  }

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(`${this.baseURL}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, body?: any): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });

    return this.handleResponse<T>(response);
  }

  async put<T>(endpoint: string, body?: any): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });

    return this.handleResponse<T>(response);
  }

  async patch<T>(endpoint: string, body?: any): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });

    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    return this.handleResponse<T>(response);
  }

  // Upload file (multipart/form-data)
  async uploadFile<T>(endpoint: string, file: File, additionalData?: Record<string, string>): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    const headers: Record<string, string> = {};
    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
    });

    return this.handleResponse<T>(response);
  }

  // Download file (blob response)
  async downloadFile(endpoint: string): Promise<Blob> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new ApiError(response.status, `Failed to download file: ${response.statusText}`);
    }

    return response.blob();
  }
}

// Singleton instance using Vite env vars
export const apiClient = new ApiClient(
  import.meta.env.VITE_API_URL as string | undefined,
  import.meta.env.VITE_USE_BACKEND === 'true'
);

// Helper to check if backend is available
export async function checkBackendHealth(): Promise<boolean> {
  try {
    await apiClient.get('/health');
    return true;
  } catch {
    return false;
  }
}