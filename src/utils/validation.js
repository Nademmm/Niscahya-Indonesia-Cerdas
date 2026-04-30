/**
 * Form validation utilities
 */

export const validations = {
  // Blog/Product titles
  minTitleLength: 3,
  maxTitleLength: 255,
  
  // Content/Description
  minContentLength: 10,
  maxContentLength: 100000,
  
  // File uploads
  maxFileSizeBytes: 5 * 1024 * 1024, // 5MB
  maxImageDimensionsWidth: 4000,
  maxImageDimensionsHeight: 4000,
  acceptedImageMimes: ['image/jpeg', 'image/png', 'image/webp'],
};

/**
 * Validate blog/product title
 */
export function validateTitle(title) {
  if (!title || typeof title !== 'string') {
    return { valid: false, error: 'Judul harus berupa teks' };
  }
  
  const trimmed = title.trim();
  if (trimmed.length < validations.minTitleLength) {
    return { valid: false, error: `Judul minimal ${validations.minTitleLength} karakter` };
  }
  if (trimmed.length > validations.maxTitleLength) {
    return { valid: false, error: `Judul maksimal ${validations.maxTitleLength} karakter` };
  }
  
  return { valid: true };
}

/**
 * Validate content/description
 */
export function validateContent(content) {
  if (!content || typeof content !== 'string') {
    return { valid: false, error: 'Konten harus berupa teks' };
  }
  
  const trimmed = content.trim();
  if (trimmed.length < validations.minContentLength) {
    return { valid: false, error: `Konten minimal ${validations.minContentLength} karakter` };
  }
  if (trimmed.length > validations.maxContentLength) {
    return { valid: false, error: `Konten maksimal ${validations.maxContentLength} karakter` };
  }
  
  return { valid: true };
}

/**
 * Validate file for upload
 */
export async function validateImageFile(file) {
  if (!file || !(file instanceof File)) {
    return { valid: false, error: 'File tidak valid' };
  }
  
  // Check file size
  if (file.size > validations.maxFileSizeBytes) {
    return { 
      valid: false, 
      error: `Ukuran file maksimal ${(validations.maxFileSizeBytes / 1024 / 1024).toFixed(0)}MB` 
    };
  }
  
  // Check MIME type
  if (!validations.acceptedImageMimes.includes(file.type)) {
    return { 
      valid: false, 
      error: 'Format file harus JPG, PNG, atau WebP' 
    };
  }
  
  // Check image dimensions
  try {
    const dimensions = await getImageDimensions(file);
    if (dimensions.width > validations.maxImageDimensionsWidth || 
        dimensions.height > validations.maxImageDimensionsHeight) {
      return { 
        valid: false, 
        error: `Resolusi maksimal ${validations.maxImageDimensionsWidth}x${validations.maxImageDimensionsHeight}px` 
      };
    }
  } catch (error) {
    return { valid: false, error: 'Gagal membaca informasi gambar' };
  }
  
  return { valid: true };
}

/**
 * Get image dimensions
 */
function getImageDimensions(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.width, height: img.height });
      img.onerror = () => reject(new Error('Invalid image'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Validate category is in allowed list
 */
export function validateCategory(category, allowedCategories) {
  if (!allowedCategories.includes(category)) {
    return { valid: false, error: 'Kategori tidak valid' };
  }
  return { valid: true };
}
