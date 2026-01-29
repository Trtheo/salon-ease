import { Request } from 'express';

export interface IUser {
  userId?: string;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  role: 'customer' | 'salon_owner' | 'admin';
  avatar?: string;
  isVerified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuthRequest extends Request {
  user?: any;
  params: any;
  body: any;
}

export interface ISalon {
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  images: string[];
  workingHours: {
    [key: string]: { open: string; close: string; isOpen: boolean };
  };
  services: string[];
  owner: any;
  rating: number;
  isVerified: boolean;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IService {
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  salon: any;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IBooking {
  bookingId?: string;
  customer: any;
  salon: any;
  service: any;
  date: Date;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  totalAmount: number;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}