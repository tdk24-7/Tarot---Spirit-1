import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoginForm from './features/auth/components/LoginForm';
import NotFound from './pages/public/404';
import RegisterForm from './features/auth/components/RegisterForm';
import { path } from './shared/utils/routes';
import HomePage from './pages/public/HomePage';
import AboutPage from './pages/public/AboutPage';
import TarotReadingsPage from './pages/public/TarotReadingsPage';
import DailyTarotPage from './pages/public/DailyTarotPage';
import ForumPage from './pages/public/ForumPage';
import ForumPostDetailPage from './pages/public/ForumPostDetailPage';
import CreateForumPostPage from './pages/public/CreateForumPostPage';
import EditForumPostPage from './pages/public/EditForumPostPage';
import TarotCardsPage from './pages/public/TarotCardsPage';
import AuthPage from './pages/public/AuthPage';
import ProfilePage from './pages/protected/ProfilePage';
import ReadingHistoryPage from './pages/protected/ReadingHistoryPage';
import ReadingDetailPage from './pages/protected/ReadingDetailPage';
import DashboardPage from './pages/protected/DashboardPage';
import PremiumServicesPage from './pages/protected/PremiumServicesPage';
import PaymentPage from './pages/protected/PaymentPage';
import PaymentSuccessPage from './pages/protected/PaymentSuccessPage';
import JournalPage from './features/user/pages/JournalPage';
import JournalDetailPage from './features/user/pages/JournalDetailPage';
import JournalFormPage from './features/user/pages/JournalFormPage';
import ProtectedRoute from './features/auth/components/ProtectedRoute';
import AdminRoute from './features/auth/components/AdminRoute';
import { fetchCurrentUser } from './features/auth/slices/authSlice';
import PrivacyPolicyPage from './pages/public/PrivacyPolicyPage';
import TermsPage from './pages/public/TermsPage';
import { AuthProvider } from './context/AuthContext';

