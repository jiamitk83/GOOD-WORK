import axios from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API Methods
export const apiClient = {
  // Authentication
  auth: {
    login: (credentials: { login: string; password: string }) =>
      api.post('/auth/login', credentials),
    register: (userData: any) =>
      api.post('/auth/register', userData),
    logout: () =>
      api.post('/auth/logout'),
    me: () =>
      api.get('/auth/me'),
    changePassword: (passwords: { currentPassword: string; newPassword: string }) =>
      api.put('/auth/change-password', passwords),
  },

  // Students
  students: {
    getAll: (params?: any) =>
      api.get('/students', { params }),
    getById: (id: string) =>
      api.get(`/students/${id}`),
    create: (studentData: any) =>
      api.post('/students', studentData),
    update: (id: string, studentData: any) =>
      api.put(`/students/${id}`, studentData),
    delete: (id: string) =>
      api.delete(`/students/${id}`),
  },

  // Teachers
  teachers: {
    getAll: (params?: any) =>
      api.get('/teachers', { params }),
    getById: (id: string) =>
      api.get(`/teachers/${id}`),
    create: (teacherData: any) =>
      api.post('/teachers', teacherData),
    update: (id: string, teacherData: any) =>
      api.put(`/teachers/${id}`, teacherData),
    delete: (id: string) =>
      api.delete(`/teachers/${id}`),
  },

  // Classes
  classes: {
    getAll: (params?: any) =>
      api.get('/classes', { params }),
    getById: (id: string) =>
      api.get(`/classes/${id}`),
    create: (classData: any) =>
      api.post('/classes', classData),
    update: (id: string, classData: any) =>
      api.put(`/classes/${id}`, classData),
    delete: (id: string) =>
      api.delete(`/classes/${id}`),
  },

  // Sections
  sections: {
    getAll: (params?: any) =>
      api.get('/sections', { params }),
    getById: (id: string) =>
      api.get(`/sections/${id}`),
    create: (sectionData: any) =>
      api.post('/sections', sectionData),
    update: (id: string, sectionData: any) =>
      api.put(`/sections/${id}`, sectionData),
    delete: (id: string) =>
      api.delete(`/sections/${id}`),
  },

  // Subjects
  subjects: {
    getAll: (params?: any) =>
      api.get('/subjects', { params }),
    getById: (id: string) =>
      api.get(`/subjects/${id}`),
    create: (subjectData: any) =>
      api.post('/subjects', subjectData),
    update: (id: string, subjectData: any) =>
      api.put(`/subjects/${id}`, subjectData),
    delete: (id: string) =>
      api.delete(`/subjects/${id}`),
  },

  // Academic Years
  academicYears: {
    getAll: (params?: any) =>
      api.get('/academic-years', { params }),
    getById: (id: string) =>
      api.get(`/academic-years/${id}`),
    create: (yearData: any) =>
      api.post('/academic-years', yearData),
    update: (id: string, yearData: any) =>
      api.put(`/academic-years/${id}`, yearData),
    delete: (id: string) =>
      api.delete(`/academic-years/${id}`),
    setActive: (id: string) =>
      api.put(`/academic-years/${id}/activate`),
  },

  // Timetable
  timetable: {
    getAll: (params?: any) =>
      api.get('/timetable', { params }),
    getById: (id: string) =>
      api.get(`/timetable/${id}`),
    create: (timetableData: any) =>
      api.post('/timetable', timetableData),
    update: (id: string, timetableData: any) =>
      api.put(`/timetable/${id}`, timetableData),
    delete: (id: string) =>
      api.delete(`/timetable/${id}`),
  },

  // Roles and Permissions
  roles: {
    getAll: (params?: any) =>
      api.get('/roles', { params }),
    getById: (id: string) =>
      api.get(`/roles/${id}`),
    create: (roleData: any) =>
      api.post('/roles', roleData),
    update: (id: string, roleData: any) =>
      api.put(`/roles/${id}`, roleData),
    delete: (id: string) =>
      api.delete(`/roles/${id}`),
    getPermissions: () =>
      api.get('/roles/permissions'),
  },

  // School Profile
  schoolProfile: {
    get: () =>
      api.get('/school-profile'),
    update: (profileData: any) =>
      api.put('/school-profile', profileData),
  },

  // Admin - User Approval Management
  admin: {
    getPendingUsers: () =>
      api.get('/admin/pending-users'),
    getUsers: (params?: any) =>
      api.get('/admin/users', { params }),
    approveUser: (userId: string, data?: { notes?: string }) =>
      api.put(`/admin/approve-user/${userId}`, data),
    rejectUser: (userId: string, data: { reason: string }) =>
      api.put(`/admin/reject-user/${userId}`, data),
    bulkApprove: (data: { userIds: string[]; notes?: string }) =>
      api.put('/admin/bulk-approve', data),
    getApprovalStats: () =>
      api.get('/admin/approval-stats'),
  },

  // Health Check
  health: () =>
    api.get('/health'),
};

// Export individual API functions for backward compatibility
export default api;

// Helper functions
export const setAuthToken = (token: string | null) => {
  if (token) {
    localStorage.setItem('authToken', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('authToken');
    delete api.defaults.headers.common['Authorization'];
  }
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  return !!token;
};

// Error handler helper
export const handleApiError = (error: any) => {
  if (error.response) {
    // Server responded with error status
    return {
      message: error.response.data?.message || 'Server error occurred',
      status: error.response.status,
      data: error.response.data,
    };
  } else if (error.request) {
    // Request was made but no response
    return {
      message: 'Network error - please check your connection',
      status: 0,
      data: null,
    };
  } else {
    // Something else happened
    return {
      message: error.message || 'An unexpected error occurred',
      status: 0,
      data: null,
    };
  }
};
