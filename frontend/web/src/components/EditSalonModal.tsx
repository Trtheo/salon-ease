import React, { useState, useEffect } from 'react';
import { X, Upload, Trash2, Plus } from 'lucide-react';
import { Salon } from '../types';
import { adminService, salonOwnerService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface EditSalonModalProps {
  salon: Salon | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onError: (message: string) => void;
}

const EditSalonModal: React.FC<EditSalonModalProps> = ({ salon, isOpen, onClose, onSuccess, onError }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    workingHours: {
      monday: { open: '09:00', close: '18:00', isOpen: true },
      tuesday: { open: '09:00', close: '18:00', isOpen: true },
      wednesday: { open: '09:00', close: '18:00', isOpen: true },
      thursday: { open: '09:00', close: '18:00', isOpen: true },
      friday: { open: '09:00', close: '18:00', isOpen: true },
      saturday: { open: '09:00', close: '16:00', isOpen: true },
      sunday: { open: '10:00', close: '16:00', isOpen: false }
    }
  });

  useEffect(() => {
    if (salon) {
      setFormData({
        name: salon.name || '',
        description: salon.description || '',
        address: salon.address || '',
        phone: salon.phone || '',
        email: salon.email || '',
        workingHours: salon.workingHours as any || {
          monday: { open: '09:00', close: '18:00', isOpen: true },
          tuesday: { open: '09:00', close: '18:00', isOpen: true },
          wednesday: { open: '09:00', close: '18:00', isOpen: true },
          thursday: { open: '09:00', close: '18:00', isOpen: true },
          friday: { open: '09:00', close: '18:00', isOpen: true },
          saturday: { open: '09:00', close: '16:00', isOpen: true },
          sunday: { open: '10:00', close: '16:00', isOpen: false }
        }
      });
      setExistingImages(salon.images || []);
    }
  }, [salon]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!salon) return;

    setLoading(true);
    try {
      console.log('Submitting salon update for:', salon._id);
      console.log('Images to upload:', images.length);
      
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('description', formData.description);
      submitData.append('address', formData.address);
      submitData.append('phone', formData.phone);
      submitData.append('email', formData.email);
      submitData.append('workingHours', JSON.stringify(formData.workingHours));
      
      // Only add new images
      images.forEach((image) => {
        submitData.append('images', image);
      });
      
      console.log('Making API call...');
      const response = user?.role === 'admin' 
        ? await adminService.updateSalon(salon._id, submitData)
        : await salonOwnerService.updateSalon(salon._id, submitData);
      
      console.log('API response:', response);
      
      if (response.success) {
        onSuccess();
        onClose();
      } else {
        onError(response.error || 'Failed to update salon');
      }
    } catch (error: any) {
      console.error('Update salon error:', error);
      onError(error.response?.data?.error || 'Failed to update salon');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !salon) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Edit Salon</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Salon Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address *
              </label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Salon Images
            </label>
            
            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Current Images:</p>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {existingImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={`http://127.0.0.1:3002${image}`}
                        alt={`Salon ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setExistingImages(existingImages.filter((_, i) => i !== index))}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* New Images */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <Upload className="h-6 w-6 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">Add new images (max 5 total)</p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  if (existingImages.length + images.length + files.length > 5) {
                    alert('Maximum 5 images allowed');
                    return;
                  }
                  setImages([...images, ...files]);
                }}
                className="hidden"
                id="new-images"
              />
              <label
                htmlFor="new-images"
                className="bg-primary-100 text-primary-700 px-3 py-2 rounded-lg hover:bg-primary-200 cursor-pointer inline-flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Images</span>
              </label>
            </div>
            
            {/* New Image Previews */}
            {images.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">New Images:</p>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`New ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setImages(images.filter((_, i) => i !== index))}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Working Hours
            </label>
            <div className="space-y-3">
              {Object.entries(formData.workingHours).map(([day, hours]) => (
                <div key={day} className="flex items-center space-x-4">
                  <div className="w-20">
                    <span className="text-sm font-medium capitalize">{day}</span>
                  </div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={hours.isOpen}
                      onChange={(e) => setFormData({
                        ...formData,
                        workingHours: {
                          ...formData.workingHours,
                          [day]: { ...hours, isOpen: e.target.checked }
                        }
                      })}
                      className="mr-2"
                    />
                    <span className="text-sm">Open</span>
                  </label>
                  {hours.isOpen && (
                    <>
                      <input
                        type="time"
                        value={hours.open}
                        onChange={(e) => setFormData({
                          ...formData,
                          workingHours: {
                            ...formData.workingHours,
                            [day]: { ...hours, open: e.target.value }
                          }
                        })}
                        className="px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                      <span className="text-sm">to</span>
                      <input
                        type="time"
                        value={hours.close}
                        onChange={(e) => setFormData({
                          ...formData,
                          workingHours: {
                            ...formData.workingHours,
                            [day]: { ...hours, close: e.target.value }
                          }
                        })}
                        className="px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Salon'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSalonModal;