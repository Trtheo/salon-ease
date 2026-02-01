import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { salonOwnerService, adminService } from '../services/api';
import { Salon } from '../types';
import { Plus, Edit, Eye, MapPin, Phone, Mail, Star, Clock, Trash2 } from 'lucide-react';
import CreateSalonModal from '../components/CreateSalonModal';
import SalonDetailModal from '../components/SalonDetailModal';
import EditSalonModal from '../components/EditSalonModal';
import MessageModal from '../components/MessageModal';
import Pagination from '../components/Pagination';

const SalonsPage: React.FC = () => {
  const { user } = useAuth();
  const [salons, setSalons] = useState<Salon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedSalon, setSelectedSalon] = useState<Salon | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [messageModal, setMessageModal] = useState({ isOpen: false, type: 'success' as 'success' | 'error', title: '', message: '' });
  const itemsPerPage = 6;

  useEffect(() => {
    fetchSalons(currentPage);
  }, [user, currentPage]);

  const fetchSalons = async (page: number = 1) => {
    try {
      setLoading(true);
      console.log('Fetching salons for user role:', user?.role, 'page:', page);
      
      const response = user?.role === 'admin' 
        ? await adminService.getAllSalons(page, itemsPerPage)
        : await salonOwnerService.getMySalons(page, itemsPerPage);
      
      console.log('Salons API response:', response);
      
      if (response.success) {
        setSalons(response.data || []);
        setTotalPages(response.pages || 1);
        setTotalItems(response.total || 0);
        console.log('Salons loaded:', response.data?.length || 0, 'Total:', response.total);
        console.log('First salon data:', response.data?.[0]);
      } else {
        console.error('Salons API error:', response.error);
        showMessage('error', 'Error', 'Failed to fetch salons');
      }
    } catch (error: any) {
      console.error('Fetch salons error:', error);
      console.error('Error response:', error.response?.data);
      showMessage('error', 'Error', 'Failed to fetch salons');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (salonId: string, status: string) => {
    try {
      const response = await adminService.updateSalonStatus(salonId, status);
      if (response.success) {
        showMessage('success', 'Success', `Salon ${status} successfully`);
        fetchSalons(currentPage);
      }
    } catch (error) {
      showMessage('error', 'Error', 'Failed to update salon status');
    }
  };

  const showMessage = (type: 'success' | 'error', title: string, message: string) => {
    setMessageModal({ isOpen: true, type, title, message });
  };

  const handleDeleteSalon = async (salonId: string) => {
    if (window.confirm('Are you sure you want to delete this salon? This action cannot be undone.')) {
      try {
        const response = await adminService.deleteSalon(salonId);
        if (response.success) {
          showMessage('success', 'Success', 'Salon deleted successfully');
          fetchSalons(currentPage);
        }
      } catch (error) {
        showMessage('error', 'Error', 'Failed to delete salon');
      }
    }
  };

  const handleEditSalon = (salon: Salon) => {
    setSelectedSalon(salon);
    setShowEditModal(true);
  };

  const handleViewSalon = (salon: Salon) => {
    setSelectedSalon(salon);
    setShowDetailModal(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow h-64"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {user?.role === 'admin' ? 'All Salons' : 'My Salons'}
          </h1>
          <p className="text-gray-600 mt-1">
            {user?.role === 'admin' 
              ? 'Manage and approve salon registrations'
              : 'Manage your salon locations and settings'
            }
          </p>
        </div>
        {user?.role === 'salon_owner' && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add Salon</span>
          </button>
        )}
      </div>

      {/* Salons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {salons.map((salon) => (
          <div key={salon._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Salon Image */}
            <div className="h-48 bg-gray-200 relative">
              {salon.images && salon.images.length > 0 ? (
                <img
                  src={`http://127.0.0.1:3002${salon.images[0]}`}
                  alt={salon.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.log('Image failed to load:', salon.images[0]);
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-gray-400">No Image</div>
                </div>
              )}
              
              {/* Status Badge */}
              <div className="absolute top-4 right-4">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  salon.status === 'approved' ? 'bg-green-100 text-green-800' :
                  salon.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {salon.status}
                </span>
              </div>
            </div>

            {/* Salon Info */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">{salon.name}</h3>
                {salon.isVerified && (
                  <div className="flex items-center text-blue-600">
                    <Star className="h-4 w-4 fill-current" />
                  </div>
                )}
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{salon.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span className="truncate">{salon.address}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>{salon.phone}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Mail className="h-4 w-4 mr-2" />
                  <span className="truncate">{salon.email}</span>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(salon.rating) 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600 ml-2">
                  {salon.rating.toFixed(1)} ({salon.reviewCount} reviews)
                </span>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleViewSalon(salon)}
                  className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 flex items-center justify-center space-x-1"
                >
                  <Eye className="h-4 w-4" />
                  <span>View</span>
                </button>
                
                {user?.role === 'salon_owner' ? (
                  <button 
                    onClick={() => handleEditSalon(salon)}
                    className="flex-1 bg-primary-100 text-primary-700 px-3 py-2 rounded-lg hover:bg-primary-200 flex items-center justify-center space-x-1"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit</span>
                  </button>
                ) : (
                  <div className="flex-1 flex space-x-1">
                    <button
                      onClick={() => handleEditSalon(salon)}
                      className="flex-1 bg-blue-100 text-blue-700 px-2 py-2 rounded-lg hover:bg-blue-200 text-xs flex items-center justify-center space-x-1"
                    >
                      <Edit className="h-3 w-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteSalon(salon._id)}
                      className="flex-1 bg-red-100 text-red-700 px-2 py-2 rounded-lg hover:bg-red-200 text-xs flex items-center justify-center space-x-1"
                    >
                      <Trash2 className="h-3 w-3" />
                      <span>Delete</span>
                    </button>
                    {salon.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(salon._id, 'approved')}
                          className="flex-1 bg-green-100 text-green-700 px-2 py-2 rounded-lg hover:bg-green-200 text-xs"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(salon._id, 'rejected')}
                          className="flex-1 bg-red-100 text-red-700 px-2 py-2 rounded-lg hover:bg-red-200 text-xs"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {salons.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Clock className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No salons found</h3>
          <p className="text-gray-600">
            {user?.role === 'admin' 
              ? 'No salons have been registered yet.'
              : 'Get started by adding your first salon.'
            }
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
        />
      )}

      {/* Create Salon Modal */}
      <CreateSalonModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => fetchSalons(currentPage)}
      />

      {/* Salon Detail Modal */}
      <SalonDetailModal
        salon={selectedSalon}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
      />

      {/* Edit Salon Modal */}
      <EditSalonModal
        salon={selectedSalon}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSuccess={() => {
          showMessage('success', 'Success', 'Salon updated successfully');
          fetchSalons(currentPage);
        }}
        onError={(message) => showMessage('error', 'Error', message)}
      />

      {/* Message Modal */}
      <MessageModal
        isOpen={messageModal.isOpen}
        onClose={() => setMessageModal({ ...messageModal, isOpen: false })}
        type={messageModal.type}
        title={messageModal.title}
        message={messageModal.message}
      />
    </div>
  );
};

export default SalonsPage;