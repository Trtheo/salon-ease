import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { adminService } from '../services/api';
import { User } from '../types';
import { Users, Search, Edit, Trash2, UserCheck, Shield, Crown } from 'lucide-react';
import { format } from 'date-fns';
import Pagination from '../components/Pagination';
import MessageModal from '../components/MessageModal';

const UsersPage: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newRole, setNewRole] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [messageModal, setMessageModal] = useState({ isOpen: false, type: 'success' as 'success' | 'error', title: '', message: '' });
  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, userId: '', userName: '' });
  const itemsPerPage = 10;

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchUsers(currentPage);
    }
  }, [user, currentPage]);

  const fetchUsers = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await adminService.getAllUsers(page, itemsPerPage);
      if (response.success) {
        setUsers(response.data || []);
        setTotalPages(response.pages || 1);
        setTotalItems(response.total || 0);
      }
    } catch (error) {
      showMessage('error', 'Error', 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleUpdate = async () => {
    if (!editingUser || !newRole) return;
    
    try {
      const response = await adminService.updateUserRole((editingUser as any)._id || editingUser.id, newRole);
      if (response.success) {
        showMessage('success', 'Success', 'User role updated successfully');
        setShowEditModal(false);
        setEditingUser(null);
        fetchUsers(currentPage);
      }
    } catch (error: any) {
      showMessage('error', 'Error', error.response?.data?.error || 'Failed to update user role');
    }
  };

  const showMessage = (type: 'success' | 'error', title: string, message: string) => {
    setMessageModal({ isOpen: true, type, title, message });
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await adminService.deleteUser(userId);
      showMessage('success', 'Success', 'User deleted successfully');
      setConfirmDelete({ isOpen: false, userId: '', userName: '' });
      fetchUsers(currentPage);
    } catch (error: any) {
      showMessage('error', 'Error', error.response?.data?.error || 'Failed to delete user');
    }
  };

  const confirmDeleteUser = (userId: string, userName: string) => {
    setConfirmDelete({ isOpen: true, userId, userName });
  };

  const openEditModal = (userToEdit: User) => {
    console.log('Opening edit modal for user:', userToEdit);
    setEditingUser(userToEdit);
    setNewRole(userToEdit.role);
    setShowEditModal(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Crown className="h-4 w-4 text-purple-600" />;
      case 'salon_owner': return <Shield className="h-4 w-4 text-blue-600" />;
      default: return <UserCheck className="h-4 w-4 text-green-600" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'salon_owner': return 'bg-blue-100 text-blue-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <Shield className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-600">Only administrators can access user management.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white p-4 rounded-lg shadow h-20"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
        <p className="text-gray-600 mt-1">Manage all platform users and their roles</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-xl font-bold text-gray-900">{users.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <UserCheck className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Customers</p>
              <p className="text-xl font-bold text-gray-900">
                {users.filter(u => u.role === 'customer').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Salon Owners</p>
              <p className="text-xl font-bold text-gray-900">
                {users.filter(u => u.role === 'salon_owner').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Crown className="h-8 w-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Admins</p>
              <p className="text-xl font-bold text-gray-900">
                {users.filter(u => u.role === 'admin').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Roles</option>
            <option value="customer">Customers</option>
            <option value="salon_owner">Salon Owners</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((u) => (
                <tr key={(u as any)._id || u.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <UserCheck className="h-5 w-5 text-gray-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{u.name}</div>
                        <div className="text-sm text-gray-500">{u.email}</div>
                        {u.phone && (
                          <div className="text-xs text-gray-400">{u.phone}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getRoleIcon(u.role)}
                      <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(u.role)}`}>
                        {u.role.replace('_', ' ')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      u.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {u.isVerified ? 'Verified' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(u.createdAt), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openEditModal(u)}
                        className="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                      >
                        <Edit className="h-4 w-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => confirmDeleteUser((u as any)._id || u.id, u.name)}
                        className="text-red-600 hover:text-red-900 flex items-center space-x-1"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-600">
            {searchTerm || roleFilter !== 'all'
              ? 'Try adjusting your filters to see more results.'
              : 'No users have registered yet.'
            }
          </p>
        </div>
      )}

      {/* Edit Role Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Edit User Role</h2>
            
            <div className="mb-4">
              <div className="flex items-center mb-3">
                <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <UserCheck className="h-5 w-5 text-gray-600" />
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900">{editingUser.name}</p>
                  <p className="text-sm text-gray-500">{editingUser.email}</p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select New Role
              </label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="customer">Customer</option>
                <option value="salon_owner">Salon Owner</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingUser(null);
                }}
                className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleRoleUpdate}
                className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
              >
                Update Role
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <MessageModal
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ isOpen: false, userId: '', userName: '' })}
        type="error"
        title="Delete User"
        message={`Are you sure you want to delete ${confirmDelete.userName}? This action cannot be undone.`}
      />
      
      {confirmDelete.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-red-900 mb-4">Delete User</h2>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete <strong>{confirmDelete.userName}</strong>? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setConfirmDelete({ isOpen: false, userId: '', userName: '' })}
                className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteUser(confirmDelete.userId)}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

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

export default UsersPage;