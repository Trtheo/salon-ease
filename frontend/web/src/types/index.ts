export interface User {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'salon_owner' | 'admin';
  isVerified: boolean;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Salon {
  _id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  images: string[];
  workingHours: {
    [key: string]: {
      open: string;
      close: string;
      isOpen: boolean;
    };
  };
  services: Service[];
  owner: User;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  salon: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  _id: string;
  bookingId: string;
  customer: User;
  salon: Salon;
  service: Service;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  totalAmount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  count?: number;
  total?: number;
  page?: number;
  pages?: number;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  data: {
    user: User;
  };
  error?: string;
}

export interface DashboardStats {
  totalBookings: number;
  pendingBookings: number;
  completedBookings: number;
  totalRevenue: number;
  salonStatus: string;
}

export interface AnalyticsData {
  bookingTrends: Array<{
    _id: { year: number; month: number };
    count: number;
    revenue: number;
  }>;
  servicePerformance: Array<{
    serviceName: string;
    bookingCount: number;
    revenue: number;
  }>;
  revenueAnalytics: {
    totalRevenue: number;
    avgBookingValue: number;
    totalBookings: number;
  };
  customerAnalytics: {
    totalCustomers: number;
    repeatCustomers: number;
  };
}