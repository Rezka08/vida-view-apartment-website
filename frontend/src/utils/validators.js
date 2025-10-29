// Validation utilities

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate Indonesian phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} Is valid phone
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^(\+62|62|0)[0-9]{9,12}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} Validation result with isValid and message
 */
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, message: 'Password tidak boleh kosong' };
  }
  
  if (password.length < 6) {
    return { isValid: false, message: 'Password minimal 6 karakter' };
  }
  
  if (password.length > 50) {
    return { isValid: false, message: 'Password maksimal 50 karakter' };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Validate required field
 * @param {any} value - Value to validate
 * @param {string} fieldName - Field name for error message
 * @returns {object} Validation result
 */
export const validateRequired = (value, fieldName = 'Field') => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return { isValid: false, message: `${fieldName} tidak boleh kosong` };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Validate date range
 * @param {Date|string} startDate - Start date
 * @param {Date|string} endDate - End date
 * @returns {object} Validation result
 */
export const validateDateRange = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  
  if (start < now) {
    return { isValid: false, message: 'Tanggal mulai tidak boleh di masa lalu' };
  }
  
  if (end <= start) {
    return { isValid: false, message: 'Tanggal selesai harus setelah tanggal mulai' };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Validate file size
 * @param {File} file - File to validate
 * @param {number} maxSizeInMB - Maximum size in MB
 * @returns {object} Validation result
 */
export const validateFileSize = (file, maxSizeInMB = 16) => {
  if (!file) {
    return { isValid: false, message: 'File tidak boleh kosong' };
  }
  
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  
  if (file.size > maxSizeInBytes) {
    return { 
      isValid: false, 
      message: `Ukuran file maksimal ${maxSizeInMB}MB` 
    };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Validate file type
 * @param {File} file - File to validate
 * @param {string[]} allowedTypes - Array of allowed MIME types
 * @returns {object} Validation result
 */
export const validateFileType = (file, allowedTypes = []) => {
  if (!file) {
    return { isValid: false, message: 'File tidak boleh kosong' };
  }
  
  if (allowedTypes.length === 0) {
    return { isValid: true, message: '' };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { 
      isValid: false, 
      message: 'Tipe file tidak diizinkan' 
    };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Validate number range
 * @param {number} value - Value to validate
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @param {string} fieldName - Field name for error message
 * @returns {object} Validation result
 */
export const validateNumberRange = (value, min, max, fieldName = 'Nilai') => {
  if (isNaN(value)) {
    return { isValid: false, message: `${fieldName} harus berupa angka` };
  }
  
  if (value < min) {
    return { isValid: false, message: `${fieldName} minimal ${min}` };
  }
  
  if (value > max) {
    return { isValid: false, message: `${fieldName} maksimal ${max}` };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Validate Indonesian ID card number (KTP)
 * @param {string} idNumber - ID card number
 * @returns {object} Validation result
 */
export const validateIDCard = (idNumber) => {
  if (!idNumber) {
    return { isValid: false, message: 'Nomor KTP tidak boleh kosong' };
  }
  
  const cleaned = idNumber.replace(/\D/g, '');
  
  if (cleaned.length !== 16) {
    return { isValid: false, message: 'Nomor KTP harus 16 digit' };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Validate form data
 * @param {object} data - Form data to validate
 * @param {object} rules - Validation rules
 * @returns {object} Validation errors
 */
export const validateForm = (data, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const rule = rules[field];
    const value = data[field];
    
    if (rule.required) {
      const result = validateRequired(value, rule.label || field);
      if (!result.isValid) {
        errors[field] = result.message;
        return;
      }
    }
    
    if (rule.email && value) {
      if (!isValidEmail(value)) {
        errors[field] = 'Format email tidak valid';
        return;
      }
    }
    
    if (rule.phone && value) {
      if (!isValidPhone(value)) {
        errors[field] = 'Format nomor telepon tidak valid';
        return;
      }
    }
    
    if (rule.minLength && value) {
      if (value.length < rule.minLength) {
        errors[field] = `Minimal ${rule.minLength} karakter`;
        return;
      }
    }
    
    if (rule.maxLength && value) {
      if (value.length > rule.maxLength) {
        errors[field] = `Maksimal ${rule.maxLength} karakter`;
        return;
      }
    }
    
    if (rule.min !== undefined && value) {
      if (Number(value) < rule.min) {
        errors[field] = `Nilai minimal ${rule.min}`;
        return;
      }
    }
    
    if (rule.max !== undefined && value) {
      if (Number(value) > rule.max) {
        errors[field] = `Nilai maksimal ${rule.max}`;
        return;
      }
    }
  });
  
  return errors;
};

export default {
  isValidEmail,
  isValidPhone,
  validatePassword,
  validateRequired,
  validateDateRange,
  validateFileSize,
  validateFileType,
  validateNumberRange,
  validateIDCard,
  validateForm
};