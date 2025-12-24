/**
 * Tệp cấu hình cho các hằng số trong ứng dụng
 */

// API URL dựa vào môi trường
let baseApiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';

// Thêm kiểm tra để đảm bảo API_URL không có '/api' ở cuối
if (baseApiUrl.endsWith('/api')) {
  baseApiUrl = baseApiUrl.substring(0, baseApiUrl.length - 4);
}

export const API_URL = `${baseApiUrl}/api`;

// Cloudinary configuration
export const CLOUDINARY_CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || 'dfp2ne3nn';
export const CLOUDINARY_UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || 'tarot_app';

// Pagination
export const DEFAULT_PAGE_SIZE = 10;

// Tarot reading types
export const READING_TYPES = {
  STANDARD: 'standard',
  AI: 'ai',
  DAILY: 'daily'
};

// Tarot domains/topics mapping
export const TAROT_TOPICS = {
  love: { id: 1, name: 'Tình Yêu' },
  career: { id: 2, name: 'Sự Nghiệp' },
  finance: { id: 3, name: 'Tài Chính' },
  health: { id: 4, name: 'Sức Khỏe' },
  spiritual: { id: 5, name: 'Tâm Linh' }
};

// Tarot spreads
export const TAROT_SPREADS = {
  THREE_CARD: { id: 1, name: 'Ba Lá', positions: ['Bản thân', 'Hoàn cảnh', 'Lời khuyên'] },
  SINGLE_CARD: { id: 2, name: 'Một Lá', positions: ['Thông Điệp'] }
};

// Local storage keys
export const LOCAL_STORAGE_KEYS = {
  AUTH_TOKEN: 'tarotOnlineAuthToken',
  USER_INFO: 'tarotOnlineUserInfo',
  THEME: 'tarotOnlineTheme',
  READING_HISTORY: 'tarotOnlineReadingHistory'
};

export default {
  API_URL,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_UPLOAD_PRESET,
  DEFAULT_PAGE_SIZE,
  READING_TYPES,
  TAROT_TOPICS,
  TAROT_SPREADS,
  LOCAL_STORAGE_KEYS
}; 