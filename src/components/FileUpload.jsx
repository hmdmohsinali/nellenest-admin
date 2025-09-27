import { useState, useRef } from 'react';
import { CloudArrowUpIcon, TrashIcon, DocumentIcon, MusicalNoteIcon } from '@heroicons/react/24/outline';
import { cloudinaryAPI } from '../services/cloudinary.service.js';

const FileUpload = ({ 
  type = 'image', // 'image' or 'audio'
  value = null, // current file URL or file object
  onChange, // callback function (url, fileData)
  onError, // callback for errors
  className = '',
  placeholder = '',
  accept = '',
  maxSize = 10 * 1024 * 1024, // 10MB default
  folder = ''
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (file) => {
    // Validate file size
    if (file.size > maxSize) {
      const maxSizeMB = Math.round(maxSize / (1024 * 1024));
      onError?.(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    // Validate file type
    const isValidType = type === 'image' 
      ? file.type.startsWith('image/')
      : file.type.startsWith('audio/') || file.type.startsWith('video/');
    
    if (!isValidType) {
      onError?.(`Please select a valid ${type} file`);
      return;
    }

    setIsUploading(true);
    
    try {
      const uploadResult = type === 'image' 
        ? await cloudinaryAPI.uploadImage(file, { folder })
        : await cloudinaryAPI.uploadAudio(file, { folder });

      if (uploadResult.success) {
        onChange?.(uploadResult.data.url, uploadResult.data);
      } else {
        onError?.(uploadResult.error || 'Upload failed');
      }
    } catch (error) {
      onError?.(error.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleInputChange = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleRemove = () => {
    onChange?.(null, null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getAcceptTypes = () => {
    if (accept) return accept;
    return type === 'image' 
      ? 'image/jpeg,image/jpg,image/png,image/webp,image/gif'
      : 'audio/mpeg,audio/wav,audio/mp3,audio/ogg,audio/aac,audio/m4a';
  };

  const getIcon = () => {
    if (type === 'image') {
      return <DocumentIcon className="w-8 h-8 text-slate-400" />;
    }
    return <MusicalNoteIcon className="w-8 h-8 text-slate-400" />;
  };

  const getPlaceholder = () => {
    if (placeholder) return placeholder;
    return type === 'image' 
      ? 'Click to upload or drag and drop an image'
      : 'Click to upload or drag and drop an audio file';
  };

  return (
    <div className={`relative ${className}`}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={getAcceptTypes()}
        onChange={handleInputChange}
        className="hidden"
      />

      {value ? (
        // File uploaded state
        <div className="border border-slate-300 rounded-md p-4 bg-slate-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getIcon()}
              <div>
                <p className="text-sm font-medium text-slate-700">
                  {type === 'image' ? 'Image uploaded' : 'Audio uploaded'}
                </p>
                <p className="text-xs text-slate-500 truncate max-w-xs">
                  {typeof value === 'string' ? value.split('/').pop() : value.name || 'File'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="text-red-600 hover:text-red-700 p-1"
              title="Remove file"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
          {typeof value === 'string' && value.startsWith('http') && (
            <div className="mt-2">
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:text-blue-700"
              >
                View file
              </a>
            </div>
          )}
        </div>
      ) : (
        // Upload area
        <div
          className={`border-2 border-dashed rounded-md p-6 text-center transition-colors cursor-pointer ${
            dragActive 
              ? 'border-blue-400 bg-blue-50' 
              : 'border-slate-300 hover:border-slate-400'
          } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <CloudArrowUpIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-sm text-slate-600 mb-2">
            {isUploading ? 'Uploading...' : getPlaceholder()}
          </p>
          <p className="text-xs text-slate-500">
            {type === 'image' 
              ? 'PNG, JPG, GIF, WebP up to 10MB'
              : 'MP3, WAV, OGG, AAC, M4A up to 10MB'
            }
          </p>
          {isUploading && (
            <div className="mt-3">
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;

