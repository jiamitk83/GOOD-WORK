import React, { createContext, useState, useEffect, ReactNode } from 'react';

// Define types for our context
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions?: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  error: string | null;
  setError: (error: string | null) => void;
  checkPermission: (permission: string) => boolean;
}

// Create the auth context with default values
export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => false,
  logout: () => {},
  register: async () => false,
  error: null,
  setError: () => {},
  checkPermission: () => false,
});

interface AuthProviderProps {
  children: ReactNode;
}

// Sample users data (in a real app, this would come from a backend)
const USERS = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    permissions: ['manage_users', 'manage_roles', 'view_dashboard', 'manage_students', 'manage_teachers']
  },
  {
    id: '2',
    name: 'Teacher User',
    email: 'teacher@example.com',
    password: 'teacher123',
    role: 'teacher',
    permissions: ['view_dashboard', 'view_students', 'manage_grades']
  },
  {
    id: '3',
    name: 'Student User',
    email: 'student@example.com',
    password: 'student123',
    role: 'student',
    permissions: ['view_dashboard', 'view_grades', 'view_courses']
  }
];

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (e) {
        console.error('Failed to parse stored user data', e);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Find user with matching credentials
      const foundUser = USERS.find(u => u.email === email && u.password === password);

      if (foundUser) {
        const { password: _password, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        setIsLoading(false);
        return true;
      } else {
        setError('Invalid email or password');
        setIsLoading(false);
        return false;
      }
    } catch (e) {
      setError('An error occurred during login');
      setIsLoading(false);
      return false;
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Register function
  const register = async (name: string, email: string, _password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if user already exists
      const userExists = USERS.some(u => u.email === email);

      if (userExists) {
        setError('User with this email already exists');
        setIsLoading(false);
        return false;
      }

      // In a real app, we would send this to a backend API
      // For demo, we'll just create a new user with student role
      const newUser = {
        id: `${USERS.length + 1}`,
        name,
        email,
        role: 'student',
        permissions: ['view_dashboard', 'view_grades', 'view_courses']
      };

      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      // In a real app, we would add the user to the database here
      // USERS.push({ ...newUser, password });

      setIsLoading(false);
      return true;
    } catch (e) {
      setError('An error occurred during registration');
      setIsLoading(false);
      return false;
    }
  };

  // Check if user has a specific permission
  const checkPermission = (permission: string): boolean => {
    if (!user || !user.permissions) {
      return false;
    }
    return user.permissions.includes(permission);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        register,
        error,
        setError,
        checkPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
