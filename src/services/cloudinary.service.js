// Cloudinary configuration for client-side uploads
const CLOUDINARY_CONFIG = {
  cloud_name: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  api_key: import.meta.env.VITE_CLOUDINARY_API_KEY,
  api_secret: import.meta.env.VITE_CLOUDINARY_API_SECRET,
  upload_preset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'ml_default'
};

// Cloudinary API Service
export const cloudinaryAPI = {
  // Upload image file (for thumbnails)
  uploadImage: async (file, options = {}) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_CONFIG.upload_preset);
      formData.append('folder', options.folder || 'nellenest/courses/thumbnails');
      
      // Add transformation options
      if (options.width || options.height) {
        formData.append('transformation', `w_${options.width || 'auto'},h_${options.height || 'auto'},c_fill,f_auto,q_auto`);
      }

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloud_name}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `Upload failed: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: {
          url: data.secure_url,
          publicId: data.public_id,
          width: data.width,
          height: data.height,
          format: data.format,
          bytes: data.bytes
        }
      };
    } catch (error) {
      console.error('Image upload error:', error);
      return {
        success: false,
        error: error.message || 'Failed to upload image'
      };
    }
  },

  // Upload audio file (for voice versions)
  uploadAudio: async (file, options = {}) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_CONFIG.upload_preset);
      formData.append('folder', options.folder || 'nellenest/courses/audio');
      formData.append('resource_type', 'video'); // Cloudinary treats audio as video resource type
      
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloud_name}/video/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `Upload failed: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: {
          url: data.secure_url,
          publicId: data.public_id,
          duration: data.duration,
          format: data.format,
          bytes: data.bytes
        }
      };
    } catch (error) {
      console.error('Audio upload error:', error);
      return {
        success: false,
        error: error.message || 'Failed to upload audio'
      };
    }
  },

  // Delete file from Cloudinary
  deleteFile: async (publicId, resourceType = 'image') => {
    try {
      const formData = new FormData();
      formData.append('public_id', publicId);
      formData.append('api_key', CLOUDINARY_CONFIG.api_key);
      formData.append('api_secret', CLOUDINARY_CONFIG.api_secret);
      formData.append('resource_type', resourceType);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloud_name}/${resourceType}/destroy`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `Delete failed: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: data.result === 'ok',
        data: data
      };
    } catch (error) {
      console.error('Delete error:', error);
      return {
        success: false,
        error: error.message || 'Failed to delete file'
      };
    }
  },

  // Get file info
  getFileInfo: async (publicId, resourceType = 'image') => {
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloud_name}/${resourceType}/resources/${resourceType}/${publicId}`,
        {
          headers: {
            'Authorization': `Basic ${btoa(`${CLOUDINARY_CONFIG.api_key}:${CLOUDINARY_CONFIG.api_secret}`)}`
          }
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `Failed to get file info: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error('Get file info error:', error);
      return {
        success: false,
        error: error.message || 'Failed to get file info'
      };
    }
  }
};

export default cloudinaryAPI;
