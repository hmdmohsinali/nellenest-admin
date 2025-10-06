import React, { useEffect, useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { adminAPI } from '../services';
import LoadingSpinner from './LoadingSpinner';
import FileUpload from './FileUpload';

const MusicsContent = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [query, setQuery] = useState('');
  const [mood, setMood] = useState('');
  const [artist, setArtist] = useState('');
  const [theme, setTheme] = useState('');

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    artist: '',
    description: '',
    mood: '',
    theme: '',
    releaseYear: new Date().getFullYear(),
    duration: 0,
    audioUrl: '',
    thumbnail: '',
    isActive: true,
  });
  const [formErrors, setFormErrors] = useState({});
  const [modalError, setModalError] = useState(null);

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, mood, artist, query]);

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = { page, limit };
      if (mood) params.mood = mood;
      if (artist) params.artist = artist;
      if (query) params.q = query;
      if (theme) params.theme = theme;

      const res = await adminAPI.music.getAll(params);
      const list = res.music || res.data?.music || [];
      const pagination = res.pagination || res.data?.pagination || { totalPages: 1, total: list.length };
      setItems(Array.isArray(list) ? list : []);
      setTotalPages(pagination.totalPages || 1);
      setTotalCount(pagination.total || list.length || 0);
    } catch (err) {
      setError(err.message || 'Failed to load music');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this music?')) return;
    try {
      await adminAPI.music.delete(id);
      fetchItems();
    } catch (err) {
      alert(err.message || 'Failed to delete');
    }
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({ 
      name: '', 
      artist: '', 
      description: '', 
      mood: '', 
      theme: '',
      releaseYear: new Date().getFullYear(), 
      duration: 0, 
      audioUrl: '', 
      thumbnail: '', 
      isActive: true 
    });
    setFormErrors({});
    setModalError(null);
    setShowEditModal(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name || '',
      artist: item.artist || '',
      description: item.description || '',
      mood: item.mood || '',
      theme: item.theme || '',
      releaseYear: Number(item.releaseYear) || new Date().getFullYear(),
      duration: Number(item.duration) || 0,
      audioUrl: item.audioUrl || '',
      thumbnail: item.thumbnail || '',
      isActive: typeof item.isActive === 'boolean' ? item.isActive : true,
    });
    setFormErrors({});
    setModalError(null);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingItem(null);
    setFormData({ 
      name: '', 
      artist: '', 
      description: '', 
      mood: '', 
      theme: '',
      releaseYear: new Date().getFullYear(), 
      duration: 0, 
      audioUrl: '', 
      thumbnail: '', 
      isActive: true 
    });
    setFormErrors({});
    setModalError(null);
  };

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setFormErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Please enter a name.';
    if (!formData.artist.trim()) errors.artist = 'Please enter an artist.';
    if (!formData.description.trim()) errors.description = 'Please enter a description.';
    if (!formData.mood.trim()) errors.mood = 'Please enter a mood.';
    if (!formData.theme.trim()) errors.theme = 'Please select a theme.';
    if (Number.isNaN(Number(formData.duration)) || Number(formData.duration) <= 0) errors.duration = 'Enter a duration in seconds (> 0).';
    if (Number.isNaN(Number(formData.releaseYear)) || Number(formData.releaseYear) < 1900 || Number(formData.releaseYear) > new Date().getFullYear() + 1) errors.releaseYear = 'Enter a valid release year.';
    if (!formData.audioUrl) errors.audioUrl = 'Please upload a file.';
    return errors;
  };

  const handleSubmit = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setModalError('Please fix the highlighted fields.');
      return;
    }

    try {
      setIsLoading(true);
      setModalError(null);
      if (editingItem && (editingItem._id || editingItem.id)) {
        const id = editingItem._id || editingItem.id;
        await adminAPI.music.update(id, formData);
      } else {
        await adminAPI.music.create(formData);
      }
      closeEditModal();
      await fetchItems();
    } catch (e) {
      setModalError(e?.message || 'Failed to save. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-6 lg:py-8">
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">Music</h1>
        <p className="text-sm sm:text-base text-slate-600">Create, update, and manage music tracks</p>
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
          <input type="text" placeholder="Search music..." value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} className="w-full pl-10 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        </div>
        <div className="w-full sm:w-32">
          <input type="text" placeholder="Mood" value={mood} onChange={(e) => { setMood(e.target.value); setPage(1); }} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        </div>
        <div className="w-full sm:w-32">
          <input type="text" placeholder="Artist" value={artist} onChange={(e) => { setArtist(e.target.value); setPage(1); }} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        </div>
        <div className="w-full sm:w-40">
          <select value={theme} onChange={(e) => { setTheme(e.target.value); setPage(1); }} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
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
        <button onClick={openCreateModal} className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200 cursor-pointer">
          <PlusIcon className="w-4 h-4" />
          <span>New Music</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Artist</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Mood</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Theme</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Year</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Active</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {items.length === 0 ? (
                  <tr><td colSpan="7" className="px-6 py-8 text-center text-slate-500">No music found</td></tr>
                ) : (
                  items.map((item) => (
                    <tr key={item._id || item.id} className="hover:bg-slate-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-slate-900 truncate">{item.name}</div>
                          <div className="text-xs text-slate-500 truncate">{item.description}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{item.artist || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{item.mood || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {item.theme ? (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-700 capitalize">{String(item.theme).replace('-', ' ')}</span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{item.releaseYear || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{item.duration ? `${Math.round(item.duration)}s` : '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${item.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
                          {item.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-green-600 hover:text-green-900 p-1.5 rounded hover:bg-green-50 transition-colors duration-200 cursor-pointer" title="Edit" onClick={() => openEditModal(item)}>
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900 p-1.5 rounded hover:bg-red-50 transition-colors duration-200 cursor-pointer" title="Delete" onClick={() => handleDelete(item._id || item.id)}>
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
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          <div className="text-sm text-slate-700">Showing <span className="font-medium">{((page - 1) * 10) + 1}</span> to <span className="font-medium">{Math.min(page * 10, totalCount)}</span> of <span className="font-medium">{totalCount}</span> results</div>
          <div className="flex space-x-2">
            <button onClick={() => setPage(page - 1)} disabled={page === 1} className="px-3 py-2 text-sm font-medium text-slate-500 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">Previous</button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNumber = Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
              return (
                <button key={pageNumber} onClick={() => setPage(pageNumber)} className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 cursor-pointer ${pageNumber === page ? 'text-white bg-blue-600 border border-blue-600' : 'text-slate-500 bg-white border border-slate-300 hover:bg-slate-50'}`}>{pageNumber}</button>
              );
            })}
            <button onClick={() => setPage(page + 1)} disabled={page === totalPages} className="px-3 py-2 text-sm font-medium text-slate-500 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">Next</button>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-800">{editingItem ? 'Edit Music' : 'New Music'}</h2>
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
                  <label className="block text-sm font-medium text-slate-700 mb-1">Artist</label>
                  <input type="text" value={formData.artist} onChange={(e) => handleFieldChange('artist', e.target.value)} className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.artist ? 'border-red-500' : 'border-slate-300'}`} />
                  {formErrors.artist && <p className="mt-1 text-xs text-red-600">{formErrors.artist}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Mood</label>
                  <input type="text" value={formData.mood} onChange={(e) => handleFieldChange('mood', e.target.value)} className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.mood ? 'border-red-500' : 'border-slate-300'}`} />
                  {formErrors.mood && <p className="mt-1 text-xs text-red-600">{formErrors.mood}</p>}
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
                  <label className="block text-sm font-medium text-slate-700 mb-1">Release Year</label>
                  <input type="number" min="1900" max={new Date().getFullYear() + 1} value={formData.releaseYear} onChange={(e) => handleFieldChange('releaseYear', Number(e.target.value))} className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.releaseYear ? 'border-red-500' : 'border-slate-300'}`} />
                  {formErrors.releaseYear && <p className="mt-1 text-xs text-red-600">{formErrors.releaseYear}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Duration (sec)</label>
                  <input type="number" min="1" value={formData.duration} onChange={(e) => handleFieldChange('duration', Number(e.target.value))} className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.duration ? 'border-red-500' : 'border-slate-300'}`} />
                  {formErrors.duration && <p className="mt-1 text-xs text-red-600">{formErrors.duration}</p>}
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <input id="isActive" type="checkbox" checked={!!formData.isActive} onChange={(e) => handleFieldChange('isActive', e.target.checked)} className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  <label htmlFor="isActive" className="text-sm text-slate-700">Active</label>
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
                    onChange={(url) => handleFieldChange('thumbnail', url)}
                    placeholder="Upload thumbnail"
                    folder="nellenest/music/thumbnails"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">File</label>
                  <FileUpload
                    type="video"
                    value={formData.audioUrl}
                    onChange={(url) => handleFieldChange('audioUrl', url)}
                    onError={(msg) => setFormErrors(prev => ({ ...prev, audioUrl: msg }))}
                    placeholder="Upload audio/video file"
                    folder="nellenest/music/files"
                  />
                  {formErrors.audioUrl && <p className="mt-1 text-xs text-red-600">{formErrors.audioUrl}</p>}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-slate-200">
              <button onClick={closeEditModal} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors duration-200 cursor-pointer" disabled={isLoading}>Cancel</button>
              <button onClick={handleSubmit} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" disabled={isLoading}>{isLoading ? (editingItem ? 'Updating…' : 'Creating…') : (editingItem ? 'Update Music' : 'Create Music')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicsContent;



