import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { fetchCurrentUser } from '../slices/authSlice';

/**
 * Component để bảo vệ các route dành riêng cho admin
 * Chỉ cho phép truy cập nếu người dùng đã đăng nhập và có quyền admin
 */
const AdminRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    // Nếu có token nhưng không có thông tin user, lấy thông tin user
    if (!loading && !user && localStorage.getItem('token')) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, loading, user]);

  // Log thông tin cho mục đích debug
  console.log('AdminRoute - Auth State:', { isAuthenticated, loading, user });

  if (loading) {
    // Hiển thị loading spinner nếu đang tải thông tin user
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // Kiểm tra xem người dùng đã đăng nhập và có quyền admin không
  if (!isAuthenticated || !user) {
    console.log('AdminRoute - Redirecting to login: Not authenticated');
    // Redirect đến trang đăng nhập nếu chưa đăng nhập
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Kiểm tra quyền admin
  if (!user.isAdmin && user.role !== 'admin') {
    console.log('AdminRoute - Redirecting to dashboard: Not admin');
    // Redirect đến dashboard nếu không có quyền admin
    return <Navigate to="/dashboard" replace />;
  }

  // Nếu user đã đăng nhập và có quyền admin, render children
  return children;
};

export default AdminRoute; 