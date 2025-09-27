# Cloudinary Setup Guide

This guide explains how to set up Cloudinary for file uploads in the Nellenest Admin Dashboard.

## Prerequisites

1. A Cloudinary account (sign up at [cloudinary.com](https://cloudinary.com))
2. Your Cloudinary cloud name, API key, and API secret

## Setup Steps

### 1. Create Cloudinary Account and Get Credentials

1. Go to [cloudinary.com](https://cloudinary.com) and create an account
2. After logging in, go to your dashboard
3. Note down your:
   - Cloud Name
   - API Key
   - API Secret

### 2. Create Upload Preset

1. In your Cloudinary dashboard, go to Settings → Upload
2. Scroll down to "Upload presets"
3. Click "Add upload preset"
4. Configure the preset:
   - **Preset name**: `ml_default`
   - **Signing Mode**: `Unsigned` (for client-side uploads)
   - **Folder**: `nellenest/` (optional)
   - **Access Mode**: `Public`
5. Save the preset

### 3. Configure Environment Variables

Create a `.env` file in your project root with the following variables:

```bash
# Cloudinary Configuration
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
VITE_CLOUDINARY_API_KEY=your_api_key_here
VITE_CLOUDINARY_API_SECRET=your_api_secret_here
VITE_CLOUDINARY_UPLOAD_PRESET=ml_default
```

Replace the placeholder values with your actual Cloudinary credentials.

### 4. Restart Development Server

After adding the environment variables, restart your development server:

```bash
npm run dev
```

## File Upload Features

The updated course creation form now supports:

### Thumbnail Uploads
- **Supported formats**: JPEG, PNG, WebP, GIF
- **Max size**: 10MB
- **Storage location**: `nellenest/courses/thumbnails/`
- **Auto-optimization**: Images are automatically optimized for web

### Audio Uploads
- **Supported formats**: MP3, WAV, OGG, AAC, M4A
- **Max size**: 10MB
- **Storage location**: `nellenest/courses/audio/`
- **Duration detection**: Audio duration is automatically detected

## Usage

### Creating a New Course

1. Click "Create Course" button
2. Fill in course details (name, description, category, etc.)
3. **For thumbnail**: Use the file upload area instead of entering a URL
4. **For voice versions**: Use the audio file upload for each voice version instead of entering URLs
5. Click "Create Course" to save

### Editing an Existing Course

1. Click the edit button on any course
2. Update course details
3. Replace existing thumbnail or audio files by uploading new ones
4. Click "Update Course" to save changes

## File Management

### Automatic File Cleanup
- When uploading a new file to replace an existing one, the old file is automatically removed from Cloudinary
- Files are organized in folders for easy management

### File URLs
- All uploaded files receive secure HTTPS URLs
- URLs are automatically optimized for delivery
- Files are stored in a CDN for fast global access

## Troubleshooting

### Common Issues

1. **"Upload failed" error**
   - Check your Cloudinary credentials in `.env`
   - Verify the upload preset exists and is unsigned
   - Ensure your Cloudinary account has sufficient storage

2. **File size too large**
   - Maximum file size is 10MB for both images and audio
   - Compress files if they exceed this limit

3. **Unsupported file format**
   - Images: Only JPEG, PNG, WebP, GIF are supported
   - Audio: Only MP3, WAV, OGG, AAC, M4A are supported

4. **Environment variables not loading**
   - Ensure `.env` file is in the project root
   - Restart the development server after adding variables
   - Check that variable names start with `VITE_`

### Testing the Integration

1. Create a test course with a thumbnail and audio file
2. Verify files appear in your Cloudinary dashboard
3. Check that the URLs in the course data are valid Cloudinary URLs

## Security Notes

- API secret is only used server-side for file deletion operations
- Upload presets are unsigned for client-side uploads
- All files are stored with public access (consider private storage for sensitive content)
- File URLs are secure HTTPS by default

## Cost Considerations

- Cloudinary offers a free tier with generous limits
- Monitor your usage in the Cloudinary dashboard
- Consider upgrading your plan if you exceed free tier limits

