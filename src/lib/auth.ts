// Authentication Utilities - Login, logout, token management

import { apiClient } from './apiClient';
import { config } from '../config/environment';
import type {
  User,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from '../types/api/user.api';

class AuthService {
  private currentUser: User | null = null;

  /**
   * Initialize auth - restore user from localStorage
   */
  init(): User | null {
    const savedUser = localStorage.getItem(config.auth.userKey);
    const savedToken = localStorage.getItem(config.auth.tokenKey);

    if (savedUser && savedToken) {
      try {
        this.currentUser = JSON.parse(savedUser);
        apiClient.setAuthToken(savedToken);
        return this.currentUser;
      } catch (error) {
        console.error('Failed to restore user session:', error);
        this.logout();
      }
    }

    return null;
  }

  /**
   * Login with email and password
   */
  async login(email: string, password: string): Promise<User> {
    if (config.api.useBackend) {
      try {
        const request: LoginRequest = { email, password };
        const response = await apiClient.post<LoginResponse>('/auth/login', request);

        // Save user and token
        this.currentUser = response.user;
        apiClient.setAuthToken(response.token);
        localStorage.setItem(config.auth.userKey, JSON.stringify(response.user));
        localStorage.setItem(config.auth.tokenKey, response.token);

        // Save refresh token
        if (response.refreshToken) {
          localStorage.setItem('refresh_token', response.refreshToken);
        }

        return response.user;
      } catch (error) {
        console.error('Login failed:', error);
        throw error;
      }
    }

    // Mock login for development (no backend)
    const mockUser: User = {
      id: 'user-mock-' + Date.now(),
      email,
      name: email.split('@')[0],
      role: 'PI', // Default to PI for development
      institution: 'Development Institution',
      createdAt: Date.now(),
      lastLoginAt: Date.now(),
    };

    this.currentUser = mockUser;
    localStorage.setItem(config.auth.userKey, JSON.stringify(mockUser));
    localStorage.setItem(config.auth.tokenKey, 'mock-token-' + Date.now());

    return mockUser;
  }

  /**
   * Register a new user
   */
  async register(data: RegisterRequest): Promise<User> {
    if (config.api.useBackend) {
      try {
        const response = await apiClient.post<RegisterResponse>('/auth/register', data);
        return response.user;
      } catch (error) {
        console.error('Registration failed:', error);
        throw error;
      }
    }

    // Mock registration for development
    const mockUser: User = {
      id: 'user-mock-' + Date.now(),
      email: data.email,
      name: data.name,
      role: data.role,
      institution: data.institution,
      createdAt: Date.now(),
      lastLoginAt: Date.now(),
    };

    return mockUser;
  }

  /**
   * Logout current user
   */
  logout(): void {
    this.currentUser = null;
    apiClient.setAuthToken(null);
    localStorage.removeItem(config.auth.userKey);
    localStorage.removeItem(config.auth.tokenKey);
    localStorage.removeItem('refresh_token');

    // Dispatch event for components to react
    window.dispatchEvent(new CustomEvent('auth:logout'));
  }

  /**
   * Get current authenticated user
   */
  getCurrentUser(): User | null {
    if (!this.currentUser) {
      this.init();
    }
    return this.currentUser;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  /**
   * Refresh auth token
   */
  async refreshToken(): Promise<string> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    if (config.api.useBackend) {
      try {
        const request: RefreshTokenRequest = { refreshToken };
        const response = await apiClient.post<RefreshTokenResponse>('/auth/refresh', request);

        // Update token
        apiClient.setAuthToken(response.token);
        localStorage.setItem(config.auth.tokenKey, response.token);

        return response.token;
      } catch (error) {
        console.error('Token refresh failed:', error);
        this.logout();
        throw error;
      }
    }

    // Mock refresh for development
    const mockToken = 'mock-token-refreshed-' + Date.now();
    localStorage.setItem(config.auth.tokenKey, mockToken);
    return mockToken;
  }

  /**
   * Update current user data
   */
  updateCurrentUser(user: User): void {
    this.currentUser = user;
    localStorage.setItem(config.auth.userKey, JSON.stringify(user));
  }

  /**
   * Change password
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    if (config.api.useBackend) {
      await apiClient.post('/auth/change-password', {
        currentPassword,
        newPassword,
      });
    } else {
      // Mock implementation
      console.log('Password changed (mock)');
    }
  }

  /**
   * Request password reset
   */
  async forgotPassword(email: string): Promise<void> {
    if (config.api.useBackend) {
      await apiClient.post('/auth/forgot-password', { email });
    } else {
      console.log('Password reset email sent (mock)');
    }
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    if (config.api.useBackend) {
      await apiClient.post('/auth/reset-password', { token, newPassword });
    } else {
      console.log('Password reset (mock)');
    }
  }
}

// Export singleton instance
export const authService = new AuthService();

// Initialize on module load
authService.init();

// Listen for unauthorized events from API client
window.addEventListener('auth:unauthorized', () => {
  authService.logout();
  window.location.href = '/login'; // Redirect to login
});
