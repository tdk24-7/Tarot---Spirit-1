// client/src/shared/routes/routes.js
import { lazy } from 'react';
import { path } from '../utils/constant';

// Lazy load components
const HomePage = lazy(() => import('../../pages/public/HomePage'));
const GoogleCallback = lazy(() => import('../../features/auth/components/GoogleCallback')); // <--- THÊM DÒNG NÀY
const AboutPage = lazy(() => import('../../pages/public/AboutPage'));
const ForumPage = lazy(() => import('../../pages/public/ForumPage'));
const ForumPostDetailPage = lazy(() => import('../../pages/public/ForumPostDetailPage'));
const CreateForumPostPage = lazy(() => import('../../pages/public/CreateForumPostPage'));
const EditForumPostPage = lazy(() => import('../../pages/public/EditForumPostPage'));
const TarotCardsPage = lazy(() => import('../../pages/public/TarotCardsPage'));
const TarotReadingsPage = lazy(() => import('../../pages/public/TarotReadingsPage'));
const DailyTarotPage = lazy(() => import('../../pages/public/DailyTarotPage'));
const AuthPage = lazy(() => import('../../pages/public/AuthPage'));
const NotFoundPage = lazy(() => import('../../pages/public/404'));

// Protected pages
const DashboardPage = lazy(() => import('../../pages/protected/DashboardPage'));
const ProfilePage = lazy(() => import('../../pages/protected/ProfilePage'));
const ReadingHistoryPage = lazy(() => import('../../pages/protected/ReadingHistoryPage'));
const ReadingDetailPage = lazy(() => import('../../pages/protected/ReadingDetailPage'));
const ReadingSelectionPage = lazy(() => import('../../pages/protected/ReadingSelectionPage'));
const ReadingExperiencePage = lazy(() => import('../../pages/protected/ReadingExperiencePage'));
const SettingsPage = lazy(() => import('../../pages/protected/SettingsPage'));
const JournalPage = lazy(() => import('../../features/user/pages/JournalPage'));
const JournalDetailPage = lazy(() => import('../../features/user/pages/JournalDetailPage'));
const JournalFormPage = lazy(() => import('../../features/user/pages/JournalFormPage'));

// Admin pages
const AdminDashboardPage = lazy(() => import('../../pages/admin/AdminDashboardPage'));

// Public routes
export const publicRoutes = [
  { path: path.PUBLIC.HOMEPAGE, component: HomePage },
  { path: path.PUBLIC.ABOUT, component: AboutPage },
  { path: path.PUBLIC.FORUM, component: ForumPage },
  { path: path.PUBLIC.FORUM_POST, component: ForumPostDetailPage },
  { path: path.PUBLIC.FORUM_CREATE_POST, component: CreateForumPostPage },
  { path: path.PUBLIC.FORUM_EDIT_POST, component: EditForumPostPage },
  { path: path.PUBLIC.TAROTCARDS, component: TarotCardsPage },
  { path: path.PUBLIC.CARD_DETAIL, component: TarotCardsPage },
  { path: path.PUBLIC.TAROTREADINGS, component: TarotReadingsPage },
  { path: path.PUBLIC.DAILYTAROT, component: DailyTarotPage },
  { path: path.AUTH.LOGIN, component: AuthPage },
  { path: path.AUTH.REGISTER, component: AuthPage },
  { path: path.AUTH.FORGOT_PASSWORD, component: AuthPage },
  { path: path.AUTH.RESET_PASSWORD, component: AuthPage },
  { path: path.AUTH.GOOGLE_CALLBACK, component: GoogleCallback }, // <--- THÊM DÒNG NÀY
  { path: path.PUBLIC.NOTFOUND, component: NotFoundPage },
];

// Protected routes (require authentication)
export const protectedRoutes = [
  { path: path.PROTECTED.DASHBOARD, component: DashboardPage },
  { path: path.PROTECTED.PROFILE, component: ProfilePage },
  { path: path.PROTECTED.READING_HISTORY, component: ReadingHistoryPage },
  { path: path.PROTECTED.READING_DETAIL, component: ReadingDetailPage },
  { path: path.PROTECTED.NEW_READING, component: ReadingSelectionPage },
  { path: path.PROTECTED.SETTINGS, component: SettingsPage },
  { path: path.PROTECTED.JOURNAL, component: JournalPage },
  { path: path.PROTECTED.JOURNAL_DETAIL, component: JournalDetailPage },
  { path: path.PROTECTED.JOURNAL_NEW, component: JournalFormPage },
  { path: path.PROTECTED.JOURNAL_EDIT, component: JournalFormPage },
];

// Admin routes (require admin role)
export const adminRoutes = [
  { path: path.ADMIN.DASHBOARD, component: AdminDashboardPage }
];