import React, { createContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  approved: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => boolean;
  logout: () => void;
  pendingUsers: User[];
  approveUser: (userId: string) => void;
  rejectUser: (userId: string) => void;
  registerUser: (user: User) => void;
  hasEditPermission: () => boolean;
}

const defaultAuthContext: AuthContextType = {
  user: null,
  isAuthenticated: false,
  login: (_user) => false,
  logout: () => {},
  pendingUsers: [],
  approveUser: (_userId) => {},
  rejectUser: (_userId) => {},
  registerUser: (_user) => {},
  hasEditPermission: () => false
};

export const AuthContext = createContext<AuthContextType>(defaultAuthContext);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);

  // Check for saved user and pending users on initial load
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      if (parsedUser.approved) {
        setUser(parsedUser);
        setIsAuthenticated(true);
      }
    }

    const savedPendingUsers = localStorage.getItem('pendingUsers');
    if (savedPendingUsers) {
      setPendingUsers(JSON.parse(savedPendingUsers));
    }
  }, []);

  const login = (userData: User) => {
    // Only allow login if user is approved
    if (userData.approved) {
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  const registerUser = (userData: User) => {
    // Set approved to false for new registrations
    const newUser = { ...userData, approved: false };
    
    // Add to pending users
    const updatedPendingUsers = [...pendingUsers, newUser];
    setPendingUsers(updatedPendingUsers);
    
    // Save to localStorage
    localStorage.setItem('pendingUsers', JSON.stringify(updatedPendingUsers));
  };

  const approveUser = (userId: string) => {
    const updatedPendingUsers = pendingUsers.filter(user => user.id !== userId);
    const approvedUser = pendingUsers.find(user => user.id === userId);
    
    if (approvedUser) {
      // Update user to approved status
      approvedUser.approved = true;
      
      // Update localStorage
      setPendingUsers(updatedPendingUsers);
      localStorage.setItem('pendingUsers', JSON.stringify(updatedPendingUsers));
      
      // Also store in approved users (for demo purposes)
      const approvedUsers = JSON.parse(localStorage.getItem('approvedUsers') || '[]');
      approvedUsers.push(approvedUser);
      localStorage.setItem('approvedUsers', JSON.stringify(approvedUsers));
    }
  };

  const rejectUser = (userId: string) => {
    const updatedPendingUsers = pendingUsers.filter(user => user.id !== userId);
    setPendingUsers(updatedPendingUsers);
    localStorage.setItem('pendingUsers', JSON.stringify(updatedPendingUsers));
  };

  // Function to check if current user has edit permissions
  const hasEditPermission = () => {
    // Only admin users have edit permissions
    return user?.role === 'admin';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        pendingUsers,
        approveUser,
        rejectUser,
        registerUser,
        hasEditPermission
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
