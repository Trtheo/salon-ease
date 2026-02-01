import axios from 'axios';
import { ApiResponse, User, Salon, Booking, Service, DashboardStats, AnalyticsData, LoginResponse } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:3002/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't auto-redirect on 401 - let components handle it
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    try {
      console.log('Attempting login to:', `${API_BASE_URL}/auth/login`);
      const response = await api.post('/auth/login', { email, password });
      console.log('Login response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Login error:', error);
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);
      
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Backend server is not running on ' + API_BASE_URL);
      }
      
      throw error;
    }
  },

  getProfile: async (): Promise<ApiResponse<{ user: User }>> => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout: async (): Promise<ApiResponse> => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  forgotPassword: async (email: string): Promise<ApiResponse> => {
    const response = await api.post('/auth/forgot-password', { email, method: 'email' });
    return response.data;
  },

  verifyPasswordResetOTP: async (email: string, code: string): Promise<ApiResponse> => {
    const response = await api.post('/auth/verify-password-reset-otp', { email, code, method: 'email' });
    return response.data;
  },

  resetPassword: async (email: string, code: string, newPassword: string): Promise<ApiResponse> => {
    const response = await api.post('/auth/reset-password', { email, code, newPassword, method: 'email' });
    return response.data;
  },
};

export const salonOwnerService = {
  getMySalons: async (page: number = 1, limit: number = 10): Promise<ApiResponse<Salon[]>> => {
    const response = await api.get(`/salon-owner/salons?page=${page}&limit=${limit}`);
    return response.data;
  },

  getMySalonById: async (salonId: string): Promise<ApiResponse<Salon>> => {
    const response = await api.get(`/salon-owner/salons/${salonId}`);
    return response.data;
  },

  getSalonBookings: async (salonId: string): Promise<ApiResponse<Booking[]>> => {
    const response = await api.get(`/salon-owner/salons/${salonId}/bookings`);
    return response.data;
  },

  getSalonStats: async (salonId: string): Promise<ApiResponse<DashboardStats>> => {
    const response = await api.get(`/salon-owner/salons/${salonId}/stats`);
    return response.data;
  },

  getSalonAnalytics: async (salonId: string): Promise<ApiResponse<AnalyticsData>> => {
    const response = await api.get(`/salon-owner/salons/${salonId}/analytics`);
    return response.data;
  },

  getOwnerOverview: async (): Promise<ApiResponse<any>> => {
    const response = await api.get('/salon-owner/overview');
    return response.data;
  },

  updateBookingStatus: async (bookingId: string, status: string): Promise<ApiResponse<Booking>> => {
    const response = await api.put(`/salon-owner/bookings/${bookingId}/status`, { status });
    return response.data;
  },

  updateSalon: async (salonId: string, salonData: any): Promise<ApiResponse<Salon>> => {
    console.log('API: Updating salon', salonId, 'with data:', salonData);
    const response = await api.put(`/salon-owner/salons/${salonId}`, salonData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    console.log('API: Update response:', response.data);
    return response.data;
  },

  createSalon: async (salonData: FormData): Promise<ApiResponse<Salon>> => {
    const response = await api.post('/salon-owner/salons', salonData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
};

export const serviceService = {
  getServices: async (): Promise<ApiResponse<Service[]>> => {
    const response = await api.get('/services');
    return response.data;
  },

  createService: async (serviceData: Partial<Service>): Promise<ApiResponse<Service>> => {
    const response = await api.post('/services', serviceData);
    return response.data;
  },

  updateService: async (id: string, serviceData: Partial<Service>): Promise<ApiResponse<Service>> => {
    const response = await api.put(`/services/${id}`, serviceData);
    return response.data;
  },

  deleteService: async (id: string): Promise<ApiResponse> => {
    const response = await api.delete(`/services/${id}`);
    return response.data;
  },
};

export const adminService = {
  getAllUsers: async (page: number = 1, limit: number = 10): Promise<ApiResponse<User[]>> => {
    const response = await api.get(`/admin/users?page=${page}&limit=${limit}`);
    return response.data;
  },

  getAllSalons: async (page: number = 1, limit: number = 10): Promise<ApiResponse<Salon[]>> => {
    const response = await api.get(`/admin/salons?page=${page}&limit=${limit}`);
    return response.data;
  },

  updateSalonStatus: async (salonId: string, status: string): Promise<ApiResponse<Salon>> => {
    const response = await api.put(`/admin/salons/${salonId}/status`, { status });
    return response.data;
  },

  updateSalon: async (salonId: string, salonData: any): Promise<ApiResponse<Salon>> => {
    const response = await api.put(`/admin/salons/${salonId}`, salonData);
    return response.data;
  },

  deleteSalon: async (salonId: string): Promise<ApiResponse> => {
    const response = await api.delete(`/admin/salons/${salonId}`);
    return response.data;
  },

  updateUserRole: async (userId: string, role: string): Promise<ApiResponse<User>> => {
    const response = await api.put(`/admin/users/${userId}/role`, { role });
    return response.data;
  },

  deleteUser: async (userId: string): Promise<ApiResponse> => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },

  getSystemAnalytics: async (): Promise<ApiResponse<any>> => {
    const response = await api.get('/analytics/system');
    return response.data;
  },

  getUserAnalytics: async (): Promise<ApiResponse<any>> => {
    const response = await api.get('/analytics/users');
    return response.data;
  },

  getBookingAnalytics: async (): Promise<ApiResponse<any>> => {
    const response = await api.get('/analytics/bookings');
    return response.data;
  },

  getSalonAnalytics: async (): Promise<ApiResponse<any>> => {
    const response = await api.get('/analytics/salons');
    return response.data;
  },
};

export const userService = {
  updateProfile: async (profileData: any): Promise<ApiResponse<User>> => {
    const response = await api.put('/auth/profile', profileData);
    return response.data;
  },

  changePassword: async (passwordData: any): Promise<ApiResponse> => {
    const response = await api.put('/auth/change-password', passwordData);
    return response.data;
  },

  getNotificationSettings: async (): Promise<ApiResponse<any>> => {
    const response = await api.get('/auth/notification-settings');
    return response.data;
  },

  updateNotificationSettings: async (settings: any): Promise<ApiResponse<any>> => {
    const response = await api.put('/auth/notification-settings', settings);
    return response.data;
  },

  uploadAvatar: async (file: FormData): Promise<ApiResponse<any>> => {
    const response = await api.post('/auth/upload-avatar', file, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};

export default api;