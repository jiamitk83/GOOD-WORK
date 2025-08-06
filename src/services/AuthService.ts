import { apiClient, handleApiError } from './api';

export interface LoginCredentials {
  login: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: {
    _id: string;
    name: string;
    description: string;
    permissions: Array<{
      _id: string;
      name: string;
      description: string;
    }>;
  };
  lastLogin?: Date;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

class AuthService {
  private user: User | null = null;
  private token: string | null = null;

  constructor() {
    // Load user and token from localStorage on initialization
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    try {
      const savedUser = localStorage.getItem('user');
      const savedToken = localStorage.getItem('authToken');
      
      if (savedUser && savedToken) {
        this.user = JSON.parse(savedUser);
        this.token = savedToken;
      }
    } catch (error) {
      console.error('Error loading auth data from storage:', error);
      this.clearStorage();
    }
  }

  private saveToStorage(user: User, token: string): void {
    try {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('authToken', token);
      this.user = user;
      this.token = token;
    } catch (error) {
      console.error('Error saving auth data to storage:', error);
    }
  }

  private clearStorage(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    this.user = null;
    this.token = null;
  }

  async login(credentials: LoginCredentials): Promise<{ success: boolean; message: string; user?: User }> {
    try {
      const response = await apiClient.auth.login(credentials);
      const authData: AuthResponse = response.data;

      if (authData.success) {
        this.saveToStorage(authData.data.user, authData.data.token);
        return {
          success: true,
          message: authData.message,
          user: authData.data.user
        };
      } else {
        return {
          success: false,
          message: authData.message || 'Login failed'
        };
      }
    } catch (error: any) {
      const apiError = handleApiError(error);
      return {
        success: false,
        message: apiError.message
      };
    }
  }

  async register(userData: RegisterData): Promise<{ success: boolean; message: string; user?: User }> {
    try {
      const response = await apiClient.auth.register(userData);
      const authData: AuthResponse = response.data;

      if (authData.success) {
        this.saveToStorage(authData.data.user, authData.data.token);
        return {
          success: true,
          message: authData.message,
          user: authData.data.user
        };
      } else {
        return {
          success: false,
          message: authData.message || 'Registration failed'
        };
      }
    } catch (error: any) {
      const apiError = handleApiError(error);
      return {
        success: false,
        message: apiError.message
      };
    }
  }

  async logout(): Promise<void> {
    try {
      // Call logout endpoint to invalidate token on server
      await apiClient.auth.logout();
    } catch (error) {
      console.error('Error during logout:', error);
      // Continue with logout even if server call fails
    } finally {
      this.clearStorage();
    }
  }

  async getCurrentUser(): Promise<User | null> {
    if (!this.token) {
      return null;
    }

    try {
      const response = await apiClient.auth.me();
      const userData = response.data;

      if (userData.success && userData.data.user) {
        this.user = userData.data.user;
        this.saveToStorage(this.user!, this.token!);
        return this.user;
      } else {
        this.clearStorage();
        return null;
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
      this.clearStorage();
      return null;
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.auth.changePassword({
        currentPassword,
        newPassword
      });

      const result = response.data;
      return {
        success: result.success,
        message: result.message || 'Password changed successfully'
      };
    } catch (error: any) {
      const apiError = handleApiError(error);
      return {
        success: false,
        message: apiError.message
      };
    }
  }

  getUser(): User | null {
    return this.user;
  }

  getToken(): string | null {
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!(this.user && this.token);
  }

  hasRole(roleName: string): boolean {
    return this.user?.role.name === roleName;
  }

  hasPermission(permissionName: string): boolean {
    if (!this.user || !this.user.role.permissions) {
      return false;
    }

    // Admin role has all permissions
    if (this.user.role.name === 'admin') {
      return true;
    }

    return this.user.role.permissions.some(
      permission => permission.name === permissionName
    );
  }

  isAdmin(): boolean {
    return this.hasRole('admin');
  }

  isTeacher(): boolean {
    return this.hasRole('teacher');
  }

  isStudent(): boolean {
    return this.hasRole('student');
  }

  isParent(): boolean {
    return this.hasRole('parent');
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