function App() {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // Import các component admin một cách động để tránh vấn đề casing
  // Chỉ import khi component được render
  const AdminIndex = React.useMemo(() => React.lazy(() => import('./pages/admin/index')), []);
  const AdminDashboard = React.useMemo(() => React.lazy(() => import('./pages/admin/dashboard')), []);
  const AdminUsers = React.useMemo(() => React.lazy(() => import('./pages/admin/users')), []);
  const AdminUserDetail = React.useMemo(() => React.lazy(() => import('./pages/admin/users/[id]')), []);
  const AdminTarot = React.useMemo(() => React.lazy(() => import('./pages/admin/tarot')), []);
  const AdminPremium = React.useMemo(() => React.lazy(() => import('./pages/admin/premium')), []);
  const AdminForum = React.useMemo(() => React.lazy(() => import('./pages/admin/forum')), []);
  const AdminReports = React.useMemo(() => React.lazy(() => import('./pages/admin/reports')), []);
  const AdminSettings = React.useMemo(() => React.lazy(() => import('./pages/admin/settings')), []);
  const AdminAnalytics = React.useMemo(() => React.lazy(() => import('./pages/admin/analytics')), []);

  // Check authentication status when app loads
  useEffect(() => {
    // Chỉ fetch dữ liệu nếu có token và chưa có user data
    if (localStorage.getItem('token') && !user) {
      console.log('App.js: Fetching user data once');
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, user]);

  // Loading component cho Suspense
  const LoadingFallback = React.useMemo(() => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
    </div>
  ), []);

  return (  
    <Router>
      <AuthProvider>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" />
        <Routes>
          {/* Public Routes */}
          <Route path={path.PUBLIC.HOMEPAGE} element={<HomePage />} />
          <Route path={path.AUTH.LOGIN} element={<AuthPage />} />
          <Route path={path.AUTH.REGISTER} element={<AuthPage />} />
          <Route path={path.AUTH.FORGOT_PASSWORD} element={<AuthPage />} />
          <Route path={path.AUTH.RESET_PASSWORD} element={<AuthPage />} />
          <Route path={path.PUBLIC.ABOUTPAGE} element={<AboutPage />} />
          <Route path={path.PUBLIC.TAROTREADINGS} element={
            <ProtectedRoute>
              <TarotReadingsPage />
            </ProtectedRoute>
          } />
          <Route path={path.PUBLIC.DAILYTAROT} element={
            <ProtectedRoute>
              <DailyTarotPage />
            </ProtectedRoute>
          } />
          <Route path={path.PUBLIC.FORUM} element={
            <ProtectedRoute>
              <ForumPage />
            </ProtectedRoute>
          } />
          <Route path={path.PUBLIC.FORUM_POST} element={
            <ProtectedRoute>
              <ForumPostDetailPage />
            </ProtectedRoute>
          } />
          <Route path={path.PUBLIC.FORUM_CREATE_POST} element={
            <ProtectedRoute>
              <CreateForumPostPage />
            </ProtectedRoute>
          } />
          <Route path={path.PUBLIC.FORUM_EDIT_POST} element={
            <ProtectedRoute>
              <EditForumPostPage />
            </ProtectedRoute>
          } />
          <Route path={path.PUBLIC.TAROTCARDS} element={<TarotCardsPage />} />
          <Route path={path.PUBLIC.PRIVACY_POLICY} element={<PrivacyPolicyPage />} />
          <Route path={path.PUBLIC.TERMS} element={<TermsPage />} />
          
          {/* Protected Routes */}
          <Route path={path.PROTECTED.PROFILE} element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path={path.PROTECTED.READING_HISTORY} element={
            <ProtectedRoute>
              <ReadingHistoryPage />
            </ProtectedRoute>
          } />
          <Route path={path.PROTECTED.READING_DETAIL} element={
            <ProtectedRoute>
              <ReadingDetailPage />
            </ProtectedRoute>
          } />
          <Route path={path.PROTECTED.PREMIUM_SERVICES} element={
            <ProtectedRoute>
              <PremiumServicesPage />
            </ProtectedRoute>
          } />
          <Route path={path.PROTECTED.DAILY_JOURNAL} element={
            <ProtectedRoute>
              <JournalPage />
            </ProtectedRoute>
          } />
          <Route path={path.PROTECTED.JOURNAL} element={
            <ProtectedRoute>
              <JournalPage />
            </ProtectedRoute>
          } />
          <Route path={path.PROTECTED.JOURNAL_DETAIL} element={
            <ProtectedRoute>
              <JournalDetailPage />
            </ProtectedRoute>
          } />
          <Route path={path.PROTECTED.JOURNAL_NEW} element={
            <ProtectedRoute>
              <JournalFormPage />
            </ProtectedRoute>
          } />
          <Route path={path.PROTECTED.JOURNAL_EDIT} element={
            <ProtectedRoute>
              <JournalFormPage />
            </ProtectedRoute>
          } />
          <Route path={path.PROTECTED.DASHBOARD} element={
            <ProtectedRoute>
              {/* Sử dụng kiểm tra trực tiếp trong render */}
              {isAuthenticated && (user?.isAdmin || user?.role === 'admin') ? (
                <Navigate to={path.ADMIN.DASHBOARD} replace />
              ) : (
                <DashboardPage />
              )}
            </ProtectedRoute>
          } />
          <Route path={path.PROTECTED.PAYMENT} element={
            <ProtectedRoute>
              <PaymentPage />
            </ProtectedRoute>
          } />
          <Route path={path.PROTECTED.PAYMENT_SUCCESS} element={
            <ProtectedRoute>
              <PaymentSuccessPage />
            </ProtectedRoute>
          } />

          {/* Admin Routes với React.Suspense và lazy loading */}
          <Route path="/admin" element={
            <AdminRoute>
              <React.Suspense fallback={LoadingFallback}>
                <AdminIndex />
              </React.Suspense>
            </AdminRoute>
          } />
          <Route path={path.ADMIN.DASHBOARD} element={
            <AdminRoute>
              <React.Suspense fallback={LoadingFallback}>
                <AdminDashboard />
              </React.Suspense>
            </AdminRoute>
          } />
          <Route path={path.ADMIN.USERS} element={
            <AdminRoute>
              <React.Suspense fallback={LoadingFallback}>
                <AdminUsers />
              </React.Suspense>
            </AdminRoute>
          } />
          <Route path="/admin/users/:id" element={
            <AdminRoute>
              <React.Suspense fallback={LoadingFallback}>
                <AdminUserDetail />
              </React.Suspense>
            </AdminRoute>
          } />
          <Route path="/admin/tarot" element={
            <AdminRoute>
              <React.Suspense fallback={LoadingFallback}>
                <AdminTarot />
              </React.Suspense>
            </AdminRoute>
          } />
          <Route path="/admin/premium" element={
            <AdminRoute>
              <React.Suspense fallback={LoadingFallback}>
                <AdminPremium />
              </React.Suspense>
            </AdminRoute>
          } />
          <Route path="/admin/forum" element={
            <AdminRoute>
              <React.Suspense fallback={LoadingFallback}>
                <AdminForum />
              </React.Suspense>
            </AdminRoute>
          } />
          <Route path="/admin/reports" element={
            <AdminRoute>
              <React.Suspense fallback={LoadingFallback}>
                <AdminReports />
              </React.Suspense>
            </AdminRoute>
          } />
          <Route path="/admin/settings" element={
            <AdminRoute>
              <React.Suspense fallback={LoadingFallback}>
                <AdminSettings />
              </React.Suspense>
            </AdminRoute>
          } />
          <Route path="/admin/analytics" element={
            <AdminRoute>
              <React.Suspense fallback={LoadingFallback}>
                <AdminAnalytics />
              </React.Suspense>
            </AdminRoute>
          } />
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;