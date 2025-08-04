import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  username: string;
  userType: 'admin' | 'teacher' | 'student';
}

interface AuthContextType {
  user: User | null;
  login: (userType: string, username: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (userType: string, username: string) => {
    setUser({
      username,
      userType: userType as 'admin' | 'teacher' | 'student'
    });
    // Store in localStorage for persistence
    localStorage.setItem('user', JSON.stringify({
      username,
      userType
    }));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Check for existing session on load
  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
    }
  }, []);

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
