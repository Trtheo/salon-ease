import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { salonOwnerService, adminService } from '../services/api';
import { TrendingUp, DollarSign, Users, Calendar, Star, ArrowUp, ArrowDown } from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

interface AnalyticsData {
  overview: any;
  bookingTrends: any[];
  servicePerformance: any[];
  revenueAnalytics: any;
  customerAnalytics: any;
  userGrowth?: any[];
  topSalons?: any[];
}

const AnalyticsPage: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSalon, setSelectedSalon] = useState<string>('all');
  const [salons, setSalons] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState('6months');

  useEffect(() => {
    fetchAnalytics();
  }, [user, selectedSalon]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      if (user?.role === 'admin') {
        const [systemRes, userRes, bookingRes, salonRes] = await Promise.all([
          adminService.getSystemAnalytics(),
          adminService.getUserAnalytics(),
          adminService.getBookingAnalytics(),
          adminService.getSalonAnalytics(),
        ]);

        if (systemRes.success) {
          setData({
            overview: systemRes.data.overview,
            bookingTrends: bookingRes.data?.bookingTrends || [],
            servicePerformance: [],
            revenueAnalytics: { totalRevenue: 0, avgBookingValue: 0, totalBookings: 0 },
            customerAnalytics: { totalCustomers: systemRes.data.overview.totalUsers, repeatCustomers: 0 },
            userGrowth: userRes.data?.userGrowth || [],
            topSalons: bookingRes.data?.topSalons || [],
          });
        }
      } else {
        // Salon owner analytics
        const [overviewRes, salonsRes] = await Promise.all([
          salonOwnerService.getOwnerOverview(),
          salonOwnerService.getMySalons(),
        ]);

        if (overviewRes.success && salonsRes.success) {
          setSalons(salonsRes.data || []);
          
          let analyticsData: AnalyticsData = {
            overview: {
              totalSalons: overviewRes.data.totalSalons,
              totalBookings: overviewRes.data.totalBookings,
              totalRevenue: overviewRes.data.totalRevenue,
            },
            bookingTrends: [],
            servicePerformance: [],
            revenueAnalytics: {
              totalRevenue: overviewRes.data.totalRevenue,
              avgBookingValue: overviewRes.data.totalRevenue / (overviewRes.data.totalBookings || 1),
              totalBookings: overviewRes.data.totalBookings,
            },
            customerAnalytics: { totalCustomers: 0, repeatCustomers: 0 },
          };

          // Get detailed analytics for selected salon
          if (selectedSalon !== 'all' && salonsRes.data && salonsRes.data.length > 0) {
            const salonId = selectedSalon || salonsRes.data[0]._id;
            const salonAnalytics = await salonOwnerService.getSalonAnalytics(salonId);
            if (salonAnalytics.success && salonAnalytics.data) {
              analyticsData = {
                ...analyticsData,
                bookingTrends: salonAnalytics.data.bookingTrends || [],
                servicePerformance: salonAnalytics.data.servicePerformance || [],
                customerAnalytics: salonAnalytics.data.customerAnalytics || { totalCustomers: 0, repeatCustomers: 0 },
              };
            }
          }

          setData(analyticsData);
        }
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generate sample data for better visualization
  const chartData = data?.bookingTrends?.length > 0 ? data.bookingTrends : [];
  const serviceData = data?.servicePerformance?.length > 0 ? data.servicePerformance : [];

  const pieData = data?.customerAnalytics ? [
    { name: 'New Customers', value: data.customerAnalytics.newCustomers || 0, color: '#7c4dff' },
    { name: 'Returning', value: data.customerAnalytics.returningCustomers || 0, color: '#9f75ff' },
  ] : [];

  const COLORS = ['#7c4dff', '#9f75ff', '#bea6ff', '#d9ceff'];

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow h-32"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow h-80"></div>
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
    trend?: 'up' | 'down';
  }> = ({ title, value, icon, color, change, trend }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <div className={`flex items-center mt-2 text-sm ${
              trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend === 'up' ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
              {change}
            </div>
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {user?.role === 'admin' ? 'System Analytics' : 'Business Analytics'}
          </h1>
          <p className="text-gray-600 mt-1">
            {user?.role === 'admin' 
              ? 'Platform performance and insights'
              : 'Track your salon performance and growth'
            }
          </p>
        </div>
        
        <div className="flex space-x-4">
          {user?.role === 'salon_owner' && salons.length > 0 && (
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
          )}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="1month">Last Month</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {user?.role === 'admin' ? (
          <>
            <StatCard
              title="Total Users"
              value={data?.overview?.totalUsers || 0}
              icon={<Users className="h-6 w-6 text-blue-600" />}
              color="bg-blue-100"
              change="+12.5%"
              trend="up"
            />
            <StatCard
              title="Total Salons"
              value={data?.overview?.totalSalons || 0}
              icon={<TrendingUp className="h-6 w-6 text-green-600" />}
              color="bg-green-100"
              change="+8.2%"
              trend="up"
            />
            <StatCard
              title="Total Bookings"
              value={data?.overview?.totalBookings || 0}
              icon={<Calendar className="h-6 w-6 text-purple-600" />}
              color="bg-purple-100"
              change="+15.3%"
              trend="up"
            />
            <StatCard
              title="Platform Growth"
              value={`${data?.overview?.monthlyBookings || 0}`}
              icon={<Star className="h-6 w-6 text-orange-600" />}
              color="bg-orange-100"
              change="+23.1%"
              trend="up"
            />
          </>
        ) : (
          <>
            <StatCard
              title="Total Revenue"
              value={`$${data?.revenueAnalytics?.totalRevenue || 0}`}
              icon={<DollarSign className="h-6 w-6 text-green-600" />}
              color="bg-green-100"
              change="+18.2%"
              trend="up"
            />
            <StatCard
              title="Total Bookings"
              value={data?.revenueAnalytics?.totalBookings || 0}
              icon={<Calendar className="h-6 w-6 text-blue-600" />}
              color="bg-blue-100"
              change="+12.5%"
              trend="up"
            />
            <StatCard
              title="Avg Booking Value"
              value={`$${Math.round(data?.revenueAnalytics?.avgBookingValue || 0)}`}
              icon={<TrendingUp className="h-6 w-6 text-purple-600" />}
              color="bg-purple-100"
              change="+5.8%"
              trend="up"
            />
            <StatCard
              title="Total Customers"
              value={data?.customerAnalytics?.totalCustomers || 0}
              icon={<Users className="h-6 w-6 text-orange-600" />}
              color="bg-orange-100"
              change="+9.3%"
              trend="up"
            />
          </>
        )}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Booking Trends */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Trends</h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="bookings" stroke="#7c4dff" fill="#7c4dff" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-300 flex items-center justify-center text-gray-500">
              No booking trend data available
            </div>
          )}
        </div>

        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Growth</h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#7c4dff" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-300 flex items-center justify-center text-gray-500">
              No revenue data available
            </div>
          )}
        </div>

        {/* Service Performance */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Performance</h3>
          {serviceData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={serviceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="bookings" fill="#7c4dff" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-300 flex items-center justify-center text-gray-500">
              No service performance data available
            </div>
          )}
        </div>

        {/* Customer Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Distribution</h3>
          {pieData.length > 0 && pieData.some(d => d.value > 0) ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-300 flex items-center justify-center text-gray-500">
              No customer data available
            </div>
          )}
        </div>
      </div>

      {/* Additional Analytics Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Services */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Top Services</h3>
          </div>
          <div className="p-6">
            {serviceData.length > 0 ? (
              <div className="space-y-4">
                {serviceData.slice(0, 4).map((service, index) => (
                  <div key={service.name} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-semibold text-sm">
                        {index + 1}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{service.name}</p>
                        <p className="text-xs text-gray-500">{service.bookings} bookings</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">${service.revenue}</p>
                      <p className="text-xs text-gray-500">revenue</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                No service data available
              </div>
            )}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Key Metrics</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Customer Retention Rate</span>
                <span className="text-sm font-medium text-gray-900">
                  {data?.customerAnalytics?.retentionRate ? `${data.customerAnalytics.retentionRate}%` : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Average Booking Value</span>
                <span className="text-sm font-medium text-gray-900">
                  ${Math.round(data?.revenueAnalytics?.avgBookingValue || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Customers</span>
                <span className="text-sm font-medium text-gray-900">
                  {data?.customerAnalytics?.totalCustomers || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Revenue</span>
                <span className="text-sm font-medium text-gray-900">
                  ${data?.revenueAnalytics?.totalRevenue || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Bookings</span>
                <span className="text-sm font-medium text-gray-900">
                  {data?.revenueAnalytics?.totalBookings || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Growth Rate</span>
                <span className="text-sm font-medium text-green-600">
                  {data?.overview?.growthRate ? `+${data.overview.growthRate}%` : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;