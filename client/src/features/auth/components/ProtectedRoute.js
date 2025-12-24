import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { fetchCurrentUser } from '../slices/authSlice';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    // If we have token but no user data, fetch user data
    if (!loading && !user && localStorage.getItem('token')) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, loading, user]);

  if (loading) {
    // You can replace this with a loading spinner component
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page if not authenticated
    // Save the location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated, render the protected component
  return children;
};

export default ProtectedRoute; 