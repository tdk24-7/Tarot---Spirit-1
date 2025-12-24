import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

const useRegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const { register, loading, error } = useAuth();

  // Clear form errors when inputs change
  useEffect(() => {
    if (name || email || password || confirmPassword) {
      setFormErrors({});
    }
  }, [name, email, password, confirmPassword]);

  const validateForm = () => {
    const errors = {};
    
    if (!name.trim()) {
      errors.name = 'Họ tên không được để trống';
    }
    
    if (!email.trim()) {
      errors.email = 'Email không được để trống';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email không hợp lệ';
    }
    
    if (!password) {
      errors.password = 'Mật khẩu không được để trống';
    } else if (password.length < 6) {
      errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }
    
    if (!agreeTerms) {
      errors.agreeTerms = 'Bạn phải đồng ý với điều khoản dịch vụ';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const userData = {
        name,
        email,
        password
      };
      
      await register(userData);
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setAgreeTerms(false);
    setFormErrors({});
  };

  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    agreeTerms,
    setAgreeTerms,
    formErrors,
    loading,
    error,
    handleSubmit,
    resetForm
  };
};

export default useRegisterForm;
