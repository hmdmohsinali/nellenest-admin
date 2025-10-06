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
import FileUpload from './FileUpload.jsx';

const emptyCourse = {
  name: '',
  description: '',
  theme: '',
  difficulty: 'beginner',
  voiceVersions: [],
  tags: [],
  isActive: true,
  thumbnail: ''
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
  const [theme, setTheme] = useState('');
  const [difficulty, setDifficulty] = useState('');

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState(emptyCourse);
  const [formErrors, setFormErrors] = useState({});
  const [modalError, setModalError] = useState(null);
  const [uploadErrors, setUploadErrors] = useState({});

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);

  const formatDate = (iso) => {
    if (!iso) return '-';
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return '-';
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [currentPage, searchTerm, theme, difficulty]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: currentPage,
        limit: 10,
        ...(searchTerm && { search: searchTerm })
      };
      if (theme) params.theme = theme;
      if (difficulty) params.difficulty = difficulty;

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
        setError('Something went wrong while loading courses. Please refresh and try again.');
      }
    } catch (e) {
      console.error('Error fetching courses:', e);
      setError('We couldn’t load your courses right now. Please check your connection and try again.');
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
    setFormErrors({});
    setModalError(null);
    setShowEditModal(true);
  };

  const openEditModal = (course) => {
    setEditingCourse(course);
    setFormData({
      name: course.name || '',
      description: course.description || '',
      theme: course.theme || '',
      difficulty: course.difficulty || 'beginner',
      voiceVersions: Array.isArray(course.voiceVersions) ? course.voiceVersions : [],
      tags: Array.isArray(course.tags) ? course.tags : [],
      isActive: typeof course.isActive === 'boolean' ? course.isActive : true,
      thumbnail: course.thumbnail || ''
    });
    setFormErrors({});
    setModalError(null);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingCourse(null);
    setFormData(emptyCourse);
    setFormErrors({});
    setUploadErrors({});
    setModalError(null);
  };

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setFormErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleTagsChange = (value) => {
    const tags = value.split(',').map(t => t.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, tags }));
  };

  const addVoiceVersion = () => {
    setFormData(prev => ({ ...prev, voiceVersions: [...prev.voiceVersions, { ...emptyVoiceVersion }] }));
  };

  const updateVoiceVersion = (index, field, value, fileData = null) => {
    setFormData(prev => ({
      ...prev,
      voiceVersions: prev.voiceVersions.map((v, i) => (i === index ? { ...v, [field]: value, ...(fileData && { fileData }) } : v))
    }));
  };

  const removeVoiceVersion = (index) => {
    setFormData(prev => ({
      ...prev,
      voiceVersions: prev.voiceVersions.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Please enter a course name.';
    if (!formData.description.trim()) errors.description = 'Please add a brief description for this course.';
    if (!formData.theme.trim()) errors.theme = 'Please select a theme.';
    if (!['beginner', 'intermediate', 'advanced'].includes(formData.difficulty)) errors.difficulty = 'Please choose a valid difficulty level.';
    for (const v of formData.voiceVersions) {
      if (!v.gender || !['male', 'female'].includes(v.gender)) { errors.voiceVersions = 'Each voice track should use “Male” or “Female” gender.'; break; }
      if (!v.audioUrl) { errors.voiceVersions = 'Please upload a file for each voice track.'; break; }
      if (Number.isNaN(Number(v.duration)) || Number(v.duration) <= 0) { errors.voiceVersions = 'Please enter a duration greater than 0 seconds for each voice track.'; break; }
    }
    return errors;
  };

  const handleSubmitCourse = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setModalError('Some details are missing or look incorrect. Please review the highlighted fields.');
      return;
    }
    try {
      setLoading(true);
      setModalError(null);
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
      const message = e?.message || 'We couldn’t save your changes. Please try again.';
      setModalError(message);
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
      setError('We couldn’t delete this course right now. Please try again.');
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

      {!showEditModal && error && (
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
        <div className="w-full sm:w-40">
          <select value={theme} onChange={(e) => { setTheme(e.target.value); setCurrentPage(1); }} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="">All Themes</option>
            <option value="self-worth">Self Worth</option>
            <option value="love">Love</option>
            <option value="growth">Growth</option>
            <option value="health">Health</option>
            <option value="gratitude">Gratitude</option>
            <option value="calm">Calm</option>
            <option value="joy">Joy</option>
            <option value="purpose">Purpose</option>
          </select>
        </div>
        <div className="w-full sm:w-40">
          <select value={difficulty} onChange={(e) => { setDifficulty(e.target.value); setCurrentPage(1); }} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent capitalize">
            <option value="">All Difficulties</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Difficulty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Theme</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Versions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Active</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {courses.length === 0 ? (
                <tr><td colSpan="7" className="px-6 py-8 text-center text-slate-500">No courses found</td></tr>
              ) : (
                courses.map((course) => (
                  <tr key={course._id || course.id} className="hover:bg-slate-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-slate-900 truncate">{course.name}</div>
                        <div className="text-xs text-slate-500 truncate">{course.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-800 capitalize">{course.difficulty || 'beginner'}</span></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {course.theme ? (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-700 capitalize">{String(course.theme).replace('-', ' ')}</span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{Array.isArray(course.voiceVersions) ? course.voiceVersions.length : 0}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${course.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
                        {course.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-600">{formatDate(course.createdAt)}</td>
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

            {modalError && (
              <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded">
                <div className="flex">
                  <span className="text-sm text-red-700">{modalError}</span>
                  <button onClick={() => setModalError(null)} className="ml-auto text-red-400 hover:text-red-600">×</button>
                </div>
              </div>
            )}

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                  <input type="text" value={formData.name} onChange={(e) => handleFieldChange('name', e.target.value)} className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.name ? 'border-red-500' : 'border-slate-300'}`} />
                  {formErrors.name && <p className="mt-1 text-xs text-red-600">{formErrors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Theme</label>
                  <select value={formData.theme} onChange={(e) => handleFieldChange('theme', e.target.value)} className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.theme ? 'border-red-500' : 'border-slate-300'}`}>
                    <option value="">Select theme</option>
                    <option value="self-worth">Self Worth</option>
                    <option value="love">Love</option>
                    <option value="growth">Growth</option>
                    <option value="health">Health</option>
                    <option value="gratitude">Gratitude</option>
                    <option value="calm">Calm</option>
                    <option value="joy">Joy</option>
                    <option value="purpose">Purpose</option>
                  </select>
                  {formErrors.theme && <p className="mt-1 text-xs text-red-600">{formErrors.theme}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Difficulty</label>
                  <select value={formData.difficulty} onChange={(e) => handleFieldChange('difficulty', e.target.value)} className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent capitalize ${formErrors.difficulty ? 'border-red-500' : 'border-slate-300'}`}>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                  {formErrors.difficulty && <p className="mt-1 text-xs text-red-600">{formErrors.difficulty}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                  <textarea rows={3} value={formData.description} onChange={(e) => handleFieldChange('description', e.target.value)} className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.description ? 'border-red-500' : 'border-slate-300'}`} />
                  {formErrors.description && <p className="mt-1 text-xs text-red-600">{formErrors.description}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Thumbnail (optional)</label>
                  <FileUpload
                    type="image"
                    value={formData.thumbnail}
                    onChange={(url, fileData) => handleFieldChange('thumbnail', url)}
                    onError={(error) => setUploadErrors(prev => ({ ...prev, thumbnail: error }))}
                    placeholder="Upload course thumbnail"
                    folder="nellenest/courses/thumbnails"
                  />
                  {uploadErrors.thumbnail && <p className="mt-1 text-xs text-red-600">{uploadErrors.thumbnail}</p>}
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <input id="isActive" type="checkbox" checked={!!formData.isActive} onChange={(e) => handleFieldChange('isActive', e.target.checked)} className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  <label htmlFor="isActive" className="text-sm text-slate-700">Active</label>
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
                {formErrors.voiceVersions && <div className="mb-3 text-xs text-red-600">{formErrors.voiceVersions}</div>}
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
                        <label className="block text-xs font-medium text-slate-600 mb-1">File</label>
                        <FileUpload
                          type="audio"
                          value={v.audioUrl}
                          onChange={(url, fileData) => updateVoiceVersion(index, 'audioUrl', url, fileData)}
                          onError={(error) => setUploadErrors(prev => ({ ...prev, [`audio_${index}`]: error }))}
                          placeholder="Upload file"
                          folder="nellenest/courses/audio"
                          className="text-xs"
                        />
                        {uploadErrors[`audio_${index}`] && <p className="mt-1 text-xs text-red-600">{uploadErrors[`audio_${index}`]}</p>}
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
              <button onClick={handleSubmitCourse} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" disabled={loading}>{loading ? (editingCourse ? 'Updating…' : 'Creating…') : (editingCourse ? 'Update Course' : 'Create Course')}</button>
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
              <button onClick={handleDeleteCourse} className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-red-600 rounded-md hover:bg-red-700 transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" disabled={loading}>{loading ? 'Deleting…' : 'Delete Course'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsContent;
