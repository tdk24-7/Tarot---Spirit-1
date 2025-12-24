import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const useLoginForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const navigate = useNavigate();

  const openLoginModal = () => {
    setIsOpen(true);
    setIsRegisterMode(false);
  };

  const openRegisterModal = () => {
    setIsOpen(true);
    setIsRegisterMode(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const switchToLogin = () => {
    setIsRegisterMode(false);
  };

  const switchToRegister = () => {
    setIsRegisterMode(true);
  };

  const redirectToLoginPage = () => {
    navigate('/login');
  };

  const redirectToRegisterPage = () => {
    navigate('/register');
  };

  return {
    isOpen,
    isRegisterMode,
    openLoginModal,
    openRegisterModal,
    closeModal,
    switchToLogin,
    switchToRegister,
    redirectToLoginPage,
    redirectToRegisterPage
  };
};

export default useLoginForm;
