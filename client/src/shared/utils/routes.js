/**
 * Định nghĩa các đường dẫn (routes) cho ứng dụng
 */
export const path = {
  // Public routes
  PUBLIC: {
    HOMEPAGE:'/',
    ABOUTUS: '/about',
    CONTACT: '/contact',
    NOTFOUND: '/404',
    LOGINFORM:'/Login',
    REGISTERFORM:'/Register',
    ABOUTPAGE: '/about-us',
    TAROTREADINGS: '/tarot-readings',
    DAILYTAROT: '/daily-tarot',
    FORUM: '/forum',
    FORUM_POST: '/forum/post/:postId',
    FORUM_CREATE_POST: '/forum/create-post',
    FORUM_EDIT_POST: '/forum/edit-post/:postId',
    TAROTCARDS: '/tarot-cards',
    PRIVACY_POLICY: '/privacy-policy',
    TERMS: '/terms'
  },
  
  // Auth routes
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password/:token',
    ADMIN_LOGIN: '/admin/login',
    GOOGLE_CALLBACK: '/auth/google/callback'
  },
  
  // Protected routes
  PROTECTED: {
    PROFILE: '/profile',
    READING_HISTORY: '/reading-history',
    READING_DETAIL: '/reading-history/:id',
    SETTINGS: '/settings',
    DAILY_JOURNAL: '/daily-journal',
    JOURNAL: '/journal',
    JOURNAL_DETAIL: '/journal/:id',
    JOURNAL_NEW: '/journal/new',
    JOURNAL_EDIT: '/journal/:id/edit',
    PREMIUM_SERVICES: '/premium-services',
    PAYMENT: '/payment',
    PAYMENT_SUCCESS: '/payment-success'
  },

  // Admin routes
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    READINGS: '/admin/readings',
    SETTINGS: '/admin/settings',
    REPORTS: '/admin/reports'
  }
}; 