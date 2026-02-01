import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { salonOwnerService } from '../services/api';
import { Booking } from '../types';
import { Calendar, Clock, User, DollarSign, Filter, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const BookingsPage: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSalon, setSelectedSalon] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [salons, setSalons] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch salons first
      const salonsResponse = await salonOwnerService.getMySalons();
      if (salonsResponse.success) {
        const salonsData = salonsResponse.data || [];
        setSalons(salonsData);
        
        // Only fetch bookings if there are salons
        if (salonsData.length > 0) {
          const allBookings: Booking[] = [];
          for (const salon of salonsData) {
            try {
              const bookingsResponse = await salonOwnerService.getSalonBookings(salon._id);
              if (bookingsResponse.success) {
                allBookings.push(...(bookingsResponse.data || []));
              }
            } catch (error) {
              console.log(`Failed to fetch bookings for salon ${salon.name}`);
            }
          }
          setBookings(allBookings);
        } else {
          setBookings([]);
        }
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
      // Don't show error toast if user just has no salons
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId: string, status: string) => {
    try {
      const response = await salonOwnerService.updateBookingStatus(bookingId, status);
      if (response.success) {
        toast.success(`Booking ${status} successfully`);
        fetchData();
      }
    } catch (error) {
      toast.error('Failed to update booking status');
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSalon = selectedSalon === 'all' || booking.salon._id === selectedSalon;
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    const matchesSearch = searchTerm === '' || 
      booking.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.service.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSalon && matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow h-24"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Bookings Management</h1>
        <p className="text-gray-600 mt-1">Manage all your salon appointments</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers or services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Salon Filter */}
          <select
            value={selectedSalon}
            onChange={(e) => setSelectedSalon(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Salons</option>
            {salons.map(salon => (
              <option key={salon._id} value={salon._id}>{salon.name}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Date Filter */}
          <input
            type="date"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.map((booking) => (
          <div key={booking._id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4">
                {/* Customer Info */}
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{booking.customer.name}</p>
                    <p className="text-sm text-gray-500">{booking.customer.email}</p>
                  </div>
                </div>

                {/* Service Info */}
                <div>
                  <p className="font-medium text-gray-900">{booking.service.name}</p>
                  <p className="text-sm text-gray-500">{booking.salon.name}</p>
                </div>

                {/* Date & Time */}
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {format(new Date(booking.date), 'MMM dd, yyyy')}
                    </p>
                    <p className="text-sm text-gray-500 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {booking.time}
                    </p>
                  </div>
                </div>

                {/* Amount */}
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <span className="font-medium text-gray-900">${booking.totalAmount}</span>
                </div>

                {/* Status */}
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>
              </div>

              {/* Actions */}
              {booking.status === 'pending' && (
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => handleStatusUpdate(booking._id, 'confirmed')}
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-200 text-sm"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(booking._id, 'cancelled')}
                    className="bg-red-100 text-red-700 px-3 py-1 rounded-lg hover:bg-red-200 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              )}
              
              {booking.status === 'confirmed' && (
                <button
                  onClick={() => handleStatusUpdate(booking._id, 'completed')}
                  className="bg-green-100 text-green-700 px-3 py-1 rounded-lg hover:bg-green-200 text-sm ml-4"
                >
                  Complete
                </button>
              )}
            </div>

            {booking.notes && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Notes:</strong> {booking.notes}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredBookings.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
          <p className="text-gray-600">
            {searchTerm || statusFilter !== 'all' || selectedSalon !== 'all'
              ? 'Try adjusting your filters to see more results.'
              : 'No bookings have been made yet.'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default BookingsPage;