export const uploadToCloudinary = async (file: File, onProgress?: (progress: number) => void): Promise<string> => {
  // @ts-ignore
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'djbpdys2q';
  // @ts-ignore
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'gfxtfwhs';

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary configuration is missing. Please set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in the environment variables (App Settings).');
  }

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;
  
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        const progress = Math.round((e.loaded / e.total) * 100);
        onProgress(progress);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        resolve(response.secure_url);
      } else {
        try {
          const error = JSON.parse(xhr.responseText);
          reject(new Error(error.error?.message || 'Upload failed. Check your Cloudinary Cloud Name and Upload Preset settings.'));
        } catch {
          reject(new Error('Upload failed with status: ' + xhr.status));
        }
      }
    };

    xhr.onerror = () => reject(new Error('Network error during upload to Cloudinary'));

    const fd = new FormData();
    fd.append('file', file);
    fd.append('upload_preset', uploadPreset);
    // Let cloudinary automatically determine the resource type (image, raw, etc)
    
    xhr.send(fd);
  });
};
