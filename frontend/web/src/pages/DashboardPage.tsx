import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { salonOwnerService, adminService } from '../services/api';
import { Calendar, DollarSign, Store, Users, TrendingUp, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface DashboardStats {
  totalSalons?: number;
  totalBookings: number;
  totalRevenue: number;
  pendingBookings?: number;
  completedBookings?: number;
  totalUsers?: number;
  recentBookings?: any[];
}

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      let response;
      
      console.log('Fetching dashboard data for user role:', user?.role);
      console.log('Token in localStorage:', localStorage.getItem('token') ? 'Present' : 'Missing');
      
      if (user?.role === 'admin') {
        console.log('Calling adminService.getSystemAnalytics()');
        response = await adminService.getSystemAnalytics();
        console.log('Admin analytics response:', response);
        
        if (response.success) {
          const statsData = {
            totalUsers: response.data.overview?.totalUsers || 0,
            totalSalons: response.data.overview?.totalSalons || 0,
            totalBookings: response.data.overview?.totalBookings || 0,
            pendingBookings: response.data.overview?.pendingBookings || 0,
            completedBookings: response.data.overview?.completedBookings || 0,
            totalRevenue: response.data.overview?.totalRevenue || 0,
          };
          console.log('Setting stats:', statsData);
          setStats(statsData);
        }
      } else {
        response = await salonOwnerService.getOwnerOverview();
        if (response.success) {
          setStats({
            totalSalons: response.data.totalSalons,
            totalBookings: response.data.totalBookings,
            totalRevenue: response.data.totalRevenue,
            recentBookings: response.data.recentBookings,
          });
        }
      }

      // Get real chart data from backend if available
      let chartData: any[] = [];
      if (response && response.success && response.data.chartData) {
        chartData = response.data.chartData;
      }
      setChartData(chartData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow h-32"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
    change?: string;
  }> = ({ title, value, icon, color, change }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <p className="text-sm text-green-600 mt-1">
              <TrendingUp className="inline h-4 w-4 mr-1" />
              {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600 mt-1">
          Here's what's happening with your {user?.role === 'admin' ? 'platform' : 'business'} today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {user?.role === 'admin' ? (
          <>
            <StatCard
              title="Total Users"
              value={stats?.totalUsers || 0}
              icon={<Users className="h-6 w-6 text-blue-600" />}
              color="bg-blue-100"
              change="+12% from last month"
            />
            <StatCard
              title="Total Salons"
              value={stats?.totalSalons || 0}
              icon={<Store className="h-6 w-6 text-green-600" />}
              color="bg-green-100"
              change="+8% from last month"
            />
            <StatCard
              title="Total Bookings"
              value={stats?.totalBookings || 0}
              icon={<Calendar className="h-6 w-6 text-purple-600" />}
              color="bg-purple-100"
              change="+15% from last month"
            />
            <StatCard
              title="Pending Approvals"
              value={stats?.pendingBookings || 0}
              icon={<Clock className="h-6 w-6 text-orange-600" />}
              color="bg-orange-100"
            />
          </>
        ) : (
          <>
            <StatCard
              title="My Salons"
              value={stats?.totalSalons || 0}
              icon={<Store className="h-6 w-6 text-blue-600" />}
              color="bg-blue-100"
            />
            <StatCard
              title="Total Bookings"
              value={stats?.totalBookings || 0}
              icon={<Calendar className="h-6 w-6 text-green-600" />}
              color="bg-green-100"
              change="+23% from last month"
            />
            <StatCard
              title="Total Revenue"
              value={`$${stats?.totalRevenue || 0}`}
              icon={<DollarSign className="h-6 w-6 text-purple-600" />}
              color="bg-purple-100"
              change="+18% from last month"
            />
            <StatCard
              title="This Week"
              value={chartData.length > 0 ? chartData.reduce((sum, day) => sum + (day.bookings || 0), 0) : 0}
              icon={<TrendingUp className="h-6 w-6 text-orange-600" />}
              color="bg-orange-100"
              change={chartData.length > 0 ? "+5% from last week" : undefined}
            />
          </>
        )}
      </div>

        {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Bookings Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Bookings</h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="bookings" stroke="#7c4dff" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-300 flex items-center justify-center text-gray-500">
              No booking data available
            </div>
          )}
        </div>

        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Revenue</h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#7c4dff" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-300 flex items-center justify-center text-gray-500">
              No revenue data available
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      {stats?.recentBookings && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Bookings</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.recentBookings.slice(0, 5).map((booking: any) => (
                  <tr key={booking._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.customer?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.service?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(booking.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;