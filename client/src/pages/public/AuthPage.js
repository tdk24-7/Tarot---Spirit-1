import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import LoginForm from '../../features/auth/components/LoginForm';
import RegisterForm from '../../features/auth/components/RegisterForm';
import ForgotPasswordForm from '../../features/auth/components/ForgotPasswordForm';
import ResetPasswordForm from '../../features/auth/components/ResetPasswordForm';
import { useAuth } from '../../features/auth/hook/useAuth';
import { path } from '../../shared/utils/routes';

const AuthPage = () => {
  const [authMode, setAuthMode] = useState('login');
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const { isAuthenticated } = useAuth();
  const [message, setMessage] = useState('');
  
  // Extract redirect info from location state
  const from = location.state?.from || path.PROTECTED.DASHBOARD;
  
  useEffect(() => {
    // Set message from location state if it exists
    if (location.state?.message) {
      setMessage(location.state.message);
    }
  }, [location.state]);
  
  // Check if user is already authenticated
  useEffect(() => {
    if (isAuthenticated && authMode !== 'reset-password') {
      // Navigate to the 'from' path if it exists, otherwise to dashboard
      navigate(from);
    }
  }, [isAuthenticated, navigate, authMode, from]);
  
  // Determine mode based on URL
  useEffect(() => {
    console.log('Current path:', location.pathname);
    
    if (location.pathname === path.AUTH.LOGIN) {
      console.log('Setting auth mode to login');
      setAuthMode('login');
    } else if (location.pathname === path.AUTH.REGISTER) {
      console.log('Setting auth mode to register');
      setAuthMode('register');
    } else if (location.pathname === path.AUTH.FORGOT_PASSWORD) {
      console.log('Setting auth mode to forgot-password');
      setAuthMode('forgot-password');
    } else if (location.pathname.startsWith('/reset-password/')) {
      console.log('Setting auth mode to reset-password');
      setAuthMode('reset-password');
    }
  }, [location.pathname]);
  
  const handleSwitchMode = (mode) => {
    console.log('Switching mode to:', mode);
    
    switch (mode) {
      case 'login':
        navigate(path.AUTH.LOGIN, { state: { from, message } });
        break;
      case 'register':
        navigate(path.AUTH.REGISTER, { state: { from, message } });
        break;
      case 'forgot-password':
        navigate(path.AUTH.FORGOT_PASSWORD, { state: { from, message } });
        break;
      default:
        navigate(path.AUTH.LOGIN, { state: { from, message } });
    }
  };
  
  const handleClose = () => {
    navigate('/');
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#170b36] to-[#0f0a23] p-4">
      {/* Decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full filter blur-3xl"></div>
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-violet-500/5 rounded-full filter blur-3xl"></div>
      </div>
      
      <AnimatePresence mode="wait">
        {authMode === 'login' && (
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md mx-auto"
          >
            <LoginForm 
              onClose={handleClose} 
              onSwitchToRegister={() => handleSwitchMode('register')}
              onSwitchToForgotPassword={() => handleSwitchMode('forgot-password')}
              message={message}
              redirectPath={from}
            />
          </motion.div>
        )}
        
        {authMode === 'register' && (
          <motion.div
            key="register"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md mx-auto"
          >
            <RegisterForm 
              onClose={handleClose} 
              onSwitchToLogin={() => handleSwitchMode('login')}
              message={message}
              redirectPath={from}
            />
          </motion.div>
        )}
        
        {authMode === 'forgot-password' && (
          <motion.div
            key="forgot-password"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md mx-auto"
          >
            <ForgotPasswordForm 
              onClose={handleClose} 
              onSwitchToLogin={() => handleSwitchMode('login')}
            />
          </motion.div>
        )}
        
        {authMode === 'reset-password' && (
          <motion.div
            key="reset-password"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md mx-auto"
          >
            <ResetPasswordForm 
              onClose={handleClose}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AuthPage; 