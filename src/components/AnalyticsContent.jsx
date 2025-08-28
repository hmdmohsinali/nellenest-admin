import React, { useEffect, useState } from 'react';
import { 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { adminAPI } from '../services/admin.service.js';
import LoadingSpinner from './LoadingSpinner.jsx';

const emptyCourse = {
  name: '',
  description: '',
  category: '',
  difficulty: 'beginner',
  voiceVersions: [],
  tags: []
};

const emptyVoiceVersion = {
  gender: 'female',
  audioUrl: '',
  duration: 0,
  description: ''
};

const AnalyticsContent = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCourses, setTotalCourses] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState(emptyCourse);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, [currentPage, searchTerm]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: currentPage,
        limit: 10,
        ...(searchTerm && { search: searchTerm })
      };

      const response = await adminAPI.courses.getAll(params);
      if (response && Array.isArray(response.courses)) {
        setCourses(response.courses);
        setTotalPages(response.pagination?.totalPages || 1);
        setTotalCourses(response.pagination?.total || response.courses.length || 0);
      } else if (Array.isArray(response)) {
        setCourses(response);
        setTotalPages(1);
        setTotalCourses(response.length);
      } else {
        setError('Invalid response format from server');
      }
    } catch (e) {
      console.error('Error fetching courses:', e);
      setError('Failed to load courses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const openCreateModal = () => {
    setEditingCourse(null);
    setFormData(emptyCourse);
    setShowEditModal(true);
  };

  const openEditModal = (course) => {
    setEditingCourse(course);
    setFormData({
      name: course.name || '',
      description: course.description || '',
      category: course.category || '',
      difficulty: course.difficulty || 'beginner',
      voiceVersions: Array.isArray(course.voiceVersions) ? course.voiceVersions : [],
      tags: Array.isArray(course.tags) ? course.tags : []
    });
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingCourse(null);
    setFormData(emptyCourse);
  };

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTagsChange = (value) => {
    const tags = value.split(',').map(t => t.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, tags }));
  };

  const addVoiceVersion = () => {
    setFormData(prev => ({ ...prev, voiceVersions: [...prev.voiceVersions, { ...emptyVoiceVersion }] }));
  };

  const updateVoiceVersion = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      voiceVersions: prev.voiceVersions.map((v, i) => (i === index ? { ...v, [field]: value } : v))
    }));
  };

  const removeVoiceVersion = (index) => {
    setFormData(prev => ({
      ...prev,
      voiceVersions: prev.voiceVersions.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) return 'Name is required';
    if (!formData.description.trim()) return 'Description is required';
    if (!formData.category.trim()) return 'Category is required';
    if (!['beginner', 'intermediate', 'advanced'].includes(formData.difficulty)) return 'Invalid difficulty';
    for (const v of formData.voiceVersions) {
      if (!v.gender || !['male', 'female'].includes(v.gender)) return 'Voice version gender must be male or female';
      if (!v.audioUrl) return 'Voice version audioUrl is required';
      if (Number.isNaN(Number(v.duration)) || Number(v.duration) <= 0) return 'Voice version duration must be > 0';
    }
    return null;
  };

  const handleSubmitCourse = async () => {
    const validationError = validateForm();
    if (validationError) { setError(validationError); return; }
    try {
      setLoading(true);
      setError(null);
      if (editingCourse && (editingCourse._id || editingCourse.id)) {
        const id = editingCourse._id || editingCourse.id;
        await adminAPI.courses.update(id, formData);
      } else {
        await adminAPI.courses.create(formData);
      }
      closeEditModal();
      await fetchCourses();
    } catch (e) {
      console.error('Course save failed:', e);
      setError(e.message || 'Failed to save course');
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (course) => { setCourseToDelete(course); setShowDeleteModal(true); };
  const closeDeleteModal = () => { setCourseToDelete(null); setShowDeleteModal(false); };

  const handleDeleteCourse = async () => {
    if (!courseToDelete) return;
    try {
      setLoading(true);
      setError(null);
      const id = courseToDelete._id || courseToDelete.id;
      await adminAPI.courses.delete(id);
      closeDeleteModal();
      await fetchCourses();
    } catch (e) {
      console.error('Delete failed:', e);
      setError(e.message || 'Failed to delete course');
    } finally {
      setLoading(false);
    }
  };

  if (loading && courses.length === 0) {
    return (
      <div className="py-6 lg:py-8">
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">Courses </h1>
          <p className="text-sm sm:text-base text-slate-600">Manage your courses, content, and settings</p>
        </div>
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 lg:py-8">
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">Courses</h1>
        <p className="text-sm sm:text-base text-slate-600">Create, update, and manage meditation courses</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex">
            <div className="text-sm text-red-700">{error}</div>
            <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600 cursor-pointer">×</button>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
        <div className="relative w-full sm:w-72">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input type="text" placeholder="Search courses..." value={searchTerm} onChange={handleSearchChange} className="w-full pl-10 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        </div>
        <button onClick={openCreateModal} className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200 cursor-pointer">
          <PlusIcon className="w-4 h-4" />
          <span>New Course</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Difficulty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Versions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Tags</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {courses.length === 0 ? (
                <tr><td colSpan="6" className="px-6 py-8 text-center text-slate-500">No courses found</td></tr>
              ) : (
                courses.map((course) => (
                  <tr key={course._id || course.id} className="hover:bg-slate-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-slate-900 truncate">{course.name}</div>
                        <div className="text-xs text-slate-500 truncate">{course.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{course.category || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-800 capitalize">{course.difficulty || 'beginner'}</span></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{Array.isArray(course.voiceVersions) ? course.voiceVersions.length : 0}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {Array.isArray(course.tags) && course.tags.length > 0 ? (
                          course.tags.map((tag, i) => (<span key={i} className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">{tag}</span>))
                        ) : (<span className="text-xs text-slate-400">No tags</span>)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-green-600 hover:text-green-900 p-1.5 rounded hover:bg-green-50 transition-colors duration-200 cursor-pointer" title="Edit" onClick={() => openEditModal(course)}>
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900 p-1.5 rounded hover:bg-red-50 transition-colors duration-200 cursor-pointer" title="Delete" onClick={() => openDeleteModal(course)}>
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

      {totalPages > 1 && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          <div className="text-sm text-slate-700">Showing <span className="font-medium">{((currentPage - 1) * 10) + 1}</span> to <span className="font-medium">{Math.min(currentPage * 10, totalCourses)}</span> of <span className="font-medium">{totalCourses}</span> results</div>
          <div className="flex space-x-2">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-2 text-sm font-medium text-slate-500 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">Previous</button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNumber = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
          return (
                <button key={pageNumber} onClick={() => handlePageChange(pageNumber)} className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 cursor-pointer ${pageNumber === currentPage ? 'text-white bg-blue-600 border border-blue-600' : 'text-slate-500 bg-white border border-slate-300 hover:bg-slate-50'}`}>{pageNumber}</button>
              );
            })}
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-2 text-sm font-medium text-slate-500 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">Next</button>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-800">{editingCourse ? 'Edit Course' : 'New Course'}</h2>
              <button onClick={closeEditModal} className="text-slate-400 hover:text-slate-600 transition-colors duration-200 cursor-pointer"><XMarkIcon className="w-6 h-6" /></button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                  <input type="text" value={formData.name} onChange={(e) => handleFieldChange('name', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                  <input type="text" value={formData.category} onChange={(e) => handleFieldChange('category', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Difficulty</label>
                  <select value={formData.difficulty} onChange={(e) => handleFieldChange('difficulty', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent capitalize">
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                  <textarea rows={3} value={formData.description} onChange={(e) => handleFieldChange('description', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tags (comma separated)</label>
                  <input type="text" value={formData.tags.join(', ')} onChange={(e) => handleTagsChange(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="relaxation, beginner, mindful" />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-slate-800">Voice Versions</h3>
                  <button type="button" onClick={addVoiceVersion} className="text-sm text-blue-600 hover:text-blue-700 font-medium">+ Add Voice Version</button>
                </div>
                <div className="space-y-3">
                  {formData.voiceVersions.length === 0 && (<div className="text-sm text-slate-500">No voice versions added.</div>)}
                  {formData.voiceVersions.map((v, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-lg">
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Gender</label>
                        <select value={v.gender} onChange={(e) => updateVoiceVersion(index, 'gender', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option value="female">Female</option>
                          <option value="male">Male</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Audio URL</label>
                        <input type="url" value={v.audioUrl} onChange={(e) => updateVoiceVersion(index, 'audioUrl', e.target.value)} placeholder="https://..." className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Duration (sec)</label>
                        <input type="number" min="1" value={v.duration} onChange={(e) => updateVoiceVersion(index, 'duration', Number(e.target.value))} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                      </div>
                      <div className="md:col-span-1 flex items-end justify-between">
                        <div className="w-full">
                          <label className="block text-xs font-medium text-slate-600 mb-1">Description</label>
                          <input type="text" value={v.description} onChange={(e) => updateVoiceVersion(index, 'description', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
                        <button type="button" onClick={() => removeVoiceVersion(index)} className="text-red-600 hover:text-red-700 p-2 ml-2" title="Remove"><TrashIcon className="w-4 h-4" /></button>
          </div>
        </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-slate-200">
              <button onClick={closeEditModal} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors duration-200 cursor-pointer" disabled={loading}>Cancel</button>
              <button onClick={handleSubmitCourse} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" disabled={loading}>{loading ? (editingCourse ? 'Updating...' : 'Creating...') : (editingCourse ? 'Update Course' : 'Create Course')}</button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && courseToDelete && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-800">Confirm Deletion</h2>
              <button onClick={closeDeleteModal} className="text-slate-400 hover:text-slate-600 transition-colors duration-200 cursor-pointer"><XMarkIcon className="w-6 h-6" /></button>
      </div>
            <div className="p-6">
              <p className="text-slate-700 mb-2">Are you sure you want to delete this course?</p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="font-medium text-slate-900">{courseToDelete.name}</div>
                <div className="text-sm text-slate-600 truncate">{courseToDelete.description}</div>
              </div>
              <p className="text-sm text-slate-600 mt-4">This action cannot be undone.</p>
              </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-slate-200">
              <button onClick={closeDeleteModal} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors duration-200 cursor-pointer" disabled={loading}>Cancel</button>
              <button onClick={handleDeleteCourse} className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-red-600 rounded-md hover:bg-red-700 transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" disabled={loading}>{loading ? 'Deleting...' : 'Delete Course'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsContent;
