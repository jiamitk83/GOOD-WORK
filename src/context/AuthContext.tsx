import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  username: string;
  userType: 'admin' | 'teacher' | 'student';
  email: string;
  approved: boolean;
}

interface PendingUser {
  id: number;
  username: string;
  email: string;
  password: string;
  userType: 'teacher' | 'student';
  requestDate: string;
  approved: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (username: string, email: string, password: string, userType: 'teacher' | 'student') => Promise<boolean>;
  approvePendingUser: (userId: number) => void;
  rejectPendingUser: (userId: number) => void;
  getPendingUsers: () => PendingUser[];
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

  // Predefined admin credentials - ये change नहीं हो सकते
  const adminCredentials = {
    username: 'admin',
    password: 'admin123',
    email: 'admin@school.com'
  };

  // Get approved users from localStorage
  const getApprovedUsers = (): User[] => {
    const saved = localStorage.getItem('approved-users');
    return saved ? JSON.parse(saved) : [];
  };

  // Get pending registrations from localStorage
  const getPendingUsers = (): PendingUser[] => {
    const saved = localStorage.getItem('pending-registrations');
    return saved ? JSON.parse(saved) : [];
  };

  // Save approved users to localStorage
  const saveApprovedUsers = (users: User[]) => {
    localStorage.setItem('approved-users', JSON.stringify(users));
  };

  // Save pending registrations to localStorage
  const savePendingUsers = (users: PendingUser[]) => {
    localStorage.setItem('pending-registrations', JSON.stringify(users));
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    // Check admin login
    if (username === adminCredentials.username && password === adminCredentials.password) {
      const adminUser: User = {
        username: adminCredentials.username,
        email: adminCredentials.email,
        userType: 'admin',
        approved: true
      };
      setUser(adminUser);
      localStorage.setItem('user', JSON.stringify(adminUser));
      return true;
    }

    // Check approved users
    const approvedUsers = getApprovedUsers();
    const foundUser = approvedUsers.find(u => u.username === username);
    
    if (foundUser && foundUser.approved) {
      // In real app, you'd verify password hash here
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
      return true;
    }

    return false;
  };

  const register = async (username: string, email: string, password: string, userType: 'teacher' | 'student'): Promise<boolean> => {
    const pendingUsers = getPendingUsers();
    const approvedUsers = getApprovedUsers();
    
    // Check if username already exists
    if (pendingUsers.some(u => u.username === username) || 
        approvedUsers.some(u => u.username === username) ||
        username === adminCredentials.username) {
      return false; // Username already exists
    }

    const newPendingUser: PendingUser = {
      id: Date.now(),
      username,
      email,
      password, // In real app, hash this password
      userType,
      requestDate: new Date().toISOString(),
      approved: false
    };

    savePendingUsers([...pendingUsers, newPendingUser]);
    return true;
  };

  const approvePendingUser = (userId: number) => {
    const pendingUsers = getPendingUsers();
    const approvedUsers = getApprovedUsers();
    
    const userToApprove = pendingUsers.find(u => u.id === userId);
    if (userToApprove) {
      const newApprovedUser: User = {
        username: userToApprove.username,
        email: userToApprove.email,
        userType: userToApprove.userType,
        approved: true
      };
      
      saveApprovedUsers([...approvedUsers, newApprovedUser]);
      savePendingUsers(pendingUsers.filter(u => u.id !== userId));
    }
  };

  const rejectPendingUser = (userId: number) => {
    const pendingUsers = getPendingUsers();
    savePendingUsers(pendingUsers.filter(u => u.id !== userId));
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
    register,
    approvePendingUser,
    rejectPendingUser,
    getPendingUsers,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
