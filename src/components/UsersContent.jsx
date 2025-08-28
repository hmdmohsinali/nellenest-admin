import React, { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon, 
  PencilIcon, 
  TrashIcon,
  EyeIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { adminAPI } from '../services/admin.service.js';
import LoadingSpinner from './LoadingSpinner.jsx';

const UsersContent = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [editFormData, setEditFormData] = useState({
    role: '',
    themes: [],
    meditationReminders: []
  });

  // Fetch users on component mount and when filters change
  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page: currentPage,
        limit: 10,
        ...(searchTerm && { search: searchTerm }),
      };

      const response = await adminAPI.users.getAll(params);
      console.log('API Response:', response); // Debug log
      
      // Handle the actual API response structure
      if (response && response.users && Array.isArray(response.users)) {
        // Show all users without filtering
        setUsers(response.users);
        setTotalPages(response.pagination?.totalPages || 1);
        setTotalUsers(response.pagination?.total || 0);
        
        console.log('Pagination Debug:', {
          totalUsers: response.pagination?.total,
          displayedUsers: response.users.length,
          totalPages: response.pagination?.totalPages,
          currentPage
        });
      } else {
        // Handle unexpected response structure
        console.error('Unexpected response structure:', response);
        setError('Invalid response format from server');
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete confirmation
  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  // Handle user deletion
  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      setLoading(true);
      const response = await adminAPI.users.delete(userToDelete._id);
      
      if (response && response.success !== false) {
        // Refresh the list after successful deletion
        await fetchUsers();
        setShowDeleteModal(false);
        setUserToDelete(null);
      } else {
        setError(response?.message || 'Failed to delete user');
      }
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Failed to delete user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Close delete modal
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  // Handle edit button click
  const handleEditClick = (user) => {
    setUserToEdit(user);
    setEditFormData({
      role: user.role || 'user',
      themes: user.themes || [],
      meditationReminders: user.meditationReminders || []
    });
    setShowEditModal(true);
  };

  // Handle user editing
  const handleEditUser = async () => {
    if (!userToEdit) return;
    
    try {
      setLoading(true);
      const response = await adminAPI.users.update(userToEdit._id, editFormData);
      
      if (response && response.success !== false) {
        // Refresh the list after successful update
        await fetchUsers();
        setShowEditModal(false);
        setUserToEdit(null);
        setEditFormData({ role: '', themes: [], meditationReminders: [] });
      } else {
        setError(response?.message || 'Failed to update user');
      }
    } catch (err) {
      console.error('Error updating user:', err);
      setError('Failed to update user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Close edit modal
  const closeEditModal = () => {
    setShowEditModal(false);
    setUserToEdit(null);
    setEditFormData({ role: '', themes: [], meditationReminders: [] });
  };

  // Handle form field changes
  const handleFormChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle theme changes
  const handleThemeChange = (theme, isChecked) => {
    setEditFormData(prev => ({
      ...prev,
      themes: isChecked 
        ? [...prev.themes, theme]
        : prev.themes.filter(t => t !== theme)
    }));
  };

  // Handle reminder changes
  const handleReminderChange = (index, field, value) => {
    setEditFormData(prev => ({
      ...prev,
      meditationReminders: prev.meditationReminders.map((reminder, i) => 
        i === index ? { ...reminder, [field]: value } : reminder
      )
    }));
  };

  // Add new reminder
  const addReminder = () => {
    setEditFormData(prev => ({
      ...prev,
      meditationReminders: [...prev.meditationReminders, { day: 'Monday', time: '09:00' }]
    }));
  };

  // Remove reminder
  const removeReminder = (index) => {
    setEditFormData(prev => ({
      ...prev,
      meditationReminders: prev.meditationReminders.filter((_, i) => i !== index)
    }));
  };



  // Handle search with debouncing
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  // Handle view user details
  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  // Close user modal
  const closeUserModal = () => {
    setShowUserModal(false);
    setSelectedUser(null);
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user => {
    if (!searchTerm) return true;
    return user.email.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getRoleColor = (role) => {
    switch (role.toLowerCase()) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'moderator': return 'bg-blue-100 text-blue-800';
      case 'user': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Show loading spinner
  if (loading && users.length === 0) {
    return (
      <div className="py-6 lg:py-8">
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">User Management</h1>
          <p className="text-sm sm:text-base text-slate-600">Manage your users, roles, and permissions</p>
        </div>
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 lg:py-8">
      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">User Management</h1>
        <p className="text-sm sm:text-base text-slate-600">Manage your users, roles, and permissions</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex">
            <div className="text-sm text-red-700">{error}</div>
                          <button 
                onClick={() => setError(null)}
                className="ml-auto text-red-400 hover:text-red-600 cursor-pointer"
              >
                ×
              </button>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3 sm:items-center">
          <div className="relative flex-1 sm:flex-initial sm:w-64">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search users by email..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">User</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Role</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Themes</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Reminders</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Joined</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-50 transition-colors duration-200">
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-slate-900 truncate">
                          {user.email?.split('@')[0] || 'User'}
                        </div>
                        <div className="text-xs text-slate-500 truncate">{user.email}</div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role || 'user')}`}>
                        {user.role || 'User'}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {user.themes && user.themes.length > 0 ? (
                          user.themes.map((theme, index) => (
                            <span key={index} className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                              {theme}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400">No themes</span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-xs text-slate-600">
                        {user.meditationReminders && user.meditationReminders.length > 0 ? (
                          <span className="inline-flex px-2 py-1 bg-green-100 text-green-800 rounded-full">
                            {user.meditationReminders.length} reminder{user.meditationReminders.length > 1 ? 's' : ''}
                          </span>
                        ) : (
                          <span className="text-slate-400">No reminders</span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs text-slate-600">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-1 sm:space-x-2">
                        <button 
                          className="text-blue-600 hover:text-blue-900 p-1.5 rounded hover:bg-blue-50 transition-colors duration-200 cursor-pointer" 
                          title="View Details"
                          onClick={() => handleViewUser(user)}
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button 
                          className="text-green-600 hover:text-green-900 p-1.5 rounded hover:bg-green-50 transition-colors duration-200 cursor-pointer" 
                          title="Edit User"
                          onClick={() => handleEditClick(user)}
                          disabled={loading}
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-900 p-1.5 rounded hover:bg-red-50 transition-colors duration-200 cursor-pointer" 
                          title="Delete"
                          onClick={() => handleDeleteClick(user)}
                          disabled={loading}
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>



      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          <div className="text-sm text-slate-700">
            Showing <span className="font-medium">{((currentPage - 1) * 10) + 1}</span> to{' '}
            <span className="font-medium">{Math.min(currentPage * 10, totalUsers)}</span> of{' '}
            <span className="font-medium">{totalUsers}</span> results
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm font-medium text-slate-500 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Previous
            </button>
            
            {/* Page numbers */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNumber = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
              return (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 cursor-pointer ${
                    pageNumber === currentPage
                      ? 'text-white bg-blue-600 border border-blue-600'
                      : 'text-slate-500 bg-white border border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}
            
            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm font-medium text-slate-500 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-800">User Details</h2>
              <button
                onClick={closeUserModal}
                className="text-slate-400 hover:text-slate-600 transition-colors duration-200 cursor-pointer"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-medium text-slate-800 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Email</label>
                    <p className="text-sm text-slate-900">{selectedUser.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Role</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(selectedUser.role)}`}>
                      {selectedUser.role || 'User'}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">User ID</label>
                    <p className="text-sm text-slate-900 font-mono">{selectedUser._id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Created At</label>
                    <p className="text-sm text-slate-900">{formatDate(selectedUser.createdAt)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Last Updated</label>
                    <p className="text-sm text-slate-900">{formatDate(selectedUser.updatedAt)}</p>
                  </div>
                </div>
              </div>

              {/* Themes */}
              <div>
                <h3 className="text-lg font-medium text-slate-800 mb-4">Meditation Themes</h3>
                {selectedUser.themes && selectedUser.themes.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedUser.themes.map((theme, index) => (
                      <span key={index} className="inline-flex px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                        {theme}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">No meditation themes selected</p>
                )}
              </div>

              {/* Meditation Reminders */}
              <div>
                <h3 className="text-lg font-medium text-slate-800 mb-4">Meditation Reminders</h3>
                {selectedUser.meditationReminders && selectedUser.meditationReminders.length > 0 ? (
                  <div className="space-y-2">
                    {selectedUser.meditationReminders.map((reminder, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm font-medium text-slate-900">{reminder.day}</span>
                        </div>
                        <span className="text-sm text-slate-600">{reminder.time}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">No meditation reminders set</p>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-slate-200">
              <button
                onClick={closeUserModal}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors duration-200 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && userToDelete && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 max-w-md w-full">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-800">Confirm Deletion</h2>
              <button
                onClick={closeDeleteModal}
                className="text-slate-400 hover:text-slate-600 transition-colors duration-200 cursor-pointer"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="mb-4">
                <p className="text-slate-700 mb-2">
                  Are you sure you want to delete this user?
                </p>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-600 font-semibold">
                        {userToDelete.email?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">
                        {userToDelete.email?.split('@')[0] || 'User'}
                      </p>
                      <p className="text-sm text-slate-600">{userToDelete.email}</p>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                This action cannot be undone. The user will be permanently removed from the system.
              </p>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-slate-200">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors duration-200 cursor-pointer"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-red-600 rounded-md hover:bg-red-700 transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Delete User'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && userToEdit && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-800">Edit User</h2>
              <button
                onClick={closeEditModal}
                className="text-slate-400 hover:text-slate-600 transition-colors duration-200 cursor-pointer"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* User Info */}
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">
                      {userToEdit.email?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">
                      {userToEdit.email?.split('@')[0] || 'User'}
                    </p>
                    <p className="text-sm text-slate-600">{userToEdit.email}</p>
                  </div>
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">User Role</label>
                <select
                  value={editFormData.role}
                  onChange={(e) => handleFormChange('role', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* Meditation Themes */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">Meditation Themes</label>
                <div className="grid grid-cols-2 gap-3">
                  {['love', 'peace', 'gratitude', 'forgiveness', 'compassion', 'mindfulness'].map((theme) => (
                    <label key={theme} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editFormData.themes.includes(theme)}
                        onChange={(e) => handleThemeChange(theme, e.target.checked)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-slate-700 capitalize">{theme}</span>
                    </label>
                  ))}
                </div>
            
                
                <div className="space-y-3">
                  {editFormData.meditationReminders.map((reminder, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                      <select
                        value={reminder.day}
                        onChange={(e) => handleReminderChange(index, 'day', e.target.value)}
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Monday">Monday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                        <option value="Friday">Friday</option>
                        <option value="Saturday">Saturday</option>
                        <option value="Sunday">Sunday</option>
                      </select>
                      
                      <input
                        type="time"
                        value={reminder.time}
                        onChange={(e) => handleReminderChange(index, 'time', e.target.value)}
                        className="px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      
                      <button
                        type="button"
                        onClick={() => removeReminder(index)}
                        className="text-red-600 hover:text-red-700 p-1"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  
                  {editFormData.meditationReminders.length === 0 && (
                    <p className="text-sm text-slate-500 text-center py-4">
                      No reminders set. Click "Add Reminder" to create one.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-slate-200">
              <button
                onClick={closeEditModal}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors duration-200 cursor-pointer"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleEditUser}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersContent;
